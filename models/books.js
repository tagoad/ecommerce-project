const fs = require('fs');
const path = require('path');
const Product = require('./product');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'books.json'
);

const getBooksFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
};

const getBookFromFile = (cb, i) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb(Book());
    } else {
      cb(JSON.parse(fileContent)[i]);
    }
  });
};

module.exports = class Book extends Product {
    constructor(name, description, author, price, qty) {
        super(name, description, price, qty)
        this.author = author
    }

    save() {
        getBooksFromFile(books => {
            books.push(this);
            fs.writeFile(p, JSON.stringify(books), err => {
                console.log(err);
            });
        });
    }
    
    static fetchAll(cb) {
        getBooksFromFile(cb);
    }

    static fetchOne(cb, i) {
      getBookFromFile(cb, i);
  }

    static saveAll(books) {
        fs.writeFile(p, JSON.stringify(books), err => {
            console.log(err);
        });
    }
}