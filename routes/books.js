
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth')
const isAdmin = require('../middleware/is-admin')
const { check }= require('express-validator/check')
const Product = require('../models/product')

const bookController = require('../controllers/bookStore');

router.get('/', bookController.getShopFront)

router.get('/admin/:bookId?', isAuth, isAdmin, bookController.getBookAdmin)

router.get('/book/:bookId', bookController.getBookDetail)

router.post('/addBook', 
    check('name').isLength({min:1}).withMessage('Please Enter Name'),
    check('author').isLength({min: 1}).withMessage('Please Enter the Author'),
    check('description').isLength({min: 1}).withMessage('Please Enter Description'),
    check('price').notEmpty().withMessage("Please Enter Price").isDecimal({decimal_digits: 2}).withMessage("Please Enter Valid Price"),
    check('qty').notEmpty().withMessage("Please Enter Quantity").isInt().withMessage('Please Enter Valid Quantity'), 
    isAuth, isAdmin, bookController.postAddBook)

router.post('/updateBook/:bookId', check('name').custom((value, { req }) => {
        return Product.findById(req.params.bookId).then(product => {
            if(!product){
                return Promise.reject('Product Error')
            }else {
                if(product.createdBy != req.user._id.toString()){
                    return Promise.reject("User cannot edit other user's products")
                }
            }
        })
    }),
    isAuth, isAdmin, bookController.postUpdateBook)

router.use('/removeBook/:bookId', check('name').custom((value, { req }) => {
    return Product.findById(req.params.bookId).then(product => {
        if(!product){
            return Promise.reject('Product Error')
        }else {
            if(product.createdBy != req.user._id.toString()){
                return Promise.reject("User cannot delete other user's products")
            }
        }
    })
}),isAuth, isAdmin, bookController.postRemoveBook)

module.exports = router;
