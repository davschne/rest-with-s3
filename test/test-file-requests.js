var chai = require("chai");
var expect = chai.expect;
var port = process.env.PORT || 5000;
var url = "localhost:" + port;
var app = require("../index");

chai.use(require("chai-http"));

var dummyUser = {"name": "Dummy", "files": []};
var dummyFile = {"name": "test-file.txt", "content": "Hi, mom!"};

// capture on POST for later use
var userid;
var fileid;

describe("index.js", function() {
  before(function(done) {
    chai.request(url)
      .post("/users")
      .type("json")
      .send(dummyUser)
      .end(function(err, res) {
        userid = res.body._id; // store user id
        done();
      });
  });
  describe("/user/:user/files", function() {
    it("should respond to a well-formed POST request with status 200 and the data sent as JSON", function(done) {
      chai.request(url)
        .post("/user/" + userid + "/files");
        .type("json")
        .send(dummyFile)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property("name", "test-file.txt");
          fileid = res.body._id;
          done();
        });
    });
    it("should respond to a GET request with status 200 and a JSON array of the user's files", function(done) {
      chai.request(url)
        .get("/user/" + userid + "/files");
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an("array");
          done();
        });
    });
  });
  // describe("/users/:user", function() {
  //   it("should respond to a well-formed PUT request with status 200 and the record being replaced as JSON", function(done) {
  //     chai.request(url)
  //       .put("/users/" + id)
  //       .type("json")
  //       .send(modifiedUser)
  //       .end(function(err, res) {
  //         expect(err).to.be.null;
  //         expect(res).to.have.status(200);
  //         expect(res).to.be.json;
  //         expect(res.body).to.have.property("name", "Dummy");
  //         done();
  //       });
  //   });
  //   it("should respond to a well-formed GET request with status 200 and the record of the requested user as JSON", function(done) {
  //     chai.request(url)
  //       .get("/users/" + id)
  //       .end(function(err, res) {
  //         expect(err).to.be.null;
  //         expect(res).to.have.status(200);
  //         expect(res).to.be.json;
  //         expect(res.body).to.have.property("name", "Dumbo");
  //         done();
  //       });
  //   });
  //   it("should respond to a well-formed DELETE request with status 200 and a JSON response", function(done) {
  //     chai.request(url)
  //       .delete("/users/" + id)
  //       .end(function(err, res) {
  //         expect(err).to.be.null;
  //         expect(res).to.have.status(200);
  //         expect(res).to.be.json;
  //         done();
  //       });
  //   });
  // });
});
