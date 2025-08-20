import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Incoming registration data:", req.body); // logging the incoming data

    const existingUser = await User.find({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
        console.log("User registered successfully:", newUser); // logging successful registration

    res.status(201).json({ 
        _id: newUser._id, 
        username: newUser.username, 
        email: newUser.email, 
    });
  } catch (err) {
    if (err.code === 11000) {
      // duplicating key error
      return res.status(400).json({ message: "Username or Email already exists" });
    }
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  // similar logic with bcrypt.compare
};

export const me = async (req, res) => {
  // return user from session/token
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
