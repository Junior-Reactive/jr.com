const { getPool } = require('../config/db');

async function getAllFAQs() {
    const pool = getPool();
    const result = await pool.request()
        .query(`
            SELECT 
                FAQID as id,
                Question as question,
                Answer as answer
            FROM FAQs 
            ORDER BY DisplayOrder
        `);
    return result.recordset;
}

module.exports = { getAllFAQs };
