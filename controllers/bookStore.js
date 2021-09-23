const { render } = require('ejs');
const Book = require('../models/books');

exports.getShopFront = (req, res, next) => {
    Book.fetchAll(books => {
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
    Book.fetchAll(books => {
        res.render('pages/inventory', {
            title: 'Inventory Management System',
            books: books,
            message: req.query.message,
            type: req.query.type,
            path: '/books/admin'
        })
    })
}

exports.getBookDetail = (req, res, next) => {
    Book.fetchOne(book => {
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
    Book.fetchAll(books => {
        const newBook = new Book(req.body.name, req.body.description, req.body.author, req.body.price, req.body.qty);
        exists = false
        for (let book of books){
            if (book.name == newBook.name && book.author == newBook.author) {
                exists = true
                book.qty += parseInt(req.body.qty)
            }
        }
        
        if(exists) {
            Book.saveAll(books)
            res.redirect('/books/admin?type=alert&message=Book already in system, added to previous stock')
        } else {
            newBook.save();
        }

        res.redirect('/books/admin');
    })
}

exports.postRemoveBook = (req, res, next) => {
    Book.fetchAll(books => {
        books.splice(req.params.bookId, 1)
        Book.saveAll(books)
        res.redirect('/books/admin?type=alert&message=Book Deleted')
    })
}

exports.postSellBook = (req, res, next) => {
    Book.fetchAll(books => {
        if(books[req.params.bookId].qty == 1){
            books.splice(req.params.bookId, 1)
            Book.saveAll(books)
            res.redirect('/books/admin?type=alert&message=Book is now soldout')
        } else {
            books[req.params.bookId].qty--
            Book.saveAll(books)
            res.redirect('/books/admin?type=alert&message=Book Sold')
        }
    })
}

exports.postBuyBook = (req, res, next) => {
    Book.fetchAll(books => {
        if(books[req.params.bookId].qty == 1){
            books.splice(req.params.bookId, 1)
            Book.saveAll(books)
            res.redirect('/books?type=positive&message=You bought our last copy, enjoy!')
        } else {
            books[req.params.bookId].qty--
            Book.saveAll(books)
            res.redirect('/books?type=positive&message=Thank you for your purchase!')
        }
    })
}
