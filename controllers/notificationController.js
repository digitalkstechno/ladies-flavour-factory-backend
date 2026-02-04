const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationModel');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({}).sort({ createdAt: -1 }).lean();
  res.json(notifications);
});

// @desc    Create a notification
// @route   POST /api/notifications
// @access  Private (Internal use mainly)
const createNotification = asyncHandler(async (req, res) => {
  const { title, message, type } = req.body;

  const notification = await Notification.create({
    title,
    message,
    type,
  });

  if (notification) {
    res.status(201).json(notification);
  } else {
    res.status(400);
    throw new Error('Invalid notification data');
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    notification.read = true;
    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({}, { read: true });
  res.json({ message: 'All notifications marked as read' });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    await notification.deleteOne();
    res.json({ message: 'Notification removed' });
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
});

// @desc    Clear all notifications
// @route   DELETE /api/notifications
// @access  Private
const clearAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({});
  res.json({ message: 'All notifications cleared' });
});

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
};
