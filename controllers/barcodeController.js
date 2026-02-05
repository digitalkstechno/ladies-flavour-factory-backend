const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// @desc    Get products for barcode generation

const getBarcodeProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || '';

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ];
  }

  // Select only necessary fields for barcodes
  const [count, products] = await Promise.all([
    Product.countDocuments({ ...query }),
    Product.find(query)
      .select('name sku unitPrice _id')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1))
      .lean(),
  ]);

  res.json({
    products,
    page,
    pages: Math.ceil(count / limit),
    total: count
  });
});

module.exports = {
  getBarcodeProducts,
};
