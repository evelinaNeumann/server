

const mongoose = require("mongoose");

// Define the schema for the Animal model
const animalSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  temper: {
    type: String,
    required: true,
  },
  special_needs: {
    type: Boolean,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

// Create and export the Animal model using the schema
module.exports = mongoose.model("Animal", animalSchema);
