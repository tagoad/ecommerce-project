
// Our initial setup (package requires, port number setup)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000
const mongoose = require('mongoose')
const User = require('./models/user');
const cors = require('cors')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf')

const app = express();
const corsOptions = {
  origin: "https://tranquil-castle-88673.herokuapp.com/",
  optionsSuccessStatus: 200
}

const MONGODB_URI = "mongodb+srv://mainUser:TlI9TD0DVAT7BlG9@webdevelopment.gjxcs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const MONGODB_URL = process.env.MONGODB_URL || MONGODB_URI;

const csrfProtection = csrf()

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  family: 4
};

// Routes
const books = require('./routes/books');
const cart = require('./routes/cart');
const auth = require('./routes/auth');

mongoose.connect(MONGODB_URL, options).then(result =>{
  app.use(express.static(path.join(__dirname, 'public')))
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  app.use(bodyParser({ extended: false })) // For parsing the body of a POST
  app.use(cors(corsOptions))
  app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    })
  )
  app.use(csrfProtection)
  app.use((req, res, next) => {
    if(typeof req.session.isAuth == 'undefined'){
      req.session.isAuth = false
    }
    if(typeof req.session.isAdmin == 'undefined'){
      req.session.isAdmin = false
    }
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  })
  app.use((req, res, next) => {
    res.locals.isAuth = req.session.isAuth
    res.locals.isAdmin = req.session.isAdmin
    res.locals.csrf = req.csrfToken()
    next()
  })
  app.use('/books', books)
  app.use('/cart', cart)
  app.use('/auth', auth)
  app.get('/', (req, res, next) => {
    // This is the primary index, always handled last.
    res.render('pages/index', {
      title: 'Welcome to Haven',
      path: '/',
      isAuth: req.session.isAuth,
      isAdmin: req.session.isAdmin
    });
  })
  app.use((req, res, next) => {
    // 404 page
    res.render('pages/404', {
      title: '404 - Page Not Found', 
      path: req.url,
      isAuth: req.session.isAuth,
      isAdmin: req.session.isAdmin
    });
  })
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
})