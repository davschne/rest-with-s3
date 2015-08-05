var chai = require("chai");
var expect = chai.expect;
var port = process.env.PORT || 5000;
var url = "localhost:" + port;
var app = require("../index");

chai.use(require("chai-http"));

var dummyUser = {"_id": "Idiot", "email": "idiot@idiocy.com", "files": []};
var modifiedUser = {"_id": "Moron", "email": "moron@idiocy.com"};

describe("/users", function() {

  describe("POST", function() {
    it("should create a new user document in Mongo and respond with status 200 and a JSON object of the new document", function(done) {
      chai.request(url)
        .post("/users")
        .type("json")
        .send(dummyUser)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });
  });

  describe("GET", function() {
    it("should respond with status 200 and a JSON array of all users with 'files' property populated, including links to the contents of each file on S3", function(done) {
      chai.request(url)
        .get("/users")
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an("array");
          done();
        });
    });
  });
});

describe("/users/:user", function() {

  describe("PUT", function() {
    it("should replace an existing user document in Mongo, modifying each file document associated with that user as well as the file paths in S3 if the user's _id property is changed, then return a JSON object of the modified user document with 'files' property populated, including links to the file contents in S3", function(done) {
      chai.request(url)
        .put("/users/" + dummyUser._id)
        .type("json")
        .send(modifiedUser)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property("_id", dummyUser._id);
          done();
        });
    });
  });

  describe("GET", function() {
    it("should respond with status 200 and a JSON object of user document with 'files' property populated, including links to each file's contents in S3", function(done) {
      chai.request(url)
        .get("/users/" + dummyUser._id)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property("email", modifiedUser.email);
          done();
        });
    });
  });

  describe("DELETE", function() {
    it("should remove a user document and all files created by the user, including both documents in Mongo and the associated objects in S3, then respond with status 200 and a JSON object of the deleted user's record with 'files' property populated", function(done) {
      chai.request(url)
        .delete("/users/" + dummyUser._id)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          done();
        });
    });
  });
});
