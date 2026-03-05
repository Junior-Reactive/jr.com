const contactModel = require('../models/contactModel');
const applicationModel = require('../models/applicationModel');
const { sendContactNotification, sendApplicationNotification } = require('../utils/email');

async function submitContact(req, res, next) {
    try {
        const submissionId = await contactModel.createContactSubmission(req.body);

        // Fire-and-forget email — don't block the response if email fails
        sendContactNotification(req.body).catch((err) =>
            console.warn('⚠️  Email notification failed (contact):', err.message)
        );

        res.status(201).json({
            success: true,
            message: 'Your message has been received. We\'ll be in touch soon!',
            id: submissionId,
        });
    } catch (err) {
        next(err);
    }
}

async function submitApplication(req, res, next) {
    try {
        const submissionId = await applicationModel.createApplicationSubmission(req.body);

        // Fire-and-forget email
        sendApplicationNotification(req.body).catch((err) =>
            console.warn('⚠️  Email notification failed (application):', err.message)
        );

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully! Our team will review and contact you.',
            id: submissionId,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { submitContact, submitApplication };
