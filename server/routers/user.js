var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Security = require("../security/security");

User = User.methods(["get", "post", "put", "delete"]);
User.before("post", EncryptPassword).before("put", EncryptPassword);
User.after("get", removeSensitiveData)
  .after("post", removeSensitiveData)
  .after("put", removeSensitiveData);

User.route("login", (req, res, next) => {
  console.log("Trying to Login..", req.body);
  User.findOne(
    {
      email: "testuser@email.com"
    },
    (error, user) => {
      if (user && Security.isPasswordValid(req.body.password, user.password)) {
        res.setHeader(
          "x-access-token",
          Security.generateJWT({ id: user._id.toString() })
        );
        res.status(200).send({
          "x-access-token": Security.generateJWT({ id: user._id.toString() })
        });
      } else {
        res.status(404).send("Please provide a valid user name and password.");
      }
    }
  );
});

/*User.route("login", function(req, res, next) {
  res.send("I have a recommendation for you!");
});*/

User.register(router, "/user");

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

function EncryptPassword(req, res, next) {
  if (req.body.password)
    req.body.password = Security.encrypt(req.body.password);

  next();
}

/*TODO has password before it reaches the database */
module.exports = router;
