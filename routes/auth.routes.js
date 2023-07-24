const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// ℹ️ Handles password encryption
const jwt = require("jsonwebtoken");

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Owner = require("../models/Owner.model");

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", (req, res, next) => {
  const { email, password, name, preference } = req.body;

  // Check if email or password or name are provided as empty strings
  if (email === "" || password === "" || name === "" || preference === "") {
    res.status(400).json({ message: "Provide email, password, name and preference" });
    return;
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // This regular expression checks password for special characters and minimum length
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
      return User.create({ email, password: hashedPassword, name, preference });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { email, name, preference, _id } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { email, name, preference, _id };

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, name, preference } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, email, name, preference };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

//Owner auth

// POST /auth/ownersignup
router.post("/ownersignup", (req, res, next) => {
  const { ownerEmail, ownerPassword, ownerName, ownerPhone, city, state, zip, country } = req.body;
console.log(req.body);
  // Check if email or password or name are provided as empty strings
  if (ownerEmail === "" || ownerPassword === "" || ownerName === "" || ownerPhone === "" || city === "" || state === ""  || country === "") {
    res.status(400).json({ message: "Provide email, password, name and address" });
    return;
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(ownerEmail)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // This regular expression checks password for special characters and minimum length
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(ownerPassword)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Check the users collection if a user with the same email already exists
  Owner.findOne({ ownerEmail })
    .then((foundOwner) => {
      // If the user with the same email already exists, send an error response
      if (foundOwner) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(ownerPassword, salt);

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
      return Owner.create({ ownerEmail, ownerPassword: hashedPassword, ownerName, ownerPhone, city, state, zip, country });
    })
    .then((createdOwner) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { ownerEmail, ownerName, ownerPhone, city, state, zip, country, _id } = createdOwner;

      // Create a new object that doesn't expose the password
      const owner = { ownerEmail, ownerName, ownerPhone, city, state, zip, country, _id };

      // Send a json response containing the user object
      res.status(201).json({ owner: owner });
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/ownerlogin", (req, res, next) => {
  const { ownerEmail, ownerPassword } = req.body;

  // Check if email or password are provided as empty string
  if (ownerEmail === "" || ownerPassword === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  // Check the users collection if a user with the same email exists
  Owner.findOne({ ownerEmail })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(ownerPassword, foundUser.ownerPassword);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, ownerEmail, ownerName, ownerPhone, city, state, zip, country } = foundUser;

        // Create an object that will be set as the token payload
        const payload = {
          _id,
          ownerEmail,
          ownerName,
          ownerPhone,
          city,
          state,
          zip,
          country,
        };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

router.post("/editprofile", (req, res, next) => {
  const { email, name, preference } = req.body;

  // Check if email or name or preference are provided as empty strings
  if (email === "" || name === "" || preference === "") {
    res.status(400).json({ message: "Provide email, name, and preference" });
    return;
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // Find and update the user's information in the database
  User.findOneAndUpdate(
    { email }, // Filter for finding the user by email
    { name, preference, email }, // Fields to update
    { new: true } // Options: return the updated document in the response
  )
    .then((updatedUser) => {
      // If the user with the provided email doesn't exist, send an error response
      if (!updatedUser) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      // Deconstruct the updated user object to omit the password
      // We should never expose passwords publicly
      const { email, name, preference, _id } = updatedUser;

      // Create a new object that doesn't expose the password
      const user = { email, name, preference, _id };

      // Send a json response containing the updated user object
      res.status(200).json({ user: user });
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});


router.post("/editownerprofile", (req, res, next) => {
  const { ownerName, ownerEmail, ownerPhone, city, zip, country } = req.body;

  // Check if email or name or preference are provided as empty strings
  if (ownerName === "" || ownerEmail === "" || ownerPhone === "" || city === "" || zip === "" || country === "") {
    res.status(400).json({ message: "Please fill all the fields" });
    return;
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(ownerEmail)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // Find and update the user's information in the database
  Owner.findOneAndUpdate(
    { ownerEmail }, // Filter for finding the user by email
    { ownerName, ownerEmail, ownerPhone, city, zip, country }, // Fields to update
    { new: true } // Options: return the updated document in the response
  )
    .then((updatedUser) => {
      // If the user with the provided email doesn't exist, send an error response
      if (!updatedUser) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      // Deconstruct the updated user object to omit the password
      // We should never expose passwords publicly
      const { ownerName, ownerEmail, ownerPhone, city, zip, country, _id } = updatedUser;

      // Create a new object that doesn't expose the password
      const user = { ownerName, ownerEmail, ownerPhone, city, zip, country, _id };

      // Send a json response containing the updated user object
      res.status(200).json({ user: user });
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});





// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`
  // console.log(`req.payload`, req.payload);

  // Send back the token payload object containing the user data
  res.status(200).json(req.payload);
});

module.exports = router;
