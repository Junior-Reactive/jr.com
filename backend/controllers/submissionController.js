const { getPool } = require('../config/db');
const { sendContactNotification, sendApplicationNotification } = require('../utils/email');

async function submitContact(req, res, next) {
    try {
        const { name, email, subject, message } = req.body;
        const pool = getPool();
        const result = await pool.query(
            `INSERT INTO contact_submissions (name, email, subject, message, submitted_at)
             VALUES ($1, $2, $3, $4, NOW())
             RETURNING submission_id AS id`,
            [name, email, subject, message]
        );
        const id = result.rows[0].id;

        // Fire-and-forget notifications
        sendContactNotification({ name, email, subject, message }).catch(() => {});

        res.status(201).json({
            success: true,
            message: "Your message has been received. We'll be in touch soon!",
            id,
        });
    } catch (err) {
        next(err);
    }
}

async function submitApplication(req, res, next) {
    try {
        const { company, name, email, phone, service_type, requirements } = req.body;
        const pool = getPool();
        const result = await pool.query(
            `INSERT INTO service_applications
                (company, name, email, phone, service_type, requirements, submitted_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())
             RETURNING application_id AS id`,
            [company || null, name, email, phone || null, service_type, requirements]
        );
        const id = result.rows[0].id;

        sendApplicationNotification({ company, name, email, phone, service_type, requirements }).catch(() => {});

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully! Our team will review and contact you.',
            id,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { submitContact, submitApplication };
