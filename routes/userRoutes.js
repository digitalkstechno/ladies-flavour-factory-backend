const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUsers,
  deleteUser,
  updateUser,
  updateUserProfile,
} = require('../controllers/userController');
const { protect, checkPermission } = require('../middleware/authMiddleware');

router.post('/login', authUser);
router.put('/profile', protect, updateUserProfile);

router.post('/', protect, checkPermission('create_user'), registerUser);
router.get('/', protect, checkPermission('view_users'), getUsers);

router.delete('/:id', protect, checkPermission('delete_user'), deleteUser);
router.put('/:id', protect, checkPermission('edit_user'), updateUser);

module.exports = router;
