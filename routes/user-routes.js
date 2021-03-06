var User = require("../models/User");
var handle = require("./handle");

module.exports = function(router, s3) {
  router.route("/")
    .get(function(req, res) {
      console.log("GET request at /users");
      User.find({}, function(err, data) {
        if (err) handle[500](err, res);
        else {
          console.log("Successful response to GET request at /users");
          res.json(data);
        }
      });
    })
    .post(function(req, res) {
      console.log("POST request at /users");
      var user = new User(req.body);
      user.save(function(err, data) {
        if (err) handle[500](err, res);
        else {
          console.log("Successful response to POST request at /users");
          res.json(data);
        }
      });
    });

  router.route("/:user")
    .get(function(req, res) {
      var id = req.params.user;
      console.log("GET request at /users/" + id);
      User.findById(id)
        .populate('files')
        .exec(function(err, data) {
          if (err) handle[500](err, res);
          else {
            console.log("Successful response to GET request at /users/" + id);
            res.json(data);
          }
      });
    })
    .put(function(req, res) {
      var id = req.params.user;
      console.log("PUT request at /users/" + id);
      User.findByIdAndUpdate(id, req.body, function(err, data) {
        if (err) handle[500](err, res);
        else {
          console.log("Successful response to PUT request at /users/" + id);
          res.json(data);
        }
      });
    })
    .delete(function(req, res) {
      var id = req.params.user;
      console.log("DELETE request at /users/" + id);
      User.findByIdAndRemove(id, function(err, data) {
        if (err) handle[500](err, res);
        else {
          console.log("Successful response to DELETE request at /users/" + id);
          res.json(data);
        }
      });
    });
};
