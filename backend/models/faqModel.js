const { getPool } = require('../config/db');
const cache = require('../utils/cache');

const FAQ_CACHE_KEY = 'all_faqs';
const FAQ_CACHE_TTL = 3600; // 1 hour

async function getAllFAQs() {
    const cached = cache.get(FAQ_CACHE_KEY);
    if (cached) return cached;

    const pool = getPool();
    const result = await pool.query(
        `SELECT faq_id AS id, question, answer
         FROM faqs
         ORDER BY display_order`
    );

    cache.set(FAQ_CACHE_KEY, result.rows, FAQ_CACHE_TTL);
    return result.rows;
}

module.exports = { getAllFAQs };
