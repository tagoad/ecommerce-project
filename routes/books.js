
const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookStore');

const books = []

router.get('/', bookController.getShopFront)

router.get('/admin', bookController.getBookAdmin)

router.get('/book/:bookId', bookController.getBookDetail)

router.post('/addBook', bookController.postAddBook)

router.use('/removeBook/:bookId', bookController.postRemoveBook)

router.use('/sellBook/:bookId', bookController.postSellBook)

router.use('/buyBook/:bookId', bookController.postBuyBook)

module.exports = router;
