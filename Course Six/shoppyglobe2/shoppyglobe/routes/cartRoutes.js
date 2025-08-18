const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

const router = express.Router();

/**
 * @route   GET /api/cart
 * @desc    Get all cart items for the logged‑in user
 * @access  Private
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const items = await CartItem.find({ user: req.user._id }).populate('product');
    res.json(items);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/cart
 * @desc    Add a product to the cart
 * @access  Private
 */
router.post(
  '/',
  authMiddleware,
  [
    body('productId').isMongoId().withMessage('Invalid product ID'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { productId, quantity } = req.body;
    try {
      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
      // Check if cart item already exists
      let cartItem = await CartItem.findOne({ user: req.user._id, product: productId });
      if (cartItem) {
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        cartItem = await CartItem.create({ user: req.user._id, product: productId, quantity });
      }
      res.status(201).json(cartItem);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @route   PUT /api/cart/:id
 * @desc    Update the quantity of a cart item
 * @access  Private
 */
router.put(
  '/:id',
  authMiddleware,
  [body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { quantity } = req.body;
    try {
      // Find cart item for this user and product
      const cartItem = await CartItem.findOne({ user: req.user._id, product: req.params.id });
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
      // Ensure product exists and has enough stock
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
      cartItem.quantity = quantity;
      await cartItem.save();
      res.json(cartItem);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @route   DELETE /api/cart/:id
 * @desc    Remove a product from the cart
 * @access  Private
 */
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const cartItem = await CartItem.findOneAndDelete({ user: req.user._id, product: req.params.id });
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;