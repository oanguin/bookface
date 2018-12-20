var express = require("express");
var router = express.Router();
var Book = require("../models/book")
var Author = require("../models/author")
Book.methods(['get', 'post', 'put', 'delete']);
var async = require('async');
var mongoose = require('mongoose');

Book.before('post', (req, res, next) => {
    console.log(req.body)
    let authors = []
    /*Generate Id for Objects Before Saving It*/
    req.body.authors.forEach(author => {
        author._id = mongoose.Types.ObjectId();
        var doc = new Author(author);
        doc.save();

    });
    req.body.authors;
    next();
});

Book.after('post', (req, res, next) => {
    Book.find({}).populate('authors').execute(function (error, data) {
        res.render('books/books', {
            books: data
        })
    })

});

Book.register(router, '/book');
module.exports = router;