const { render } = require('ejs');
const { mongoose } = require('mongoose');
const User = require('../models/user');
const Order = require('../models/order');

exports.getCart = (req, res, next) => {
    User.findById(req.user._id.toString()).populate({path: 'cart', populate: { path: 'productId', model: 'Product'}}).then(user => {
        res.render('pages/shopCart', {
            title: `${req.user.name}'s Shopping Cart`,
            cart: user.cart,
            message: req.query.message,
            isAuth: req.session.isAuth,
            isAdmin: req.session.isAdmin,
            type: req.query.type,
            path: '/cart'
       })
    })
}

exports.updateCart = (req, res, next) => {
    req.user.addToCart(req.params.productId)
    res.redirect('/cart')
}

exports.clearCart = (req, res, next) => {
    req.user.clearCart()
    res.redirect('/cart')
}

exports.postOrder = (req, res, next) => {
    User.findById(req.user._id.toString()).populate({path: 'cart', populate: { path: 'productId', model: 'Product'}}).then(user => {
        let totalPrice = 0
        const products = user.cart.map(item => {
            totalPrice += item.productId.price * item.cartQty
            return {productId: item.productId._id, orderQty: item.cartQty}
        })
        const order = new Order({
            products:products,
            total: totalPrice,
            userId: user._id
        })
        return order.save()
    }).then(result => {
        return req.user.clearCart();
    }).then(() => {
        res.redirect('/cart?type=positive&message=Your order has been placed')
    }).catch(err => console.log(err));
}

exports.deleteItem = (req, res, next) => {
    req.user.deleteItem(req.params.productId)
    res.redirect('/cart')
}

exports.increaseItem = (req, res, next) => {
    req.user.increaseItem(req.params.productId)
    res.redirect('/cart')
}

exports.decreaseItem = (req, res, next) => {
    let message = req.user.decreaseItem(req.params.productId)
    if(message == null){
        res.redirect('/cart')
    } else {
        res.redirect(`/cart?type=positive&message=${message}`)
    }
}