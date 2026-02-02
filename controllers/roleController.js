const asyncHandler = require('express-async-handler');
const Role = require('../models/roleModel');

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private/Admin
const getRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find({});
  res.json(roles);
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
