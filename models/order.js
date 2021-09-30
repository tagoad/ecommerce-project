const mongoose = require('mongoose')
const schema = mongoose.Schema

const orderSchema = new schema({
    products: [
        {
            productId: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            orderQty: {
                type: Number,
                required: true
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Order', orderSchema)