var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var User = require("../models/user")
var Author = require("../models/author")
Book.methods(['get', 'post', 'put', 'delete']);
var async = require('async');
var mongoose = require('mongoose');

Book.before('post', (req, res, next) => {
    console.log('This is body of book....', req.body);
    console.log('Auhtors', req.body.authors);
    req.body.authors = JSON.parse(req.body.authors);
    /*Generate Id for Objects Before Saving It*/
    req.body.authors.forEach(author => {
        console.log('Saving Auhtor', author);
        author._id = mongoose.Types.ObjectId();
        var doc = new Author(author);
        doc.save();

    });

    console.log('Calling Next...', req.body);
    next();
});

Book.after('post', (req, res, next) => {
    Book.find({}).populate('authors').execute(function (error, data) {
        res.render('books/books', {
            books: data
        })
    })
});

Book.route("mark-favourite", {
    detail: true,
    handler: (req, res) => {
        let user = req.user;

        const bookId = req.params.id;

        User.findById(user._id, (err, doc) => {
            doc.favouriteBooks.push(bookId);
            doc.save();
        }).then((result) => {
            res.json({
                "success": true,
                "favouriteBooks": result.favouriteBooks
            });
        });
    }
});

Book.route("unmark-favourite", {
    detail: true,
    handler: (req, res) => {
        let user = req.user;

        const bookId = req.params.id;

        User.findById(user._id, (err, doc) => {
            doc.favouriteBooks = doc.favouriteBooks.filter(item => item != bookId);
            doc.save();
        }).then((result) => {
            res.json({
                "success": true,
                "favouriteBooks": result.favouriteBooks
            });
        });
    }
});

Book.register(router, '/book');
module.exports = router;