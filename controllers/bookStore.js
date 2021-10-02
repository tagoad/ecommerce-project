const { render } = require('ejs');
const Product = require('../models/product');
const { validationResult } = require('express-validator/check')

exports.getShopFront = (req, res, next) => {
    Product.find().then(products => {
        res.render('pages/shopFront', {
            title: 'Best books this side of the \'Verse',
            books: products.filter(item => {
                return item.type == 'Book'
            }),
            message: req.query.message,
            isAuth: req.session.isAuth,
            isAdmin: req.session.isAdmin,
            type: req.query.type,
            path: '/books'
       })
    })
}

exports.getBookAdmin = (req, res, next) => {
    Product.find().then(products => {
        res.render('pages/inventory', {
            title: 'Inventory Management System',
            products: products.filter(item => {
                return item.type == 'Book'
            }),
            book: products.filter(item => {
                return item._id.toString() == req.params.bookId
            })[0],
            edit: typeof req.params.bookId == 'undefined' ? false : true,
            message: req.query.message,
            isAuth: req.session.isAuth,
            isAdmin: req.session.isAdmin,
            type: req.query.type,
            path: '/books/admin',
            oldInputs: {
                name: "",
                author: "",
                description: "",
                price: "",
                qty: "",
                imgUrl: ""
            }
        })
    })
}

exports.getBookDetail = (req, res, next) => {
    Product.findById(req.params.bookId).then(book => {
        res.render('pages/shopDetail', {
            title: `${book.name} by ${book.fieldOne}`,
            book: book,
            id: req.params.bookId,
            message: req.query.message,
            isAuth: req.session.isAuth,
            isAdmin: req.session.isAdmin,
            type: req.query.type,
            path: '/books'
        })
    }, req.params.bookId)
}

exports.postAddBook = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        Product.find().then(products => {
            return res.status(422).render('pages/inventory', {
                title: 'Inventory Management System',
                products: products.filter(item => {
                    return item.type == 'Book'
                }),
                book: products.filter(item => {
                    return item._id.toString() == req.params.bookId
                })[0],
                edit: typeof req.params.bookId == 'undefined' ? false : true,
                message: errors.array()[0].msg,
                isAuth: req.session.isAuth,
                isAdmin: req.session.isAdmin,
                type: req.query.type,
                path: '/books/admin',
                oldInputs: {
                    name: req.body.name,
                    author: req.body.author,
                    description: req.body.description,
                    price: req.body.price,
                    qty: req.body.qty,
                    imgUrl: req.body.url
                }
            })
        })
    } else {
        const newBook = new Product({
            name: req.body.name,
            fieldOne: req.body.author,
            fieldTwo: req.body.description,
            price: req.body.price,
            qty: req.body.qty,
            imgUrl: req.body.url != '' ? req.body.url : '/images/no-image.jpg',
            type: 'Book',
            createdBy: req.user._id.toString()
        })
    
        newBook.save().then(result => {
            res.redirect('/books/admin?type=positive&message="Book Added!');
        })
        .catch(err =>{
            console.log(err)
        })
    }
}

exports.postUpdateBook = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return Product.find().then(products => {
            res.status(422).render('pages/inventory', {
                title: 'Inventory Management System',
                products: products.filter(item => {
                    return item.type == 'Book'
                }),
                book: products.filter(item => {
                    return item._id.toString() == req.params.bookId
                })[0],
                edit: false,
                message: errors.array()[0].msg,
                isAuth: req.session.isAuth,
                isAdmin: req.session.isAdmin,
                type: req.query.type,
                path: '/books/admin',
                oldInputs: {
                    name: req.body.name,
                    author: req.body.author,
                    description: req.body.description,
                    price: req.body.price,
                    qty: req.body.qty,
                    imgUrl: req.body.url
                }
            })
        })
    } else {
        Product.findByIdAndUpdate(req.params.bookId, {
            name: req.body.name,
            description: req.body.description,
            author: req.body.author,
            price: req.body.price,
            qty: req.body.qty,
            imgUrl: req.body.url != '' ? req.body.url : '/images/no-image.jpg',
        }).then(result => {
            res.redirect('/books/admin?type=positive&message=Book Updated')
        })
    }
}

exports.postRemoveBook = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return Product.find().then(products => {
            res.status(422).render('pages/inventory', {
                title: 'Inventory Management System',
                products: products.filter(item => {
                    return item.type == 'Book'
                }),
                book: products.filter(item => {
                    return item._id.toString() == req.params.bookId
                })[0],
                edit: false,
                message: errors.array()[0].msg,
                isAuth: req.session.isAuth,
                isAdmin: req.session.isAdmin,
                type: req.query.type,
                path: '/books/admin',
                oldInputs: {
                    name: "",
                    author: "",
                    description: "",
                    price: "",
                    qty: "",
                    imgUrl: ""
                }
            })
       })
    } else {
        Product.findByIdAndRemove(req.params.bookId).then(books => {
            res.redirect('/books/admin?type=alert&message=Book Deleted')
        })
    }
}
