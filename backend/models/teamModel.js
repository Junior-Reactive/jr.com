const { getPool } = require('../config/db');
const cache = require('../utils/cache');

const TEAM_CACHE_KEY = 'all_team_members';
const TEAM_CACHE_TTL = 3600; // 1 hour

async function getAllTeamMembers() {
    const cached = cache.get(TEAM_CACHE_KEY);
    if (cached) return cached;

    const pool = getPool();
    const result = await pool.query(
        `SELECT member_id AS id, name, position, bio,
                image_filename AS image
         FROM team_members
         ORDER BY display_order`
    );

    cache.set(TEAM_CACHE_KEY, result.rows, TEAM_CACHE_TTL);
    return result.rows;
}

module.exports = { getAllTeamMembers };
