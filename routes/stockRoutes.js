const express = require('express');
const router = express.Router();
const {
  getStockTransactions,
  addStockTransaction,
} = require('../controllers/stockController');
const { protect, checkPermission } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, checkPermission('manage_stock'), getStockTransactions)
  .post(protect, checkPermission('manage_stock'), addStockTransaction);

module.exports = router;
