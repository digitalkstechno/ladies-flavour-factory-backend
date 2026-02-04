const asyncHandler = require('express-async-handler');
const Role = require('../models/roleModel');

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private/Admin
const getRoles = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || '';

  const query = {};

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const [count, roles] = await Promise.all([
    Role.countDocuments({ ...query }),
    Role.find({ ...query })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1))
      .lean(),
  ]);

  res.json({
    roles,
    page,
    pages: Math.ceil(count / limit),
    total: count
  });
});

// @desc    Create a new role
// @route   POST /api/roles
// @access  Private/Admin
const createRole = asyncHandler(async (req, res) => {
  const { name, permissions, description } = req.body;

  const roleExists = await Role.findOne({ name });

  if (roleExists) {
    res.status(400);
    throw new Error('Role already exists');
  }

  const role = await Role.create({
    name,
    permissions,
    description,
  });

  if (role) {
    res.status(201).json(role);
  } else {
    res.status(400);
    throw new Error('Invalid role data');
  }
});

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private/Admin
const updateRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (role) {
    role.name = req.body.name || role.name;
    role.permissions = req.body.permissions || role.permissions;
    role.description = req.body.description || role.description;

    const updatedRole = await role.save();
    res.json(updatedRole);
  } else {
    res.status(404);
    throw new Error('Role not found');
  }
});

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Private/Admin
const deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (role) {
    await role.deleteOne();
    res.json({ message: 'Role removed' });
  } else {
    res.status(404);
    throw new Error('Role not found');
  }
});

module.exports = {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
};
