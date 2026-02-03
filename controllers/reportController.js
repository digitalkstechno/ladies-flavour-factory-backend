const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const Catalog = require('../models/catalogModel');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit-table');

// @desc    Get inventory report with pagination and search
// @route   GET /api/reports/inventory
// @access  Private
const getInventoryReport = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || '';

  let query = {};

  if (search) {
    const searchRegex = { $regex: search, $options: 'i' };
    
    // Find matching catalogs first
    const matchingCatalogs = await Catalog.find({ name: searchRegex }).select('_id');
    const catalogIds = matchingCatalogs.map(c => c._id);

    query = {
      $or: [
        { name: searchRegex },
        { sku: searchRegex },
        { catalog: { $in: catalogIds } }
      ]
    };
  }

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('catalog', 'name')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1));

  res.json({
    products,
    page,
    pages: Math.ceil(count / limit),
    total: count
  });
});

// @desc    Export inventory to Excel
// @route   GET /api/reports/inventory/excel
// @access  Private
const exportInventoryExcel = asyncHandler(async (req, res) => {
  const search = req.query.search || '';
  let query = {};

  if (search) {
    const searchRegex = { $regex: search, $options: 'i' };
    const matchingCatalogs = await Catalog.find({ name: searchRegex }).select('_id');
    const catalogIds = matchingCatalogs.map(c => c._id);
    query = {
      $or: [
        { name: searchRegex },
        { sku: searchRegex },
        { catalog: { $in: catalogIds } }
      ]
    };
  }

  const products = await Product.find(query).populate('catalog', 'name').sort({ createdAt: -1 });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Inventory');

  worksheet.columns = [
    { header: 'Catalog', key: 'catalog', width: 20 },
    { header: 'Product Name', key: 'name', width: 30 },
    { header: 'SKU', key: 'sku', width: 20 },
    { header: 'Stock', key: 'stock', width: 10 },
  ];

  products.forEach(product => {
    worksheet.addRow({
      catalog: product.catalog?.name || '-',
      name: product.name,
      sku: product.sku,
      stock: product.stockQuantity,
    });
  });

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=' + 'inventory_report.xlsx'
  );

  await workbook.xlsx.write(res);
  res.end();
});

// @desc    Export inventory to PDF
// @route   GET /api/reports/inventory/pdf
// @access  Private
const exportInventoryPDF = asyncHandler(async (req, res) => {
  const search = req.query.search || '';
  let query = {};

  if (search) {
    const searchRegex = { $regex: search, $options: 'i' };
    const matchingCatalogs = await Catalog.find({ name: searchRegex }).select('_id');
    const catalogIds = matchingCatalogs.map(c => c._id);
    query = {
      $or: [
        { name: searchRegex },
        { sku: searchRegex },
        { catalog: { $in: catalogIds } }
      ]
    };
  }

  const products = await Product.find(query).populate('catalog', 'name').sort({ createdAt: -1 });

  const doc = new PDFDocument({ margin: 30, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=inventory_report.pdf');

  doc.pipe(res);

  doc.fontSize(18).text('Inventory Report', { align: 'center' });
  doc.moveDown();

  const table = {
    title: "",
    headers: ["Catalog", "Product Name", "SKU", "Stock"],
    rows: products.map(p => [
      p.catalog?.name || '-',
      p.name,
      p.sku,
      p.stockQuantity,
    ]),
  };

  await doc.table(table, {
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
    prepareRow: (row, i, isOdd, isLastRow) => doc.font("Helvetica").fontSize(10),
  });

  doc.end();
});

module.exports = {
  getInventoryReport,
  exportInventoryExcel,
  exportInventoryPDF,
};
