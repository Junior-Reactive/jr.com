const { getPool } = require('../config/db');

async function getAllMembers() {
    const pool = getPool();
    const result = await pool.request()
        .query(`
            SELECT 
                MemberID as id,
                Name as name,
                Position as position,
                Bio as bio,
                ImageFileName as image
            FROM TeamMembers 
            ORDER BY DisplayOrder
        `);
    return result.recordset;
}

module.exports = { getAllMembers };
