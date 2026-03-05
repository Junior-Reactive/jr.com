const { getPool } = require('../config/db');

async function getAllProjects() {
    const pool = getPool();
    const result = await pool.query(
        `SELECT project_id AS id, slug, title, category,
                description, image_filename AS image
         FROM portfolio_projects
         ORDER BY project_id`
    );
    return result.rows;
}

module.exports = { getAllProjects };
