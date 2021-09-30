const { render } = require('ejs');
const Product = require('../models/product');

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
            path: '/books/admin'
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
    const newBook = new Product({
        name: req.body.name,
        fieldOne: req.body.author,
        fieldTwo: req.body.description,
        price: req.body.price,
        qty: req.body.qty,
        imgUrl: req.body.url != '' ? req.body.url : '/images/no-image.jpg',
        type: 'Book'
    })

    newBook.save().then(result => {
        res.redirect('/books/admin');
    })
    .catch(err =>{
        console.log(err)
    })
}

exports.postUpdateBook = (req, res, next) => {
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

exports.postRemoveBook = (req, res, next) => {
    Product.findByIdAndRemove(req.params.bookId).then(books => {
        res.redirect('/books/admin?type=alert&message=Book Deleted')
    })
}
