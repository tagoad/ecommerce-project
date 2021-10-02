const User = require('../models/user')
const crypt = require('bcryptjs')
const { validationResult } = require('express-validator/check')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key: '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'
    }
}))

exports.getLogin = (req, res, next) => {
    res.render('pages/login', {
        path: '/login',
        title: 'Welcome!',
        message: req.query.message,
        csrf: req.csrfToken(),
        oldInputs: {
            email: ""
        }
    })
}

exports.getRegister = (req, res, next) => {
    res.render('pages/register', {
        path: '/register',
        title: 'Register New User',
        message: req.query.message,
        csrf: req.csrfToken(),
        oldInputs: {
            name: "",
            email: ""
        }
    })
}

exports.getReset = (req, res, next) =>{
    res.render('pages/reset', {
        path: '/reset',
        title: 'Reset Password',
        message: req.query.message,
        csrf: req.csrfToken()
    })
}

exports.postLogin = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(422).render('pages/login', {
            path: '/login',
            title: 'Welcome!',
            message: errors.array()[0].msg,
            csrf: req.csrfToken(),
            oldInputs: {
                email: req.body.email
            }
        })
    }
    const email = req.body.email
    const password = req.body.password
    User.findOne({ email: email}).then(user => {
        crypt.compare(password, user.password).then(doMatch => {
            if(doMatch) {
                req.session.isAuth = true
                if(user.level == 2){
                    req.session.isAdmin = true
                }
                req.session.user = user
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                });
            } else {
                return res.status(422).render('pages/login', {
                    path: '/login',
                    title: 'Welcome!',
                    message: 'Invalid Password',
                    csrf: req.csrfToken(),
                    oldInputs: {
                        email: email
                    }
                })
            }
        }).catch(err => {
            console.log(err)
            res.redirect('/login')
        }).catch(err => console.log(err))
    })
}

exports.postRegister = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(422).render('pages/register', {
            path: '/register',
            title: 'Register New User',
            message: errors.array()[0].msg,
            csrf: req.csrfToken(),
            oldInputs: {
                name: req.body.name,
                email: req.body.email
            }
        })
    }
    crypt.hash(req.body.password, 12).then(hashed => {
        const newUser = new User({
            name: req.body.name,
            level: 1,
            email: req.body.email,
            password: hashed,
            cart: []
        })
        return newUser.save()
    }).then(result => {
        res.redirect('/auth/')
        // return transporter.sendMail({
        //     to: req.body.email,
        //     from: 'shop@binaryforge.io',
        //     subject: 'Email Verification',
        //     html: '<h1>Welcome!</h1><p>Here is your first email to verify your account!</p>'
        // })
    }).catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/')
    })
}