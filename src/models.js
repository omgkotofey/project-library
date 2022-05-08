require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGO_URI, {
    dbName: 
      process.env.NODE_ENV === 'test' ? 
      process.env.MONGO_TEST_DATABASE : 
      process.env.MONGO_DATABASE,
    useNewUrlParser: true
  }
);

const BooksSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  comments: [String]
}, { 
  versionKey: false,
});

BooksSchema.virtual('commentcount').get(function() {
  return this.comments.length;
});

module.exports = {
  BooksSchema: BooksSchema,
  Books: mongoose.model('Books', BooksSchema),
}