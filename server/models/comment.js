var mongoose = require("mongoose")
var User = require("user")

var CommentSchema = new mongoose.Schema({
    comment: String,
    user: User,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = CommentSchema;