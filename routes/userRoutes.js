const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUsers,
  deleteUser,
  updateUser,
} = require('../controllers/userController');
const { protect, checkPermission } = require('../middleware/authMiddleware');

router.post('/login', authUser);
router
  .route('/')
  .post( registerUser)
  .get(protect, checkPermission('manage_users'), getUsers);
router
  .route('/:id')
  .delete(protect, checkPermission('manage_users'), deleteUser)
  .put(protect, checkPermission('manage_users'), updateUser);

module.exports = router;
