var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Security = require("../security/security");
var sendEmail = require("../email/email-service")
const config = require(`../config/config-${process.env.NODE_ENV}`);

User = User.methods(["get", "post", "put", "delete"]);
User.before("post", EncryptPassword).before("put", EncryptPassword);
User.after("get", removeSensitiveData)
  .after("post", [removeSensitiveData, SendEmail])
  .after("put", removeSensitiveData)
  .after("register", removeSensitiveData)
  .after("login", removeSensitiveData);

User.route("login", (req, res, next) => {
  console.log("Trying to Login..", req.body);
  User.findOne({
      user_name: req.body.user_name
    },
    (error, user) => {
      console.log('Login User', user);
      if (user && Security.isPasswordValid(req.body.password, user.password)) {
        res.setHeader(
          "x-access-token",
          Security.generateJWT(user.toJSON())
        );
        res.status(200).send(user);
      } else {
        res.status(404).send("Please provide a valid user name and password.");
      }
    }
  );
});

User.route("registration", {
  handler: function (req, res, next) {
    console.log("Register Mehtod...", req.query);
    User.findById(req.query.id, (err, user) => {
      if (user) {
        user.is_registered = true;
        user.save((err, updatedUser) => {
          res.render('index', {
            messages: "Registration Successful. Please Login"
          })
        });
      } else {
        res.status(404).send("User is not registered.");
      }
    });
  }
});

User.register(router, "/user");

function removeSensitiveData(req, res, next) {
  console.log('Removing sensitive data...')
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

function SendEmail(req, res, next) {
  console.log('Sending Email')
  let mailOptions = {
    from: "Book Face <support@bookface.com>",
    to: res.locals.bundle.email,
    subject: "Complete Registration to Bookface",
    html: `<a href='http://${config.server}:${config.port}/user/registration?id=${res.locals.bundle.id}'>Click to complete Registration</>`
  }

  sendEmail(mailOptions, next);

}


module.exports = router;