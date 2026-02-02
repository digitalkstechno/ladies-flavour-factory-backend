const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, checkPermission } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, checkPermission('view_products'), getProducts)
  .post(protect, checkPermission('create_product'), createProduct);
router
  .route('/:id')
  .get(protect, checkPermission('view_products'), getProductById)
  .put(protect, checkPermission('edit_product'), updateProduct)
  .delete(protect, checkPermission('delete_product'), deleteProduct);

module.exports = router;
