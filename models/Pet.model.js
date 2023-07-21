const mongoose = require("mongoose");
const Owner = require("./Owner.model");

const petSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
  },
  name: String,
  category: {
    type: String,
    enum: ["dog", "cat", "small_animal"], 
  },
  type: String,
  age: Number,
  temper: String,
  special_needs: Boolean,
  image: String,
});

module.exports = mongoose.model("Pet", petSchema);
