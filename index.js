var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var userRouter = express.Router();
var fileRouter = express.Router();

require("./routes/user-routes")(userRouter);
require("./routes/file-routes")(fileRouter);

app.set("port", process.env.PORT || 5000);

app.use("/users", bodyParser.json(), userRouter);

app.use("/user", bodyParser.json(), fileRouter)

app.listen(app.get("port"), function() {
  console.log("Server running on port " + app.get("port"));
});
