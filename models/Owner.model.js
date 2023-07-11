const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const ownerSchema = new Schema(
  {
    ownerEmail: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    ownerPassword: {
      type: String,
      required: [true, "Password is required."],
    },
    ownerName: {
      type: String,
      required: [true, "Name is required."],
    },
    ownerPhone: {
        type: Number,
        required: [true, "Number is required."],
    },    
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Owner = model("Owner", ownerSchema);

module.exports = Owner;