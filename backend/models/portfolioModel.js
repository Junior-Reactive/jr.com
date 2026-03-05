const { getPool } = require('../config/db');

async function getAllProjects() {
    const pool = getPool();
    const result = await pool.request()
        .query(`
            SELECT 
                ProjectID as id,
                Slug as slug,
                Title as title,
                Category as category,
                Description as description,
                ImageFileName as image
            FROM PortfolioProjects 
            ORDER BY ProjectID
        `);
    return result.recordset;
}

module.exports = { getAllProjects };
