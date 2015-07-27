var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = Schema({
  _id: {type: String, unique: true, required: true},
  email: String,
  files: [{type: String, ref: "File"}]
});

userSchema.methods.remove = function() {
  // removeAllFiles()
  // remove User
};

userSchema.methods.replace = function(newUser) {
  // update User
  // disallow changing files here
};

userSchema.methods.removeFile = function(filename) {
  // remove reference in "files" array
  // file.remove()
};

userSchema.methods.removeAllFiles = function() {
  // remove references in "files" array
  // file.remove() for each file
};

module.exports = mongoose.model("User", userSchema);
