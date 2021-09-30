
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth')
const isAdmin = require('../middleware/is-admin')

const bookController = require('../controllers/bookStore');

router.get('/', bookController.getShopFront)

router.get('/admin/:bookId?', isAuth, isAdmin, bookController.getBookAdmin)

router.get('/book/:bookId', bookController.getBookDetail)

router.post('/addBook', isAuth, isAdmin, bookController.postAddBook)

router.post('/updateBook/:bookId', isAuth, isAdmin, bookController.postUpdateBook)

router.use('/removeBook/:bookId', isAuth, isAdmin, bookController.postRemoveBook)

module.exports = router;
