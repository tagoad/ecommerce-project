
const express = require('express');
const router = express.Router();
const User = require('../models/user')
const { check }= require('express-validator/check')
const authController = require('../controllers/auth');

router.get('/', authController.getLogin)

router.get('/register', authController.getRegister)

router.post('/login', check('email').isEmail().withMessage('Invalid Email').custom((value, { req }) => {
    return User.findOne({ email: req.body.email}).then(userDoc => {
        if(!userDoc){
            return Promise.reject('No User Found')
        }
    })
}),
check('password').isLength({min:1}).withMessage('Please Enter Password'),
authController.postLogin)

router.post('/newUser',
    check('name').isLength({min: 1}).withMessage('Please Enter Name'),
    check('email').isEmail().withMessage('Invalid Email').custom((value, { req }) => {
        return User.findOne({ email: req.body.email}).then(userDoc => {
            if(userDoc){
                return Promise.reject('Email is already taken')
            }
        })
    }),
    check('password').isLength({min:5}).withMessage('Passwords must be atleast 5 characters').custom((value, { req }) => {
        if(value != req.body.confirmPassword){
            throw new Error('Passwords must match!')
        }
        return true
}), authController.postRegister)

router.get('/logout', authController.postLogout)

router.get('/reset', authController.getReset)

module.exports = router;