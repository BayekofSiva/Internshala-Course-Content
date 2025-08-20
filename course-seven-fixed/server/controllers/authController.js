import bcrypt from "bcrypt";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Incoming registration data:", req.body); // logging the incoming data

    const existingUser = await User.find({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

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
  } catch (error) {
    console.error("Register error:", error);  // logging the error
    res.status(500).json({ message: "Server error", error: error.message });
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
