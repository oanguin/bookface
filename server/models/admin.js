var mongoose = require("mongoose")

var AdminSchema = new mongoose.Schema({
    user_name: String,
    password: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});