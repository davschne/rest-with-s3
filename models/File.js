var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var fileSchema = Schema({
  _id: {type: String, unique: true, required: true},
  _creator: {type: String, ref: "User"},
});

fileSchema.methods.remove = function() {
  // remove File record
  // remove contents in s3
};

fileSchema.methods.replace = function(newFile) {
  // replace contents in s3
};

module.exports = mongoose.model("File", fileSchema);
