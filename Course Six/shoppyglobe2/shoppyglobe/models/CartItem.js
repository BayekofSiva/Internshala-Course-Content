const mongoose = require('mongoose');

/**
 * CartItem model
 * Represents an item in a user's shopping cart.  
 * Fields:
 *  - user: Reference to the User document that owns this cart item.
 *  - product: Reference to the Product being added to the cart.
 *  - quantity: Number of units of this product in the cart.
 */
const cartItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CartItem', cartItemSchema);