const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Role = require('../models/roleModel');

// Define all available permissions - this should match frontend
const ALL_PERMISSIONS = [
  'view_dashboard',
  // User Management
  'view_users',
  'create_user',
  'edit_user',
  'delete_user',
  // Role Management
  'view_roles',
  'create_role',
  'edit_role',
  'delete_role',
  // Product Management
  'view_products',
  'create_product',
  'edit_product',
  'delete_product',
  // Stock Management
  'manage_stock',
  // Reports
  'view_reports',
  // Category Management
  'view_categories',
  'manage_categories',
  // Barcodes
  'view_barcodes',
];

// @desc    Seed admin user and role
// @route   POST /api/seeder/admin
// @access  Public (should be protected or removed in production)
const seedAdmin = asyncHandler(async (req, res) => {
  // 1. Create or Update Admin Role
  let adminRole = await Role.findOne({ name: 'Admin' });

  if (adminRole) {
    // Update existing Admin role with all permissions
    adminRole.permissions = ALL_PERMISSIONS;
    await adminRole.save();
    console.log('Admin role updated with all permissions');
  } else {
    // Create new Admin role
    adminRole = await Role.create({
      name: 'Admin',
      description: 'Super Administrator with full access',
      permissions: ALL_PERMISSIONS,
    });
    console.log('Admin role created');
  }

  // 2. Create or Update Admin User
  const adminEmail = req.body.email ;
  const adminPassword = req.body.password; // Default password if not provided
  const adminName = req.body.name;

  let adminUser = await User.findOne({ email: adminEmail });

  if (adminUser) {
    // Update existing admin user's role
    adminUser.role = adminRole._id;
    adminUser.name = adminName;
    // Update password if it was provided in the request or if we want to enforce the default
    if (req.body.password) {
        adminUser.password = req.body.password;
    }
    await adminUser.save();
    console.log('Admin user updated');
  } else {
    // Create new admin user
    adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: adminRole._id,
    });
    console.log('Admin user created');
  }

  res.status(200).json({
    message: 'Admin seeding completed successfully',
    role: adminRole,
    user: {
      name: adminUser.name,
      email: adminUser.email,
      role: adminRole.name
    }
  });
});

module.exports = { seedAdmin };
