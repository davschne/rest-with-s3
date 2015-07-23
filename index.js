var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var AWS = require("aws-sdk");
var mongoose = require("mongoose");

var s3 = new AWS.S3();

var userRouter = express.Router();
var fileRouter = express.Router();

require("./routes/user-routes")(userRouter);
require("./routes/file-routes")(fileRouter);

app.set("port", process.env.PORT || 5000);

app.use("/users", bodyParser.json(), userRouter);
app.use("/user", bodyParser.json(), fileRouter);

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost/rest-with-s3", function(err) {
  if (err) console.log(err);
  else console.log("Opened connection to MongoDB");
});

app.listen(app.get("port"), function() {
  console.log("Server running on port " + app.get("port"));
});
