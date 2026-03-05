const { getPool } = require('../config/db');

async function getAllTeamMembers() {
    const pool = getPool();
    const result = await pool.query(
        `SELECT member_id AS id, name, position, bio,
                image_filename AS image
         FROM team_members
         ORDER BY display_order`
    );
    return result.rows;
}

module.exports = { getAllTeamMembers };
