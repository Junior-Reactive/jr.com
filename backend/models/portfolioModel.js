const { getPool } = require('../config/db');
const cache = require('../utils/cache');

const PORTFOLIO_CACHE_KEY = 'all_portfolio_projects';
const PORTFOLIO_CACHE_TTL = 3600; // 1 hour

async function getAllProjects() {
    const cached = cache.get(PORTFOLIO_CACHE_KEY);
    if (cached) return cached;

    const pool = getPool();
    const result = await pool.query(
        `SELECT project_id AS id, slug, title, category,
                description, image_filename AS image
         FROM portfolio_projects
         ORDER BY project_id`
    );

    cache.set(PORTFOLIO_CACHE_KEY, result.rows, PORTFOLIO_CACHE_TTL);
    return result.rows;
}

module.exports = { getAllProjects };
