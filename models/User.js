var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// var fileSchema = Schema({
//   name: String,
//   URI: String
// });

var userSchema = Schema({
  name: String,
  files: [{type: Schema.Types.ObjectId, ref: "File"}]
});

module.exports = mongoose.model("User", userSchema);
