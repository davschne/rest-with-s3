var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var AWS = require("aws-sdk");
var mongoose = require("mongoose");

var s3 = new AWS.S3({params: {Bucket: "davschne"}});

var userRouter = express.Router();
var fileRouter = express.Router();

require("./routes/user-routes")(userRouter, s3);
require("./routes/file-routes")(fileRouter, s3);

app.set("port", process.env.PORT || 5000);

app.use("/users", bodyParser.json(), userRouter);
app.use("/user", bodyParser.json(), fileRouter);

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost/rest-with-s3", function(err) {
  if (err) console.log(err);
  else console.log("Opened connection to MongoDB");
});

process.on("exit", function() {
  mongoose.disconnect();
});

app.listen(app.get("port"), function() {
  console.log("Server running on port " + app.get("port"));
});
