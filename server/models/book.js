var express = require('express');
var restful = require('node-restful');
var mongoose = restful.mongoose;
var Author = require('./author')

var BookSchema = new mongoose.Schema({
    authors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }],
    title: String,
    pages: Number,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = restful.model("Book", BookSchema)