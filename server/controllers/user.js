var express = require("express");
var router = express.Router();
const config = process.env.NODE_ENV == "test" ? require("../config/config-test") : require("../config/config");
const fetch = require('node-fetch');
const msgs = require('../config/messages');

const SERVER_URL = `http://${config.ip}:${config.port}/api/`
router.post("/login", (req, response, next) => {
    fetch(`${SERVER_URL}/user/login`, {
            method: 'post',
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(res => {
            return res.json().then((result) => {
                return {
                    "xaccesstoken": res.headers.get("x-access-token"),
                    "body": result
                }

            })
        })
        .then(payload => {
            response.set('x-access-token', payload.xaccesstoken)
            /*Expire the cookie in 24 hours */
            response.cookie("x_access_token", payload.xaccesstoken, {
                maxAge: 24 * 60 * 60 * 1000
            });
            response.render("index", {
                user: payload.body
            });
        })
        .catch(error => {
            console.log("Login Error", error)
            response.render("index");
        });
});

router.post("/create", (req, res) => {
    fetch(`${SERVER_URL}/user`, {
            method: 'post',
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(data => data.json())
        .then(result => {
            res.render("index", {
                message: msgs.USER_CREATED
            });
        }).catch(error => {
            console.log("USER CREATION ERROR", error)
            res.render("index", {
                message: msgs.FAILED_TO_CREATE_USER
            });
        });

});

module.exports = router;