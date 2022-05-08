const { Books } = require('./models.js');

const BooksManager = {
  findAll: async () => {
    return await Books.find().exec();
  },
  findById: async (id) => {
    try {
      return await Books.findOne({'_id': id}).exec();
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  create: async (title) => {
    return await Books.create({title: title});
  },
  addComment: async (Book, comment) => {
    Book.comments.push(comment);
    return await Book.save();
  },
  removeById: async (id) => {
    return await Books.deleteOne({_id: id});
  },
  removeAll: async (id) => {
    return await Books.deleteMany();
  }
}

module.exports = {
  BooksManager: BooksManager
}