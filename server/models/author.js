var express = require('express');
var restful = require('node-restful');
var mongoose = restful.mongoose;

var AuthorSchema = new mongoose.Schema({
    first_name: String,
    middle_name: String,
    last_name: String,
    age: Number,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = restful.model('Author', AuthorSchema);