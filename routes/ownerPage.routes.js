const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const upload = multer({ dest: "uploads/" });
const Pet = require("../models/Pet.model");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/jwt.middleware");

//Owner Page Routes
// Configure Cloudinary
cloudinary.config({
  cloud_name: "dnstseshn",
  api_key: "537231312596738",
  api_secret: "-pktoj2PPvkowDtf5NcnoakXdpI",
});

// POST /pet/petprofile - Creates a new pet and associates it with the authenticated owner
router.post("/petprofile", isAuthenticated, async (req, res, next) => {
  try {
    const { name, category, type, age, temper, special_needs, image } =
      req.body;

    // Get the authenticated owner ID from the request payload
    const ownerId = req.payload._id;

    // Create a new pet document and associate it with the authenticated owner
    const pet = new Pet({
      owner: ownerId,
      name,
      category,
      type,
      age,
      temper,
      special_needs,
      image,
    });

    // Save the pet to the database
    await pet.save();

    // Send a response with the newly created pet object
    res.status(201).json({ pet });
  } catch (err) {
    next(err);
  }
});

// Handle image upload
router.post("/pet/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  cloudinary.uploader.upload(file.path, (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to upload image" });
    } else {
      res.json({ publicId: result.public_id });
    }
  });
});

// DELETE /pet/petprofile/:id - Deletes an existing pet profile
router.delete("/pet/deletepet/:id", isAuthenticated, async (req, res, next) => {
  try {
    const petId = req.params.id; // Get the pet ID from the request params
    const ownerId = req.payload._id; // Get the authenticated owner ID from the request payload

    // Check if the authenticated owner is the owner of the pet
    const pet = await Pet.findOne({ _id: petId, owner: ownerId });
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    // Remove the pet from the database
    await Pet.findByIdAndRemove(petId);

    // Send a response indicating successful deletion
    res.json({ message: "Pet deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// PUT /pet/petprofile/:id - Updates an existing pet profile
router.put("/pet/editpet/:id", isAuthenticated, async (req, res, next) => {
  try {
    const petId = req.params.id; // Get the pet ID from the request params
    const ownerId = req.payload._id; // Get the authenticated owner ID from the request payload

    // Check if the authenticated owner is the owner of the pet
    const pet = await Pet.findOne({ _id: petId, owner: ownerId });
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    const { name, category, type, age, temper, special_needs, image } =
      req.body;

    // Update the pet profile with the new data
    pet.name = name;
    pet.category = category;
    pet.type = type;
    pet.age = age;
    pet.temper = temper;
    pet.special_needs = special_needs;
    pet.image = image;

    // Save the updated pet profile
    await pet.save();

    // Send a response with the updated pet object
    res.json({ pet });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
