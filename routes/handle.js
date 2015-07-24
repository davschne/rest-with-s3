module.exports = {
  500: function(err, res) {
    console.log(err);
    res.status(500).json({msg: "Server error", err: err});
  }
};
