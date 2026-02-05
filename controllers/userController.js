const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Role = require('../models/roleModel');

// @desc    Auth user & get token

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate('role');

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // Returns the full role object with permissions
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // If role is not provided, try to find a default role or fail
  let roleId = role;
  if (!roleId) {
     const defaultRole = await Role.findOne({ name: 'Stock Manager' }); // Default fallback
     if (defaultRole) roleId = defaultRole._id;
  }
  
  if (!roleId) {
      res.status(400);
      throw new Error('Role is required');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: roleId,
  });

  if (user) {
    // Populate role before sending response
    const populatedUser = await User.findById(user._id).populate('role');
    
    res.status(201).json({
      _id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      role: populatedUser.role,
      token: generateToken(populatedUser._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get all users

const getUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || '';

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [count, users] = await Promise.all([
    User.countDocuments({ ...query }),
    User.find({ ...query })
      .populate('role')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1))
      .lean(),
  ]);

  res.json({
    users,
    page,
    pages: Math.ceil(count / limit),
    total: count
  });
});

// @desc    Delete user

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user


const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    if (req.body.role) {
        user.role = req.body.role;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const populatedUser = await User.findById(updatedUser._id).populate('role');

    res.json({
      _id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      role: populatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile


const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const populatedUser = await User.findById(updatedUser._id).populate('role');

    res.json({
      _id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      role: populatedUser.role,
      token: generateToken(populatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  authUser,
  registerUser,
  getUsers,
  deleteUser,
  updateUser,
  updateUserProfile,
};
