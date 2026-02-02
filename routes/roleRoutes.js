const express = require('express');
const router = express.Router();
const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/roleController');
const { protect, checkPermission } = require('../middleware/authMiddleware');

// All role routes should be protected and require role management permissions
// For bootstrapping, we might need to allow initial creation, but for now we assume seed data
router.route('/')
  .get(protect, checkPermission('manage_roles'), getRoles)
  .post(protect, checkPermission('manage_roles'), createRole);
router
  .route('/:id')
  .put(protect, checkPermission('manage_roles'), updateRole)
  .delete(protect, checkPermission('manage_roles'), deleteRole);

module.exports = router;
