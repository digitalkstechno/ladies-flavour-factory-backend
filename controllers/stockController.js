const asyncHandler = require('express-async-handler');
const StockTransaction = require('../models/stockTransactionModel');
const Product = require('../models/productModel');

// @desc    Get all stock transactions
// @route   GET /api/stock
// @access  Private
const getStockTransactions = asyncHandler(async (req, res) => {
  const transactions = await StockTransaction.find({})
    .populate('product', 'name sku')
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(transactions);
});

// @desc    Add stock transaction (IN/OUT)
// @route   POST /api/stock
// @access  Private (Admin/Stock Manager)
const addStockTransaction = asyncHandler(async (req, res) => {
  const { productId, type, quantity, reason } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const transaction = await StockTransaction.create({
    product: productId,
    user: req.user._id,
    type,
    quantity: Number(quantity),
    reason,
  });

  // Update Product Stock
  if (type === 'IN') {
    product.stockQuantity += Number(quantity);
  } else if (type === 'OUT') {
    product.stockQuantity -= Number(quantity);
  } else if (type === 'ADJUSTMENT') {
    // For adjustment, we might want to set absolute value or just add/subtract
    // Assuming quantity can be negative for adjustment if reducing
    product.stockQuantity += Number(quantity);
  }

  await product.save();

  res.status(201).json(transaction);
});

module.exports = {
  getStockTransactions,
  addStockTransaction,
};
