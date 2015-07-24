var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var fileSchema = Schema({
  name: String,
  URI: String
});

var userSchema = Schema({
  name: String,
  files: [fileSchema]
});

module.exports = mongoose.model("User", userSchema);
