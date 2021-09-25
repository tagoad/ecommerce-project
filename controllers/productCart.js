const { render } = require('ejs');
const { mongoose } = require('mongoose');
const User = require('../models/user');

exports.getCart = (req, res, next) => {
    User.findById(req.user._id.toString()).populate({path: 'cart', populate: { path: 'productId', model: 'Book'}}).then(user => {
        res.render('pages/shopCart', {
            title: `${req.user.name}'s Shopping Cart`,
            cart: user.cart,
            message: req.query.message,
            type: req.query.type,
            path: '/cart'
       })
    })
}

exports.updateCart = (req, res, next) => {
    User.findById(req.user._id.toString()).then(user =>{
        req.user.addToCart(req.params.productId)
        res.redirect('/cart')
    })
}

exports.clearCart = (req, res, next) => {
    User.findById(req.user._id.toString()).then(user =>{
        req.user.clearCart()
        res.redirect('/cart')
    })
}

exports.deleteItem = (req, res, next) => {
    User.findById(req.user._id.toString()).then(user =>{
        req.user.deleteItem(req.params.productId)
        res.redirect('/cart')
    })
}

exports.increaseItem = (req, res, next) => {
    User.findById(req.user._id.toString()).then(user =>{
        req.user.increaseItem(req.params.productId)
        res.redirect('/cart')
    })
}

exports.decreaseItem = (req, res, next) => {
    User.findById(req.user._id.toString()).then(user =>{
        let message = req.user.decreaseItem(req.params.productId)
        if(message == null){
            res.redirect('/cart')
        } else {
            res.redirect(`/cart?type=positive&message=${message}`)
        }
    })
}