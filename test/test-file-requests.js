var chai = require("chai");
var expect = chai.expect;
var port = process.env.PORT || 5000;
var url = "localhost:" + port;
var app = require("../index");

chai.use(require("chai-http"));

var dummyUser = {"_id": "Dummy", "email": "dummy@dumb.com", "files": []};
var dummyFile = {"_id": "test-file.txt", "content": "Hi, mom!"};

describe("/user/:user/files", function() {

  before(function(done) {
    chai.request(url)
      .post("/users")
      .type("json")
      .send(dummyUser)
      .end(function(err, res) {
        if (err) throw err;
        else done();
      });
  });

  describe("POST", function() {
    it("should create a new file document in Mongo and an object in S3 with the file contents, update the user's 'files' property to include a reference to the new file, then respond with status 200 and a JSON object containing a link to the file contents in S3", function(done) {
      chai.request(url)
        .post("/user/" + dummyUser._id + "/files")
        .type("json")
        .send(dummyFile)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.property("name", "test-file.txt");
          done();
        });
    });
  });

  describe("GET", function() {
    it("should respond with status 200 and a JSON array of the user's files, including links to the file contents in S3", function(done) {
      chai.request(url)
        .get("/user/" + dummyUser._id + "/files")
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an("array");
          done();
        });
    });
  });

  describe("DELETE", function() {
    it("should remove all the user's file records from Mongo and the corresponding file contents on S3, empty the user's 'files' property, and respond with status 200 and a JSON array of the deleted database documents", function(done) {

    });
  });
});

describe("/user/:user/files/:file", function() {

  describe("GET", function() {
    it("should respond with status 200 and a JSON object that contains a link to the file contents on S3", function(done) {

    });
  });

  describe("PUT", function() {
    it("should replace the contents of the file on S3 and respond with status 200 and a JSON object that contains a link to the modified file contents", function(done) {

    });
  });

  describe("DELETE", function() {
    it("should remove the file record from Mongo, the file contents on S3, and the reference to the file in the user's 'files' property, then respond with status 200 and a JSON object of the deleted database document", function(done) {

    });
  });
});
