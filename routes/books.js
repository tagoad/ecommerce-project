
const express = require('express');
const router = express.Router();

const books = []

router.get('/', (req, res, next) => {
  res.render('pages/shopFront', {
    title: 'Best books this side of the \'Verse',
    books: books,
    message: req.query.message,
    type: req.query.type,
    path: '/books'
  })
})

router.get('/admin', (req, res, next) => {
    res.render('pages/inventory', {
        title: 'Inventory Management System',
        books: books,
        message: req.query.message,
        type: req.query.type,
        path: '/books/admin'
    })
})

router.post('/addBook', (req, res, next) => {
  exists = false
  for (let book of books){
    if (book.title == req.body.title && book.author == req.body.author) {
      exists = true
      book.qty += req.body.qty
    }
  }

  if (exists){
    res.redirect('/books?type=alert&message=Book already in system, added to previous stock')
  } else {
    books.push({
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      qty: req.body.qty
    })
  
    res.redirect('/books/admin')
  }
})

router.use('/removeBook/:bookId', (req, res, next) => {
  books.splice(req.params.bookId, 1)
  res.redirect('/books/inventory?type=alert&message=Book Deleted')
})

router.use('/sellBook/:bookId', (req, res, next) => {
    if(books[req.params.bookId].qty == 1){
        books.splice(req.params.bookId, 1)
        res.redirect('/books/admin?type=alert&message=Book is now soldout')
    } else {
        books[req.params.bookId].qty--
        res.redirect('/books/admin?type=alert&message=Book Sold')
    }
})

router.use('/buyBook/:bookId', (req, res, next) => {
    if(books[req.params.bookId].qty == 1){
        books.splice(req.params.bookId, 1)
        res.redirect('/books?type=positive&message=You bought our last copy, enjoy!')
    } else {
        books[req.params.bookId].qty--
        res.redirect('/books?type=positive&message=Thank you for your purchase!')
    }
})

module.exports = router;
