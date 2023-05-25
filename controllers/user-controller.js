const asyncHandler = require("express-async-handler");
const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateEmail } = require("../utils/email-phone-validator");

//@desc Register User
//@route POST /api/user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ error: "All fields are mandatory!" });
    throw new Error("All fields are mandatory!");
  }
  if (!validateEmail(email)) {
    res.status(400).json({ message: "Please enter a valid email address!" });
    throw new Error("Please enter a valid email address!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400).json({ error: "User already registered!" });
    throw new Error("User already registered!");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });
  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
    });
  } else {
    res.status(500).json({ error: "Database error occurred!" });
    throw new Error("Database error occurred!");
  }
});

//@desc Login User
//@route POST /api/user/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "All fields are mandatory!" });
    throw new Error("All fields are mandatory!");
  }
  if (!validateEmail(email)) {
    res.status(400).json({ message: "Please enter a valid email address!" });
    throw new Error("Please enter a valid email address!");
  }
  const user = await User.findOne({ email });

  //compare password with hashedPassword

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );
    res.status(200).json({
      accessToken,
    });
  } else {
    res.status(401).json({ error: "Email or Password is not valid" });
    throw new Error("Email or Password is not valid");
  }
});

//@desc Current user info
//@route POST /api/user/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  console.log(req.user);
  res.json(req.user);
});

module.exports = { loginUser, registerUser, currentUser };
