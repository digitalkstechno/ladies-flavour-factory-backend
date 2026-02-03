const express = require('express');
const router = express.Router();
const { seedAdmin } = require('../controllers/seederController');

router.post('/admin', seedAdmin);

module.exports = router;
