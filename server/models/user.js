var express = require('express');
var restful = require('node-restful');
var mongoose = restful.mongoose;

var UserSchema = new mongoose.Schema({
    first_name: String,
    middle_name: String,
    last_name: String,
    age: Number,
    user_name: String,
    password: String,
    email: String,
    is_admin: Boolean,
    is_registered: Boolean,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = restful.model('User', UserSchema);