
// Our initial setup (package requires, port number setup)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000

const app = express();

// Routes
const books = require('./routes/books');

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(bodyParser({ extended: false })) // For parsing the body of a POST
  .use('/books', books)
  .get('/', (req, res, next) => {
    // This is the primary index, always handled last.
    res.render('pages/index', {
      title: 'Welcome to Haven',
      path: '/',
    });
  })
  .use((req, res, next) => {
    // 404 page
    res.render('pages/404', { title: '404 - Page Not Found', path: req.url });
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
