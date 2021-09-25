
const express = require('express');
const router = express.Router();

const cartController = require('../controllers/productCart');

router.get('/', cartController.getCart)

router.get('/clearCart', cartController.clearCart)

router.get('/add/:productId', cartController.updateCart)

router.get('/remove/:productId', cartController.deleteItem)

router.get('/increase/:productId', cartController.increaseItem)

router.get('/decrease/:productId', cartController.decreaseItem)

module.exports = router;
