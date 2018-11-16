var test = require("tape");
var request = require("supertest");
var app = require("../server/server");

let created_user_id = null;

test("GET /user", function(assert) {
  request(app)
    .get("/api/user")
    .expect(200)
    .expect("Content-Type", /json/)
    .end(function(err, res) {
      assert.isNotEqual(res.body, null, "Should not be Equal.");
      /*Password and is_admin should not be returned in request */
      res.body.forEach(element => {
        assert.isEqual(
          element.password,
          undefined,
          "Password should not come back in request"
        );
        assert.isEqual(
          element.is_admin,
          undefined,
          "is_admin should not come back in request"
        );
      });
      assert.error(err, "No error");
      assert.end();
    });
});

test("POST /user", function(assert) {
  request(app)
    .post("/api/user")
    .send({
      first_name: "test_name",
      last_name: "test_last_name",
      middle_name: "test_middle_name",
      user_name: "test_user_name",
      age: 9,
      password: "123456",
      email: "test_email"
    })
    .expect(201)
    .expect("Content-Type", /json/)
    .end(function(err, res) {
      assert.isNotEqual(res.body, null, "Should not be Equal.");
      /*Password and is_admin should not be returned in request */
      assert.isEqual(
        res.body.password,
        undefined,
        "Password should not come back in request"
      );
      assert.isEqual(
        res.body.is_admin,
        undefined,
        "is_admin should not come back in request"
      );
      /*User id shouuld be returned*/
      assert.isNotEqual(
        res.body._id,
        undefined,
        "Id should come back in the request"
      );
      created_user_id = res.body._id;
      console.log("User Id Created", created_user_id);
      assert.error(err, "No error");
      assert.end();
    });
});

test("PUT /user/:_id", function(assert) {
  request(app)
    .put(`/api/user/${created_user_id}`)
    .send({
      first_name: "new_test_name"
    })
    .expect(200)
    .expect("Content-Type", /json/)
    .end(function(err, res) {
      console.log("User Id Created", created_user_id);
      assert.isNotEqual(res.body, null, "Should not be Equal.");
      /*Password and is_admin should not be returned in request */
      assert.isEqual(
        res.body.password,
        undefined,
        "Password should not come back in request"
      );
      assert.isEqual(
        res.body.is_admin,
        undefined,
        "is_admin should not come back in request"
      );
      assert.error(err, "No error");
      assert.end();
    });
});

test("DELETE /user/:id", function(assert) {
  request(app)
    .delete(`/api/user/${created_user_id}`)
    .expect(204)
    .expect("Content-Type", /json/)
    .end(function(err, res) {
      assert.end();
    });
});
