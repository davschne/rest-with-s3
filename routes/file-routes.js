var File = require("../models/File");

module.exports = function(router) {

  router.route("/:user/files")
    .get(function(req, res) {})
    .post(function(req, res) {})
    .delete(function(req, res) {})

  router.route("/:user/files/:file")
    .get(function(req, res) {})
    .put(function(req, res) {})
}
