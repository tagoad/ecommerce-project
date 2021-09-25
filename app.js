
// Our initial setup (package requires, port number setup)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000
const mongoose = require('mongoose')
const User = require('./models/user');
const cors = require('cors')

const app = express();
const corsOptions = {
  origin: "https://tranquil-castle-88673.herokuapp.com/",
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://mainUser:TlI9TD0DVAT7BlG9@webdevelopment.gjxcs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4
};

// Routes
const books = require('./routes/books');
const cart = require('./routes/cart');

mongoose.connect(MONGODB_URL, options).then(result =>{
  User.findOne().then(user =>{
    if(!user){
      const user = new User({
        name: 'Tevett',
        email: 'tevett@test.com',
        cart: []
      })
      user.save().catch(err => console.log(err))
    }
  })
  app.use(express.static(path.join(__dirname, 'public')))
  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'ejs')
  app.use(bodyParser({ extended: false })) // For parsing the body of a POST
  app.use((req, res, next) => {
    User.findById('614f84bd66f73f08a0937568').then(user =>{
      req.user = user
      next();
    }).catch(err => console.log(err))
  })
  app.use('/books', books)
  app.use('/cart', cart)
  app.get('/', (req, res, next) => {
    // This is the primary index, always handled last.
    res.render('pages/index', {
      title: 'Welcome to Haven',
      path: '/',
    });
  })
  app.use((req, res, next) => {
    // 404 page
    res.render('pages/404', { title: '404 - Page Not Found', path: req.url });
  })
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
})