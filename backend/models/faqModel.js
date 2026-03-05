const { getPool } = require('../config/db');

async function getAllFAQs() {
    const pool = getPool();
    const result = await pool.query(
        `SELECT faq_id AS id, question, answer
         FROM faqs
         ORDER BY display_order`
    );
    return result.rows;
}

module.exports = { getAllFAQs };
