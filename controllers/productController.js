const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// @desc    Get all products

const getProducts = asyncHandler(async (req, res) => {
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

  if (req.query.catalog) {
    query.catalog = req.query.catalog;
  }

  const [count, products] = await Promise.all([
    Product.countDocuments({ ...query }),
    Product.find({ ...query })
      .populate('catalog', 'name')
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

// @desc    Get single product


const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('catalog', 'name')
    .lean();

  if (product) {
    // Add image property for compatibility with frontend if it expects singular image
    product.image = product.images && product.images.length > 0 ? product.images[0] : '';
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product


const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    catalog,
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
    catalog,
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


const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    catalog,
    description,
    unitPrice,
    costPrice,
    stockQuantity,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.sku = sku || product.sku;
    product.catalog = catalog || product.catalog;
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
