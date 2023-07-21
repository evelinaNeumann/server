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
  cloud_name:  'dnstseshn',
  api_key:  '537231312596738',
  api_secret:  '-pktoj2PPvkowDtf5NcnoakXdpI' ,
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


module.exports = router;
