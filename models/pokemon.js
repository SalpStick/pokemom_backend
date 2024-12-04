const mongoose = require("mongoose");
const validator = require("validator");

const pokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  imageUrl: {
    type: String,
    required: false,
    validate: {
      validator: (value) => validator.isURL(value),
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  number: {
    type: Number,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("item", pokemonSchema)
