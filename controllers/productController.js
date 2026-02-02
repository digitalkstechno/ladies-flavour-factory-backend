const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const query = {};

  if (req.query.keyword) {
    query.$or = [
      { name: { $regex: req.query.keyword, $options: 'i' } },
      { sku: { $regex: req.query.keyword, $options: 'i' } },
    ];
  }

  if (req.query.category) {
    query.category = req.query.category;
  }

  const count = await Product.countDocuments({ ...query });
  const products = await Product.find({ ...query })
    .populate('category', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'category',
    'name'
  );

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    category,
    description,
    unitPrice,
    costPrice,
    stockQuantity,
  } = req.body;

  let imagePath = '';
  if (req.file) {
    imagePath = req.file.path.replace(/\\/g, "/");
  }

  const product = new Product({
    name,
    sku,
    category,
    description,
    images: imagePath ? [imagePath] : [],
    unitPrice,
    costPrice,
    stockQuantity,
    user: req.user._id,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    category,
    description,
    unitPrice,
    costPrice,
    stockQuantity,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.sku = sku || product.sku;
    product.category = category || product.category;
    product.description = description || product.description;
    product.unitPrice = unitPrice || product.unitPrice;
    product.costPrice = costPrice || product.costPrice;
    product.stockQuantity = stockQuantity || product.stockQuantity;

    if (req.file) {
      const imagePath = req.file.path.replace(/\\/g, "/");
      product.images = [imagePath];
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
