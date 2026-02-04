const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    catalog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Catalog',
      required: true,
      index: true,
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    unitPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    costPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
