var express = require("express");
var router = express.Router();
var Author = require("../models/author")

Author.methods(['get', 'post', 'put', 'delete']);
Author.register(router, '/authors');
module.exports = router;