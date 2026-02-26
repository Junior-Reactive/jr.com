const { getPool } = require('../config/db');

async function createApplicationSubmission(data) {
    const pool = getPool();
    const result = await pool.request()
        .input('company', data.company)
        .input('name', data.name)
        .input('email', data.email)
        .input('phone', data.phone)
        .input('service_type', data.service_type)
        .input('requirements', data.requirements)
        .query(`
            INSERT INTO ServiceApplications (Company, ContactPerson, Email, Phone, ServiceType, Requirements)
            OUTPUT INSERTED.ApplicationID AS id
            VALUES (@company, @name, @email, @phone, @service_type, @requirements);
        `);
    return result.recordset[0].id;
}

module.exports = { createApplicationSubmission };