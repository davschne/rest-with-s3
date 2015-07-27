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
      File.find({_creator: userid})
        .remove(function(err, data) {
          // Remove File records
          if (err) handle[500](err, res);
          User.findByIdAndUpdate(userid, {
            // Remove references in User record
            $set: {files: []}
          })
          .exec(function(err, foundUser) {
            if (err) handle[500](err, res);
            else if (!foundUser) handle[404](new Error("User " + userid + " not found"), res);
            else {
              user = foundUser.toObject();
            }
          })
          .then(function() {
            // Delete files from AWS
            files = user.files;
            var objects = [];
            for (var i = 0; i < files.length; i++) {
              var current = {
                Key: files[i]
              };
              objects.push(current);
            }
            s3.deleteObjects({
              Delete: {
                Objects: objects
              }
            }, function(err, data) {
              if (err) handle[500](err, res);
            });
          })
          .then(function() {
            console.log("Successful response to DELETE request at /user/" + userid + "/files")
            res.json(files);
          });
        });
    });

  router.route("/:user/files/:file")
    .get(function(req, res) {
      var userid = req.params.user;
      var fileid = req.params.file;
      var fullpath = userid + "/" + fileid;
      var file;
      var url;
      File.findById(fullpath)
        .exec(function(err, foundFile) {
          if (err) handle[500](err, res);
          else if (!foundFile) handle[404](new Error(fullpath + " not found"), res);
          else file = foundFile.toObject();
        })
        .then(function() {
          return s3.getSignedUrl("getObject", {Key: fullpath}, function(err, foundUrl) {
            if (err) handle[500](err, res);
            else url = foundUrl;
          });
        })
        .then(function() {
          file.URL = url;
          console.log("Successful response to GET request at /user/" + userid + "/files/" + fileid);
          res.json(file);
        });
    })
    .put(function(req, res) {
      // var userid = req.params.user;
      // var fileid = req.params.file;
      // User.findOneAndUpdate(
      //   {_id: userid, "files._id": fileid},
      //   {"$set": {"files.$": req.body} },
      //   function(err, data) {
      //     if (err) handle[500](err, res);
      //     else {
      //       console.log("Successful response to PUT request at /user/" + userid + "/files/" + fileid);
      //       res.json(data);
      //     }
      //   }
      // );
    })
    .delete(function(req, res) {
      var userid = req.params.user;
      var fileid = req.params.file;
      var fullpath = userid + "/" + fileid;
      var file;
      User.findByIdAndUpdate(userid, {
        $pull: {files: fullpath}
      })
      .exec(function(err, data) {
        if (err) handle[500](err, res);
      })
      .then(function() {
        return File.findByIdAndRemove(fullpath)
          .exec(function(err, foundFile) {
            if (err) handle[500](err, res);
            else if (!foundFile) handle[404](new Error("File " + fileid + " not found"), res);
            else {
              file = foundFile.toObject();
            }
          });
      })
      .then(function() {
        return s3.deleteObject({Key: fullpath}, function(err, data) {
          if (err) handle[500](err, res);
        });
      })
      .then(function() {
        console.log("Successful response to DELETE request at /user/" + userid + "/files/" + fileid);
        res.json(file);
      });
    });
};
