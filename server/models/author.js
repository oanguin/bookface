var mongoose = require('mongoose');

var AuthorSchema = new mongoose.Schema({
    first_name: String,
    middle_name: String,
    last_name: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Author', AuthorSchema);