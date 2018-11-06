var test = require('tape');
var request = require('supertest');
var app = require('../server/server');

test('GET /authors', function (assert) {
    console.log("ENV:", process.env.NODE_ENV)
    request(app)
        .get('/api/authors')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
            assert.isNotEqual(res.body, null, "Should not be Equal.");
            assert.error(err, 'No error');
            assert.end();
            process.exit(0);
        });
});