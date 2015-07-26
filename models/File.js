var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var fileSchema = Schema({
  _id: {type: String, unique: true, required: true},
  _creator: {type: String, ref: "User"},
  URI: String
});

module.exports = mongoose.model("File", fileSchema);
