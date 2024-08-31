const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const readingListSchema = new Schema({
  bookId: { type: String, required: true },
  userId: { type: [String], default: [], required: true },
  createdOn: { type: Date, default: new Date().getTime() },
});

module.exports = mongoose.model("readingList", readingListSchema);
