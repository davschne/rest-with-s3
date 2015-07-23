var User = require("../models/User");

var handle = {
  500: function(res) {
    res.status(500).json({msg: "Server error"});
  }
};

module.exports = function(router) {
  router.route("/")
    .get(function(req, res) {
      User.find({}, function(err, data) {
        if (err) handle[500](res);
        else res.json(data);
      });
    })
    .post(function(req, res) {
      var user = new User(req.body);
      user.save(function(err, data) {
        if (err) handle[500](res);
        else res.json(data);
      })
    });

  router.route("/:user")
    .get(function(req, res) {
      User.findById(req.params.user)
    })
    .put(function(req, res) {})
    .delete(function(req, res) {});
};
