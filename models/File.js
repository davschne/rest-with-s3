var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var fileSchema = Schema({
  _id: {type: String, unique: true, required: true},
  URI: String
});

module.exports = mongoose.model("File", fileSchema);
