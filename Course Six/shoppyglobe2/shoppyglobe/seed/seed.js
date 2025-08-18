const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Product = require('../models/Product');

// Load environment variables
dotenv.config();

// Connection URI (default to localhost if not provided)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shoppyglobe';

async function seedProducts() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    // Read products from JSON file
    const dataPath = path.join(__dirname, 'products.json');
    const products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    // Clear existing products
    await Product.deleteMany({});
    // Insert new products
    await Product.insertMany(products);
    console.log('Seed data imported successfully');
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts();