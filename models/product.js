const mongoose = require('mongoose')
const schema = mongoose.Schema

const productSchema = new schema({
  name: {
    type: String,
    required: true
  },
  fieldOne: {
    type: String,
    required: true
  },
  fieldTwo: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  imgUrl: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Product', productSchema)