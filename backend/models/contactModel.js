const { getPool } = require('../config/db');

async function createContactSubmission(data) {
    const pool = getPool();
    const result = await pool.request()
        .input('name', data.name)
        .input('email', data.email)
        .input('subject', data.subject)
        .input('message', data.message)
        .query(`
            INSERT INTO ContactSubmissions (FullName, Email, Subject, Message)
            OUTPUT INSERTED.SubmissionID AS id
            VALUES (@name, @email, @subject, @message);
        `);
    return result.recordset[0].id;
}

module.exports = { createContactSubmission };