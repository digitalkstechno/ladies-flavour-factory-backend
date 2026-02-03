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
router.get('/', protect, checkPermission('view_roles'), getRoles);
router.post('/', protect, checkPermission('create_role'), createRole);

router.put('/:id', protect, checkPermission('edit_role'), updateRole);
router.delete('/:id', protect, checkPermission('delete_role'), deleteRole);

module.exports = router;
