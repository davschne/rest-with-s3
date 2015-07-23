var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var fileSchema = Schema({
  name: String,
  URI: String,
  user: {type: Schema.Types.ObjectId, ref: "User"}
});

module.exports = mongoose.model("File", fileSchema);
