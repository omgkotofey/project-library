require('dotenv').config();
const {factory} = require('fakingoose');
const {BooksSchema} = require('../../../src/models.js');

const booksFactory = factory(
  BooksSchema,
  { 
    _id: { tostring: false }
  }
);

const generateBook = (params = {}) => {
  return booksFactory.generate({
    ...params,
  });
}

module.exports = [
  generateBook({comments: ['First comment']})
];