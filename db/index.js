const mongoose = require("mongoose");
const Animal = require("../models/Animal.model");
const Product = require("../models/Product.model");
require("dotenv").config();
/*const Pet = require("../models/Pet.model");
const petData = require("../data/pets.json");

const shopData = require("../data/shopProducts.json");*/
const multer = require("multer");
const MONGO_URI =
  process.env.MONGODB_URI 

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const dbName = x.connections[0].name;

    console.log(`Connected to Mongo! Database name: "${dbName}"`);
 
    // Function to save animals of a specific category
const saveAnimals = async (animals, category) => {
  for (let animal of animals) {
    try {
      const existingAnimal = await Animal.findOne({ name: animal.name });

      if (!existingAnimal) {
        const newAnimal = new Animal({
          _id: new mongoose.Types.ObjectId(),
          category: category,
          name: animal.name,
          type: animal.type,
          age: animal.age,
          temper: animal.temper,
          special_needs: animal.special_needs,
          image: animal.image,
        });

        await newAnimal.save();
        console.log(`Saved ${category}: ${animal.name}`);
      } else {
        console.log(`Animal already exists: ${animal.name}`);
      }
    } catch (err) {
      console.error(`Error saving ${category}: ${animal.name}`, err);
    }
  }
};


    // Function to save products
    const saveProducts = async (products) => {
      for (let product of products) {
        try {
          const existingProduct = await Product.findOne({ name: product.name });

          if (!existingProduct) {
            const newProduct = new Product(product);
            await newProduct.save();
            console.log(`Saved product: ${product.name}`);
          } else {
            console.log(`Product already exists: ${product.name}`);
          }
        } catch (err) {
          console.error(`Error saving product: ${product.name}`, err);
        }
      }
    };

    //Saving pet data from owner account
 


// Configure Multer to handle image uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
 
 


   /* // Save pets
    saveAnimals(petData.dogs, "dog");
    saveAnimals(petData.cats, "cat");
    saveAnimals(petData.small_pets, "small_pet");
*/
    // Save shop products
    /*saveProducts(shopData);*/
    
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });
