var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var Comment = require("../models/comment");
Comment.methods(['get', 'post', 'put', 'delete']);
var async = require('async');
var mongoose = require('mongoose');

Comment.before('post', (req, res, next) => {
    Book.findById(req.body.book_id, (err, book) => {
        req.body.book = book;
        req.body.user = req.user;
        next();
    });
});

Comment.after('post', (req, res, next) => {
    Book.findById(req.body.book_id).populate('authors').then(book => {
        return book;
    }).then(book => {
        Comment.find({
            book: book
        }).populate('authors').exec((error, comments) => {
            console.log('Found Comments', comments);
            res.render(`books/book`, {
                book: book,
                comments: comments
            });
        })
    });
});

Comment.register(router, '/comment');
module.exports = router;