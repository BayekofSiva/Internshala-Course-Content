const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get a single product by ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

module.exports = router;