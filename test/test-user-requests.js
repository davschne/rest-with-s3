var chai = require("chai");
var expect = chai.expect;
var port = process.env.PORT || 5000;
var url = "localhost:" + port;
var app = require("../index");

chai.use(require("chai-http"));

var dummyUser = {"_id": "Dummy", "email": "dummy@dumb.com", "files": []};
var modifiedUser = {"email": "dumb@dumbo.dum"};
var id; // capture on POST for later use

describe("index.js", function() {
  describe("/users", function() {
    it("should respond to a well-formed POST request with status 200 and the data sent as JSON", function(done) {
      chai.request(url)
        .post("/users")
        .type("json")
        .send(dummyUser)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          // id = res.body._id;
          done();
        });
    });
    it("should respond to a GET request with status 200 and a JSON array of all users", function(done) {
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
  describe("/users/:user", function() {
    it("should respond to a well-formed PUT request with status 200 and the record being replaced as JSON", function(done) {
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
    it("should respond to a well-formed GET request with status 200 and the record of the requested user as JSON", function(done) {
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
    it("should respond to a well-formed DELETE request with status 200 and a JSON response", function(done) {
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
