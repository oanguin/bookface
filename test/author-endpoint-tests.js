var test = require('tape');
var request = require('supertest');
var app = require('../server/server');
var Security = require("../server/security/security")
var mongoose = require('mongoose');

test('GET /authors', function (assert) {
    console.log("ENV:", process.env.NODE_ENV)
    request(app)
        .get('/api/authors')
        .set('x-access-token', Security.generateJWT({
            id: mongoose.Types.ObjectId()
        }))
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            assert.isNotEqual(res.body, null, "Should not be Equal.");
            assert.error(err, 'No error');
            assert.end();
        });
});