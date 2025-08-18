const mongoose = require('mongoose');

/**
 * Product model
 * Each product represents a tech item available for purchase.  
 * Fields:
 *  - name: The name/title of the product.
 *  - price: Price in your preferred currency.
 *  - description: A short description of the product.
 *  - stock: Quantity available in stock.
 *  - image: Optional URL of an image representing the product.
 */
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    stock: { type: Number, default: 0 },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);