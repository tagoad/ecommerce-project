const mongoose = require('mongoose')
const schema = mongoose.Schema
const Product = require('../models/product');
const { render } = require('ejs');

const userSchema = new schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart:[
        {
            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            cartQty: Number
        }
    ]
})

userSchema.methods.addToCart = function(productId) {
    const index = this.cart.findIndex(item => {
        return item.productId.toString() === productId
    })

    if(index >= 0) {
        console.log('Updating')
        this.cart[index].cartQty += 1
    } else {
        console.log('Adding')
        this.cart.push({
            productId: productId,
            cartQty: 1
        })
    }
    return this.save()
}

userSchema.methods.clearCart = function() {
    this.cart=[]
    return this.save()
}

userSchema.methods.deleteItem = function(productId) {
    const index = this.cart.findIndex(item => {
        return item.productId.toString() === productId
    })
    this.cart.splice(index, 1)
    return this.save()
}

userSchema.methods.increaseItem = function(productId) {
    const index = this.cart.findIndex(item => {
        return item.productId.toString() === productId
    })
    this.cart[index].cartQty += 1
    return this.save()
}

userSchema.methods.decreaseItem = function(productId) {
    const index = this.cart.findIndex(item => {
        return item.productId.toString() === productId
    })
    let message = null
    this.cart[index].cartQty -= 1
    if(this.cart[index].cartQty <= 0){
        this.cart.splice(index, 1)
        message = 'Item Removed'
    }
    this.save()
    return message
}

module.exports = mongoose.model('User', userSchema)