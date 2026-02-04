const asyncHandler = require('express-async-handler');
const StockTransaction = require('../models/stockTransactionModel');
const Product = require('../models/productModel');

// @desc    Get all stock transactions
// @route   GET /api/stock
// @access  Private
const getStockTransactions = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || '';
  const type = req.query.type || '';
  const date = req.query.date || '';
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const query = {};

  if (type && type !== 'ALL') {
    query.type = type;
  }

  if (search) {
    const products = await Product.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');
    
    const productIds = products.map(p => p._id);
    query.product = { $in: productIds };
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    query.createdAt = { $gte: start, $lte: end };
  } else if (date === 'today') {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    query.createdAt = { $gte: start, $lte: end };
  }

  const [count, transactions] = await Promise.all([
    StockTransaction.countDocuments({ ...query }),
    StockTransaction.find({ ...query })
      .populate({
        path: 'product',
        select: 'name sku catalog',
        populate: {
          path: 'catalog',
          select: 'name'
        }
      })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1))
      .lean(),
  ]);

  res.json({
    transactions,
    page,
    pages: Math.ceil(count / limit),
    total: count
  });
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

// @desc    Handle QR Code Scan for Stock
// @route   POST /api/stock/scan
// @access  Private
const handleQRScan = asyncHandler(async (req, res) => {
  const { sku, type } = req.body;
  
  // Logic: Both IN and OUT are strictly 1
  const quantity = 1;

  // Find product by SKU
  const product = await Product.findOne({ sku });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (!['IN', 'OUT'].includes(type)) {
    res.status(400);
    throw new Error('Invalid transaction type. Must be IN or OUT');
  }

  // Check stock availability for OUT transactions
  if (type === 'OUT') {
    if (product.stockQuantity < 1) {
      res.status(400);
      throw new Error('Out of stock. Cannot process OUT transaction.');
    }
  }

  // Create stock transaction
  const transaction = await StockTransaction.create({
    product: product._id,
    user: req.user._id,
    type,
    quantity: quantity,
    reason: 'QR Scan',
  });

  // Update Product Stock
  if (type === 'IN') {
    product.stockQuantity += quantity;
  } else if (type === 'OUT') {
    product.stockQuantity -= quantity;
  }

  await product.save();

  res.status(201).json({
    message: 'Stock updated successfully',
    product: {
      _id: product._id,
      name: product.name,
      sku: product.sku,
      currentStock: product.stockQuantity
    },
    transaction
  });
});

module.exports = {
  getStockTransactions,
  addStockTransaction,
  handleQRScan,
};
