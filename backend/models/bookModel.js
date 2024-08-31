const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  authors: { type: [String], default: [] },
  rating: { type: Number, default: 0 },
  reviewsNb: { type: Number, default: 0 },
  description: { type: String, required: true },
  imgSrc: { type: String, required: true },
  createdOn: { type: Date, default: new Date().getTime() },
});

module.exports = mongoose.model("Book", bookSchema);
