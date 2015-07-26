module.exports = {
  500: function(err, res) {
    console.error(err);
    res.status(500).json({msg: "Server error", err: err});
  }
};
