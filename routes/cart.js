
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth')

const cartController = require('../controllers/productCart');

router.get('/', isAuth, cartController.getCart)

router.get('/clearCart', isAuth, cartController.clearCart)

router.get('/checkout', isAuth, cartController.postOrder)

router.get('/add/:productId', isAuth, cartController.updateCart)

router.get('/remove/:productId', isAuth, cartController.deleteItem)

router.get('/increase/:productId', isAuth, cartController.increaseItem)

router.get('/decrease/:productId', isAuth, cartController.decreaseItem)

module.exports = router;
