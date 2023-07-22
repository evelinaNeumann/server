const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const upload = multer({ dest: "uploads/" });
const Pet = require("../models/Pet.model");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/jwt.middleware");
require("dotenv").config();
const Pets = require("../models/Pet.model")




//Owner Page Routes
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// POST /pet/petprofile - Creates a new pet and associates it with the authenticated owner
router.post("/petprofile", isAuthenticated, async (req, res, next) => {
  try {
    const { name, category, type, age, temper, special_needs, image } = req.body;

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

router.get("/pets", async (req, res) => {
  try {
    const allPets = await Pet.find();
    res.json(allPets);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dogs", async (req, res) => {
  try {
    const allDogs = await Pet.find({ category: 'dog' });
    res.json(allDogs);
  } catch (error) {
    console.error("Error fetching dogs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/cats", async (req, res) => {
  try {
    const allCats = await Pet.find({ category: 'cat' });
    res.json(allCats);
  } catch (error) {
    console.error("Error fetching dogs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/small_animals", async (req, res) => {
  try {
    const allLittleAnimals = await Pet.find({ category: 'small_animal' });
    res.json(allLittleAnimals);
  } catch (error) {
    console.error("Error fetching dogs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
