const mongoose = require('mongoose')
const schema = mongoose.Schema

const bookSchema = new schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
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
  }
})

module.exports = mongoose.model('Book', bookSchema)