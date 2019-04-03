var Comment = require("../models/comment");
var Book = require("../models/book");
var express = require("express");
var router = express.Router();
const config =
  process.env.NODE_ENV == "test" ?
  require("../config/config-test") :
  require("../config/config");
const fetch = require("node-fetch");
const msgs = require("../config/messages");
var User = require("../models/user");

const SERVER_URL = `http://${config.ip}:${config.port}/api/`;
router.post("/login", (req, response, next) => {
  fetch(`${SERVER_URL}/user/login`, {
      method: "post",
      body: JSON.stringify(req.body),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      return res.json().then(result => {
        return {
          xaccesstoken: res.headers.get("x-access-token"),
          body: result
        };
      });
    })
    .then(payload => {
      response.set("x-access-token", payload.xaccesstoken);
      /*Expire the cookie in 24 hours */
      response.cookie("x_access_token", payload.xaccesstoken, {
        maxAge: 24 * 60 * 60 * 1000
      });
      //TODO: Duplicate logic in server.js
      User.findOne({
          _id: payload.body._id
        }).populate({
          path: 'favouriteBooks',
          populate: {
            path: 'authors'
          }
        })
        .then(user => {
          console.log('returned user before getting comments...', user);
          Comment.find({
            book: user.favouriteBooks
          }, {
            limit: 10
          }).sort({
            created_at: 'desc'
          }).populate(['user', 'book']).select(['comment', 'created_at']).exec((error, comments) => {
            console.log('returned comments...', comments);
            console.log('returned user...', user.favouriteBooks);

            Book.find({}, {
              limit: 10
            }).sort({
              created_at: 'desc'
            }).select(['title', 'picture', '_id']).exec((error, books) => {
              response.render("index", {
                logged_in_user: user,
                favouriteBooks: user.favouriteBooks,
                latestComments: comments,
                books: books
              });
            });
          });
        });


    })
    .catch(error => {
      console.log("Login Error", error);
      response.render("index");
    });
});

router.post("/create", (req, res) => {
  fetch(`${SERVER_URL}/user`, {
      method: "post",
      body: JSON.stringify(req.body),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(data => data.json())
    .then(result => {
      res.render("index", {
        message: msgs.USER_CREATED
      });
    })
    .catch(error => {
      console.log("USER CREATION ERROR", error);
      res.render("index", {
        message: msgs.FAILED_TO_CREATE_USER
      });
    });
});

module.exports = router;