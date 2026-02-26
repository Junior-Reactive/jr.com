const { body, validationResult } = require('express-validator');

// Contact form validation rules
const validateContact = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().normalizeEmail(),
    body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 200 }),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Application form validation rules
const validateApplication = [
    body('company').optional().trim().isLength({ max: 100 }),
    body('name').trim().notEmpty().withMessage('Contact person name is required').isLength({ max: 100 }),
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().normalizeEmail(),
    body('phone').optional().trim().isLength({ max: 50 }),
    body('service_type').trim().notEmpty().withMessage('Service type is required'),
    body('requirements').trim().notEmpty().withMessage('Requirements are required').isLength({ max: 10000 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateContact, validateApplication };