var express = require("express");
var router = express.Router();

router.post("/login", (req, res) => {
    let user = req.body;

    if (user.user_name == "test" && user.password == "123") {
        res.render("index", {
            user: user
        });
    } else {
        res.render("index", {
            error: "Incorrect User Name or Password"
        });
    }
});

module.exports = router;