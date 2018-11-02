var mongoose = require("mongoose")
var Book = require("book")
var User = require("user")
var Comment = require("comment")

var PostSchema = new mongoose.Schema({
    book: Book,
    user: User,
    comment: [Comment],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});