'use strict';

module.exports = (app, booksManager) => {

  app.route('/api/books')
    .get(async (req, res) => {
      const books = await booksManager.findAll();
      return res.status(200).json(books);
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      if (!title) {
        return res.status(200).send('missing required field title');
      } else {
        const book = await booksManager.create(title);
        return res.status(200).json(book);
      }
    })
    
    .delete(async (req, res) => {
      booksManager.removeAll();
      return res.status(200).send('complete delete successful');
    });

  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id
      const book = await booksManager.findById(bookid);
      if (!book) {
        return res.status(200).send('no book exists');
      } else {
        return res.status(200).json(book);
      }
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        return res.status(200).send('missing required field comment');
      } else {
        const book = await booksManager.findById(bookid);
        if (!book) {
          return res.status(200).send('no book exists');
        } else {
          await booksManager.addComment(book, comment);
          return res.status(200).json(book);
        }
      }
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      const book = await booksManager.findById(bookid);
      if (!book) {
        return res.status(200).send('no book exists');
      } else {
        await booksManager.removeById(bookid);
        return res.status(200).send('delete successful');
      }
    });
};
