var test = require('tape');
var request = require('supertest');
var app = require('../server/server');

test('end', function (assert) {
    assert.end();
    process.exit(0);
});