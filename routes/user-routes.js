var User = require("../models/User");

module.exports = function(router) {
  router.route("/")
    .get(function(req, res) {})
    .post(function(req, res) {})

  router.route("/:user")
    .get(function(req, res) {})
    .put(function(req, res) {})
    .delete(function(req, res) {})

}
