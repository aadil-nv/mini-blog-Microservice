const asynchandler = require("express-async-handler");
const generateToken = require("../config/genarateToken");
const Users = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// todo-------------------------------------------------------------------------------------------

const registerUser = asynchandler(async (req, res) => {
  const { name, password, email } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "All fields are required: name, email, and password" });
  }

  const userExists = await Users.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ message: "User already exists with this email" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await Users.create({ name, email, password: hashedPassword });

  const token = generateToken(newUser._id);

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400).json({ message: "User not created" });
  }
});

const loginUser = asynchandler(async (req, res) => {
    const { name, password } = req.body;

    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  
   
    if (token) {
      try {
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        

        const user = await Users.findOne({ name });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid password" });
        }
  
        return res.status(200).json({
          message: "Successfully logged",
          userDetails: {
            userId: user._id,
            name: user.name,
            email: user.email,
          },
        });
  
      } catch (error) {
        console.log("Invalid Token:", error.message);
        return res.status(401).json({ message: "Invalid Token" });
      }
    }
  });

  const getUserProfile = asynchandler(async (req, res) => {
    const { id } = req.params;
    console.log("User ID from params:", id);

    const userData = await Users.findById(id);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
  

    res.status(200).json({
      message: "User profile retrieved successfully",
      userId: userData._id,
      userName: userData.name,
      userEmail: userData.email,
    });
  });


// todo-------------------------------------------------------------------------------------------


module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
