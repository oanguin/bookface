var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
    first_name: String,
    middle_name: String,
    last_name: String,
    age: Int8Array,
    user_name: String,
    password: String,
    email: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = UserSchema