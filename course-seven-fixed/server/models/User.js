// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema(
//   {
//     username: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     avatar: { type: String },
//     channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }]
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('User', userSchema);

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
