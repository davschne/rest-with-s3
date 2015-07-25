var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// var fileSchema = Schema({
//   name: String,
//   URI: String
// });

var userSchema = Schema({
  _id: {type: String, unique: true, required: true},
  email: String,
  files: [{type: String, ref: "File"}]
});

module.exports = mongoose.model("User", userSchema);
