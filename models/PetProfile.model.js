const mongoose = require("mongoose");

// Define the schema for the Animal model
const profileSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  breed: {
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
  weight: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

// Create and export the Profile model using the schema
module.exports = mongoose.model("PetProfile", profileSchema);
