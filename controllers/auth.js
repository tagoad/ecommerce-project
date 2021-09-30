const User = require('../models/user')
const crypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
    res.render('pages/login', {
        path: '/login',
        title: 'Welcome!',
        message: req.query.message,
        csrf: req.csrfToken()
    })
}

exports.getRegister = (req, res, next) => {
    res.render('pages/register', {
        path: '/register',
        title: 'Register New User',
        message: req.query.message,
        csrf: req.csrfToken()
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    User.findOne({ email: email}).then(user => {
        if(!user){
            return res.redirect('/auth?message=No User Found')
        }
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
                return res.redirect('/auth?message=Invalid Password Combo')
            }
        }).catch(err => {
            console.log(err)
            res.redirect('/login')
        }).catch(err => console.log(err))
    })
}

exports.postRegister = (req, res, next) => {
    if(req.body.password != req.body.confirmPassword){
        return res.redirect('/auth/register?message=Passwords must match!')
    }
    User.findOne({ email: req.body.email}).then(userDoc => {
        if(userDoc){
            return res.redirect('/auth/register?message=Email already exists')
        }
        return crypt.hash(req.body.password, 12).then(hashed => {
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
        })
    })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/')
    })
}