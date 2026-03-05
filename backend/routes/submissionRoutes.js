const express = require('express');
const router = express.Router();
const { submitContact, submitApplication } = require('../controllers/submissionController');
const { validateContact, validateApplication } = require('../middleware/validation');

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit a contact form
 *     description: |
 *       Submits a contact form message. On success:
 *       - Message is saved to the database
 *       - Email notification is sent to juniorreactive@gmail.com
 *
 *       **Rate limit:** 20 submissions per hour per IP.
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactSubmission'
 *           example:
 *             name: Jane Doe
 *             email: jane@company.com
 *             subject: Partnership Inquiry
 *             message: Hello, I would like to discuss a potential AI consulting project for our company.
 *     responses:
 *       201:
 *         description: Contact form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubmitResponse'
 *             example:
 *               success: true
 *               message: "Your message has been received. We'll be in touch soon!"
 *               id: 1
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/contact', validateContact, submitContact);

/**
 * @swagger
 * /api/apply:
 *   post:
 *     summary: Submit a service application
 *     description: |
 *       Submits a service application. On success:
 *       - Application is saved to the database
 *       - Email notification is sent to juniorreactive@gmail.com
 *
 *       **Rate limit:** 20 submissions per hour per IP.
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationSubmission'
 *           example:
 *             company: Acme Ltd
 *             name: John Smith
 *             email: john@acme.com
 *             phone: "+256 764 524 816"
 *             service_type: N8N Workflow Automation
 *             requirements: We need to automate our invoice processing and CRM sync workflows. Currently this takes 3 hours per day manually.
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubmitResponse'
 *             example:
 *               success: true
 *               message: Application submitted successfully! Our team will review and contact you.
 *               id: 1
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/apply', validateApplication, submitApplication);

module.exports = router;
