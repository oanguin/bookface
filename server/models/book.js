var mongoose = require("mongoose")
var Author = require("author")

var BookSchema = new mongoose.Schema({
    authors: [Author],
    title: String,
    pages: Int8Array,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = BookSchema;