var express = require("express");
var router = express.Router();
var User = require("../models/user")

User.methods(['get', 'post', 'put', 'delete']);
User.after('get', removeSensitiveData)
    .after('post', removeSensitiveData)
    .after('put', removeSensitiveData);

User.register(router, '/user');

function removeSensitiveData(req, res, next) {
    if (Array.isArray(res.locals.bundle)) {
        res.locals.bundle.forEach(element => {
            element.password = undefined;
            element.is_admin = undefined;
        });
    } else {
        res.locals.bundle.password = undefined;
        res.locals.bundle.is_admin = undefined;
    }

    next();
}

/*TODO has password before it reaches the database */
module.exports = router;