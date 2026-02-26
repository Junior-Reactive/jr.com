const contactModel = require('../models/contactModel');
const applicationModel = require('../models/applicationModel');

async function submitContact(req, res, next) {
    try {
        const submissionId = await contactModel.createContactSubmission(req.body);
        res.status(201).json({ 
            success: true, 
            message: 'Contact form submitted successfully',
            id: submissionId 
        });
    } catch (err) {
        next(err);
    }
}

async function submitApplication(req, res, next) {
    try {
        const submissionId = await applicationModel.createApplicationSubmission(req.body);
        res.status(201).json({ 
            success: true, 
            message: 'Application submitted successfully',
            id: submissionId 
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { submitContact, submitApplication };