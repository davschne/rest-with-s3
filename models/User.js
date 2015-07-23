var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = Schema({
  name: String,
  files: [{Schema.Types.ObjectID, ref: "File"}]
});

module.exports = mongoose.model("User", userSchema);
