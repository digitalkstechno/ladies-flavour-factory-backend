const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, checkPermission } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, checkPermission('view_categories'), getCategories)
  .post(protect, checkPermission('manage_categories'), createCategory);
router
  .route('/:id')
  .put(protect, checkPermission('manage_categories'), updateCategory)
  .delete(protect, checkPermission('manage_categories'), deleteCategory);

module.exports = router;
