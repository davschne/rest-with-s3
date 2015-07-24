var User = require("../models/User");
var File = require("../models/File");
var handle = require("./handle");

module.exports = function(router) {

  router.route("/:user/files")
    .get(function(req, res) {
      var userid = req.params.user;
      User.findById(userid, function(err, data) {
        if (err) handle[500](err, res);
        else {
          console.log("Successful response to GET request at /" + userid + "/files")
          res.json(data.files);
        }
      });
    })
    .post(function(req, res) {
      var userid = req.params.user;
      User.findById(userid, function(err, user) {
        if (err) handle[500](err, res);
        else {
          user.files.push(req.body);
          user.save(function(err, data) {
            if (err) handle[500](err, res);
            console.log("Successful response to POST request at /" + userid + "/files")
            res.json(data);
          });
        }
      });
    })
    .delete(function(req, res) {
      var userid = req.params.user;
      User.findById(userid, function(err, user) {
        if (err) handle[500](err, res);
        else {
          user.files = [];
          user.save(function(err, data) {
            if (err) handle[500](err, res);
            console.log("Successful response to DELETE request at /" + userid + "/files")
            res.json(data);
          });
        }
      });
    })

  router.route("/:user/files/:file")
    .get(function(req, res) {})
    .put(function(req, res) {})
};
