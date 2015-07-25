var AWS = require("aws-sdk");
var s3 = new AWS.S3();

s3.listBuckets(function(err, data) {
  if (err) console.error(err);
  else {
    for (var i in data.Buckets) {
      var bucket = data.Buckets[i];
      console.log("bucket:", bucket.Name);
    }
  }
});
