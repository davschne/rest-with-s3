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
      var user;
      var file;
      var filename;
      User.findById(userid)
        .exec()
        .then(function(foundUser) {
          // Create file and save to DB
          user = foundUser;
          filename = userid + "/" + req.body._id;
          file = new File({
            _id: filename,
            _creator: userid
          });
          file.save();
        })
        .then(function() {
          // Add reference in user document
          user.files.push({_id: filename});
          user.save();
        })
        .then(function() {
          // Save content to AWS
          var params = {
            Key: filename,
            Body: req.body.content
          };
          s3.upload(params, function(err, data) {
            if (err) throw err;
            else return;
          });
        })
        .then(function() {
          // Send response
          console.log("Successful response to POST request at /user/" + userid + "/files");
          res.json(file);
        }, function(err) {
          handle[500](err, res);
        });
    })
    .delete(function(req, res) {
      var userid = req.params.user;
      var user;
      var files;
      User.findByIdAndUpdate(userid, {
        $pull: {
          files: {}
        }
      })
      .exec(function(err, foundUser) {
        if (err) throw err;
        user = foundUser;
      })
      // User.findById(userid)
      //   .exec()
      //   .then(function(foundUser) {
          // Remove file documents
          // user = foundUser;
          // files = user.files;
          // var query = files.reduce(function(acc, curr) {
          //   acc = acc.remove(curr)
          // })
          // for (var i = 0; i < files.length; i++) {
          //   files[i].remove().exec();            // PROBLEM IS HERE, I THINK
          // }
          // Remove references to files in user document
          // user.files = [];
          // user.save();
        // })
      .then(function() {
        return File.remove({_creator: userid}).exec();
      })
      .then(function() {
        // Delete files from AWS
        files = user.files;
        var objects = [];
        for (var i = 0; i < files.length; i++) {
          var current = {
            Key: files[i]._id
          };
          objects.push(current);
        }
        s3.deleteObjects({
          Delete: {
            Objects: objects
          }
        }, function(err, data) {
          if (err) throw err;
          else return;
        });
      })
      .then(function() {
        // Send response
        console.log("Successful response to DELETE request at /user/" + userid + "/files");
        res.json(files);
      }, function(err) {
        handle[500](err, res);
      });
      // , function(err, user) {
      //   if (err) handle[500](err, res);
      //   else {
      //     var files = user.files;
      //     user.files = [];
      //     user.save(function(err, data) {
      //       if (err) handle[500](err, res);
      //       console.log("Successful response to DELETE request at /user/" + userid + "/files")
      //       res.json(files);
      //     });
      //   }
      // });
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
