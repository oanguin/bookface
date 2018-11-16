var bcryptjs = require("bcryptjs");
var jwt = require("jsonwebtoken");
var config = require("../config");

module.exports = {
  encrypt: function(value) {
    return bcryptjs.hashSync(value, 8);
  },
  generateJWT: function(value) {
    return jwt.sign(value, config.secret);
  },
  isPasswordValid: function(bodyPassword, userPassword) {
    return bcryptjs.compareSync(bodyPassword, userPassword);
  }
};
