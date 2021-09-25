
const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookStore');

router.get('/', bookController.getShopFront)

router.get('/admin/:bookId?', bookController.getBookAdmin)

router.get('/book/:bookId', bookController.getBookDetail)

router.post('/addBook', bookController.postAddBook)

router.post('/updateBook/:bookId', bookController.postUpdateBook)

router.use('/removeBook/:bookId', bookController.postRemoveBook)

module.exports = router;
