var User = require("../models/User");
var File = require("../models/File");
var handle = require("./handle");

module.exports = function(router, s3) {

  router.route("/:user/files")
    .get(function(req, res) {
      var userid = req.params.user;
      User.findById(userid)
        .populate("files")
        .exec(function(err, data) {
          if (err) handle[500](err, res);
          else {
            console.log("Successful response to GET request at /user/" + userid + "/files")
            res.json(data.files);
          }
      });
    })
    .post(function(req, res) {
      var userid = req.params.user;
      var params = {Key: userid + "/", Body: req.body};
      User.findById(userid, function(err, user) {
        if (err) handle[500](err, res);
        else {
          var file = new File(req.body);
          user.files.push(file);
          user.save(function(err, data) {
            if (err) handle[500](err, res);
            console.log("Successful response to POST request at /user/" + userid + "/files")
            res.json(data.files);
          });
        }
      });
    })
    .delete(function(req, res) {
      var userid = req.params.user;
      User.findById(userid, function(err, user) {
        if (err) handle[500](err, res);
        else {
          var files = user.files;
          user.files = [];
          user.save(function(err, data) {
            if (err) handle[500](err, res);
            console.log("Successful response to DELETE request at /user/" + userid + "/files")
            res.json(files);
          });
        }
      });
    });

  router.route("/:user/files/:file")
    .get(function(req, res) {
      var userid = req.params.user;
      var fileid = req.params.file;
      User.findById(userid, function(err, user) {
        if (err) handle[500](err, res);
        else {
          console.log("Successful response to GET request at /user/" + userid + "/files/" + fileid);
          res.json(user.files.id(fileid));
        }
      });
    })
    .put(function(req, res) {
      var userid = req.params.user;
      var fileid = req.params.file;
      User.findOneAndUpdate(
        {_id: userid, "files._id": fileid},
        {"$set": {"files.$": req.body} },
        function(err, data) {
          if (err) handle[500](err, res);
          else {
            console.log("Successful response to PUT request at /user/" + userid + "/files/" + fileid);
            res.json(data);
          }
        }
      );
      // User.findById(userid, function(err, user) {
      //   if (err) handle[500](err, res);
      //   else {
      //     var file = user.files.id(fileid);
      //     user.files._id(fileid) = req.body;
      //     user.save(function(err, data) {
      //       if (err) handle[500](err, res);
      //       else {
      //         console.log("Successful response to PUT request at /user/" + userid + "/files/" + fileid);
      //         res.json(file);
      //       }
      //     });
      //   }
      // });
    })
    .delete(function(req, res) {
      var userid = req.params.user;
      var fileid = req.params.file;
      User.findById(userid, function(err, user) {
        if (err) handle[500](err, res);
        else {
          var file = user.files.id(fileid).remove();
          user.save(function(err, data) {
            if (err) handle[500](err, res);
            else {
              console.log("Successful response to DELETE request at /user/" + userid + "/files/" + fileid);
              res.json(file);
            }
          });
        }
      });
    });
};
