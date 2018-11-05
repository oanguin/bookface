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
    req.body.authors.forEach(element => {
        element._id = mongoose.Types.ObjectId();
    });
    req.body.authors;
    next();
});

Book.after('post', (req, res, next) => {
    res.render('books', {
        authors: res.locals.bundle.authors
    })
});

Book.register(router, '/book');
module.exports = router;