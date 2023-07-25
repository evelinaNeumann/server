const express = require("express");
const router = express.Router();

const animalsData = require("../data/pets.json");
const shopData = require("../data/shopProducts.json");

const Product = require("../models/Product.model");
const CartItem = require("../models/CartItem.model");
const Pet = require("../models/Pet.model");
const Owner = require("../models/Owner.model");

router.get("/dogs", (req, res, next) => {
  const dogs = animalsData.dogs;
  res.json(dogs);
});

router.get("/cats", (req, res, next) => {
  const cats = animalsData.cats;
  res.json(cats);
});

router.get("/small_pets", (req, res, next) => {
  const smallPets = animalsData.small_pets;
  res.json(smallPets);
});

router.get("/all_pets", (req, res, next) => {
  const allPets = animalsData;
  res.json(allPets);
});

router.get("/owner/:ownerId", async (req, res) => {
  try {
    const ownerId = req.params.ownerId;

    // Find the owner by ID
    const owner = await Owner.findById(ownerId);

    if (owner) {
      return res.json(owner);
    } else {
      return res.json(null); // If the owner with the given ID is not found, return null
    }
  } catch (error) {
    console.error("Error fetching owner data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.get("/shop_products", async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/shop_products/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/cart", async (req, res) => {
  try {
    const cartItems = await CartItem.find();
    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cart/:productId", async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let cartItem = await CartItem.findOne({ productId });

    if (!cartItem) {
      cartItem = new CartItem({
        productId: product._id,
        name: product.name,
        category: product.category,
        quantity: 1,
        price: product.price,
      });
    } else {
      cartItem.quantity += 1;
    }

    await cartItem.save();

    res.json(cartItem);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/petprofile", async (req, res) => {
  try {
    const { breed, name, age, weight, description, image } = req.body;

    // Create a new instance of the PetProfile model with the submitted data
    const newProfile = new PetProfile({
      breed,
      name,
      age,
      weight,
      description,
      image,
    });

    // Save the new pet profile to the database
    await newProfile.save();

    res.json({ message: "Pet profile submitted successfully" });
  } catch (error) {
    console.error("Error submitting pet profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:productId", async (req, res) => {
  const productId = req.params.productId;

  try {
    const deletedItem = await CartItem.findOneAndDelete({ productId });

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
