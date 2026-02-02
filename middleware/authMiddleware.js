const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Role = require('../models/roleModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id)
        .select('-password')
        .populate('role');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Middleware to check for specific permission
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (req.user && req.user.role && req.user.role.permissions.includes(requiredPermission)) {
      next();
    } else {
      res.status(403);
      throw new Error('Not authorized, missing permission: ' + requiredPermission);
    }
  };
};

// Legacy admin middleware (optional, but good for backward compatibility if needed temporarily)
// Better to replace with checkPermission('manage_users') or similar
const admin = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.name === 'Admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, checkPermission, admin };
