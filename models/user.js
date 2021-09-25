const mongoose = require('mongoose')
const schema = mongoose.Schema
const Book = require('../models/book');

const userSchema = new schema({
    name: {
        type: String,
        required: true
    },
    email: {
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

userSchema.methods.increaseItem = async function(productId) {
    const index = this.cart.findIndex(item => {
        return item.productId.toString() === productId
    })
    let message = null
    this.cart[index].cartQty += 1
    message = await Book.findById(productId).then(item => {
        console.log(this.cart[index].cartQty)
        console.log(item.qty)
        if(this.cart[index].cartQty <= item.qty){
            this.save()
        } else {
            return 'Not enough inventory, sorry'
        }
    })
    console.log(message)
    return message
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