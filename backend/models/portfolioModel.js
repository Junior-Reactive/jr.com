const { getPool } = require('../config/db');

async function getAllProjects() {
    const pool = getPool();
    const result = await pool.request()
        .query('SELECT ProjectID, Slug, Title, Category, Description, ImageFileName FROM PortfolioProjects ORDER BY ProjectID');
    return result.recordset;
}

module.exports = { getAllProjects };