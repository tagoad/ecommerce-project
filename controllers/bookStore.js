const { render } = require('ejs');
const Book = require('../models/book');

exports.getShopFront = (req, res, next) => {
    Book.find().then(books => {
        res.render('pages/shopFront', {
            title: 'Best books this side of the \'Verse',
            books: books,
            message: req.query.message,
            type: req.query.type,
            path: '/books'
       })
    })
}

exports.getBookAdmin = (req, res, next) => {
    Book.find().then(books => {
        console.log(books.filter(item => {
            return item._id.toString() == req.params.bookId
        }))
        res.render('pages/inventory', {
            title: 'Inventory Management System',
            books: books,
            book: books.filter(item => {
                return item._id.toString() == req.params.bookId
            })[0],
            edit: typeof req.params.bookId == 'undefined' ? false : true,
            message: req.query.message,
            type: req.query.type,
            path: '/books/admin'
        })
    })
}

exports.getBookDetail = (req, res, next) => {
    Book.findById(req.params.bookId).then(book => {
        res.render('pages/shopDetail', {
            title: `${book.name} by ${book.author}`,
            book: book,
            id: req.params.bookId,
            message: req.query.message,
            type: req.query.type,
            path: '/books'
        })
    }, req.params.bookId)
}

exports.postAddBook = (req, res, next) => {
    const newBook = new Book({
        name: req.body.name,
        description: req.body.description,
        author: req.body.author,
        price: req.body.price,
        qty: req.body.qty,
        imgUrl: req.body.url != '' ? req.body.url : '/images/no-image.jpg'
    })

    newBook.save().then(result => {
        res.redirect('/books/admin');
    })
    .catch(err =>{
        console.log(err)
    })
}

exports.postUpdateBook = (req, res, next) => {
    Book.findByIdAndUpdate(req.params.bookId, {
        name: req.body.name,
        description: req.body.description,
        author: req.body.author,
        price: req.body.price,
        qty: req.body.qty,
        imgUrl: req.body.url != '' ? req.body.url : '/images/no-image.jpg'
    }).then(result => {
        res.redirect('/books/admin?type=positive&message=Book Updated')
    })
}

exports.postRemoveBook = (req, res, next) => {
    Book.findByIdAndRemove(req.params.bookId).then(books => {
        res.redirect('/books/admin?type=alert&message=Book Deleted')
    })
}
