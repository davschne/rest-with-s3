var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var fileSchema = Schema({
  name: String,
  URI: String
});

module.exports = mongoose.model("File", fileSchema);
