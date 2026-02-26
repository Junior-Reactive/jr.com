const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

router.get('/services', contentController.getServices);
router.get('/services/:id', contentController.getServiceById);
// Add more routes for blog, portfolio etc.

module.exports = router;