const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const nonExistingBookId = '6272e9ae07bddf0ee9f6c655';
const booksFakes = require('./fixtures/models/books.js');
const booksFixtureFactory = require('./fixtures/fixtures.js');
const booksFixture = booksFixtureFactory.booksFixture(
  process.env.MONGO_URI, 
  process.env.MONGO_TEST_DATABASE
);


chai.use(chaiHttp);

suite('Functional Tests', function() {

  const buildUrl = (url) => {
    return `/api/books/${url ? url : ''}`;
  }

  before(async () => await booksFixture.load());
  after(async () => await booksFixture.cleanup());

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get(buildUrl())
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .post(buildUrl())
          .type('form')
          .send({
            title: "some_title",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.include(res.body, {
              title: "some_title",
              commentcount: 0,
            });

            let resultId = res.body._id;
            chai
            .request(server)
            .get(buildUrl(resultId))
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.equal(res.body._id, resultId);
              done();
            });
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post(buildUrl())
          .type('form')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
    });


    suite('GET /api/books => array of books', function(){
  
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .get(buildUrl())
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isTrue(res.body.length >= 1);
            done();
          });
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .get(buildUrl(nonExistingBookId))
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
          .request(server)
          .get(buildUrl(booksFakes[0]._id))
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.equal(res.body._id, booksFakes[0]._id.toString());
            done();
          });
      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
          .request(server)
          .post(buildUrl(booksFakes[0]._id.toString()))
          .type('form')
          .send({
            comment: 'New comment'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.include(res.body, {
              commentcount: 2,
            });
            assert.include(res.body.comments, 'New comment');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
          .request(server)
          .post(buildUrl(booksFakes[0]._id.toString()))
          .type('form')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
          .request(server)
          .post(buildUrl(nonExistingBookId))
          .type('form')
          .send({
            comment: 'New comment'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .delete(buildUrl(booksFakes[0]._id.toString()))
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            
            chai
            .request(server)
            .get(buildUrl(booksFakes[0]._id.toString()))
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'no book exists');
              done();
            });
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
          .request(server)
          .delete(buildUrl(nonExistingBookId))
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});
