const asyncHandler = require('express-async-handler');
const Catalog = require('../models/catalogModel');

// @desc    Get all catalogs
// @route   GET /api/catalogs
// @access  Private
const getCatalogs = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || '';
  
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
    ];
  }

  const [count, catalogs] = await Promise.all([
    Catalog.countDocuments({ ...query }),
    Catalog.find({ ...query })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1))
      .lean(),
  ]);

  res.json({
    catalogs,
    page,
    pages: Math.ceil(count / limit),
    total: count
  });
});

// @desc    Create a catalog
// @route   POST /api/catalogs
// @access  Private/Admin
const createCatalog = asyncHandler(async (req, res) => {
  const { name, code } = req.body;

  const catalogExists = await Catalog.findOne({ code });

  if (catalogExists) {
    res.status(400);
    throw new Error('Catalog code already exists');
  }

  const catalog = await Catalog.create({
    name,
    code,
  });

  if (catalog) {
    res.status(201).json(catalog);
  } else {
    res.status(400);
    throw new Error('Invalid catalog data');
  }
});

// @desc    Update a catalog
// @route   PUT /api/catalogs/:id
// @access  Private/Admin
const updateCatalog = asyncHandler(async (req, res) => {
  const { name, code } = req.body;

  const catalog = await Catalog.findById(req.params.id);

  if (catalog) {
    catalog.name = name || catalog.name;
    catalog.code = code || catalog.code;

    const updatedCatalog = await catalog.save();
    res.json(updatedCatalog);
  } else {
    res.status(404);
    throw new Error('Catalog not found');
  }
});

// @desc    Delete a catalog
// @route   DELETE /api/catalogs/:id
// @access  Private/Admin
const deleteCatalog = asyncHandler(async (req, res) => {
  const catalog = await Catalog.findById(req.params.id);

  if (catalog) {
    await catalog.deleteOne();
    res.json({ message: 'Catalog removed' });
  } else {
    res.status(404);
    throw new Error('Catalog not found');
  }
});

module.exports = {
  getCatalogs,
  createCatalog,
  updateCatalog,
  deleteCatalog,
};
