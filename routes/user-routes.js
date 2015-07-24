var User = require("../models/User");
var handle = require("./handle");

module.exports = function(router) {
  router.route("/")
    .get(function(req, res) {
      console.log("GET request at /users");
      // User.find({})
      //   .stream({"transform": JSON.stringify})
      //   .pipe(res);
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
      User.findById(id, function(err, data) {
        if (err) handle[500](err, res);
        else {
          console.log("Successful response to GET request at /users/" + id);
          res.json(data);
        }
      });
      // User.findById(id)
      //   .populate("files")
      //   .stream({transform: JSON.stringify})
      //   .pipe(res);
    })
    .put(function(req, res) {
      var id = req.params.user;
      console.log("PUT request at /users/" + id);
      User.update({_id: id}, function(err, raw) {
        if (err) handle[500](err, res);
        else {
          console.log("Successful response to PUT request at /users/" + id);
          res.json(raw);
        }
      });
    })
    .delete(function(req, res) {
      var id = req.params.user;
      console.log("DELETE request at /users/" + id);
      User.remove({_id: id}, function(err, data) {
        if (err) handle[500](err, res);
        else {
          console.log("Successful response to DELETE request at /users/" + id);
          res.json(data);
        }
      });
    });
};
