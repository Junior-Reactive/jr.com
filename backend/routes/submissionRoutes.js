const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { validateContact, validateApplication } = require('../middleware/validation');

router.post('/contact', validateContact, submissionController.submitContact);
router.post('/apply', validateApplication, submissionController.submitApplication);

module.exports = router;