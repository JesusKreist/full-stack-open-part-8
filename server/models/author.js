const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
    default: null,
  },
  bookCount: {
    type: Number,
    default: 0,
  },
});

authorSchema.plugin(uniqueValidator);

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
