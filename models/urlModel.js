const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  urlCode: { type: String, unique: true },
  longUrl: String,
  shortUrl: String,
  date: { type: String, default: Date.now },
});

module.exports = mongoose.model("Url", urlSchema);
