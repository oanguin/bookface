var test = require("tape");
var request = require("supertest");
var app = require("../server/server");

let CREATED_USER_ID = null;
let CREATED_USER_PASSWORD = "123456";
let CREATED_USER_EMAIL = "testuser@email.com";

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
      password: CREATED_USER_PASSWORD,
      email: CREATED_USER_EMAIL
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
      CREATED_USER_ID = res.body._id;
      assert.error(err, "No error");
      assert.end();
    });
});

test("PUT /user/:_id", function(assert) {
  request(app)
    .put(`/api/user/${CREATED_USER_ID}`)
    .send({
      first_name: "new_test_name"
    })
    .expect(200)
    .expect("Content-Type", /json/)
    .end(function(err, res) {
      console.log("User Id Created", CREATED_USER_ID);
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

/*Try Logging In with User - JWT Header should be returned x-access-token*/
test("LOGIN /user/login", assert => {
  request(app)
    .post(`/api/user/login`)
    .send({
      email: CREATED_USER_EMAIL,
      password: CREATED_USER_PASSWORD
    })
    .expect(200)
    .end((err, res) => {
      assert.isNotEqual(
        res.get("x-access-token"),
        null,
        "Should not be Equal."
      );

      assert.error(err, "No error");
      assert.end();
    });
});

/*Try Logging In with User - JWT Header should be returned x-access-token*/
test("LOGIN /user/:id/registration", assert => {
  request(app)
    .post(`/api/user/${CREATED_USER_ID}/registration`)
    .expect(200)
    .end((err, res) => {
      assert.isEqual(res.body.is_registered, true, "Should be rgistered.");

      assert.error(err, "No error");
      assert.end();
    });
});

test("DELETE /user/:id", function(assert) {
  request(app)
    .delete(`/api/user/${CREATED_USER_ID}`)
    .expect(204)
    .expect("Content-Type", /json/)
    .end(function(err, res) {
      assert.end();
    });
});
