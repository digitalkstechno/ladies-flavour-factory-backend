const express = require('express');
const router = express.Router();
const {
  getStockTransactions,
  addStockTransaction,
  handleQRScan,
} = require('../controllers/stockController');
const { protect, checkPermission } = require('../middleware/authMiddleware');

router.get('/', protect, checkPermission('manage_stock'), getStockTransactions);
router.post('/', protect, checkPermission('manage_stock'), addStockTransaction);
router.post('/scan', protect, checkPermission('manage_stock'), handleQRScan);

module.exports = router;
