const { getPool } = require('../config/db');

async function getAllServices() {
    const pool = getPool();
    const result = await pool.query(
        `SELECT service_id AS id, service_key AS key, title,
                short_description AS "shortDescription",
                full_description  AS "fullDescription",
                icon
         FROM services
         ORDER BY service_id`
    );
    return result.rows;
}

async function getServiceById(id) {
    const pool = getPool();
    const isNumeric = /^\d+$/.test(String(id));
    const query = isNumeric
        ? `SELECT service_id AS id, service_key AS key, title,
                  short_description AS "shortDescription",
                  full_description  AS "fullDescription",
                  icon
           FROM services WHERE service_id = $1`
        : `SELECT service_id AS id, service_key AS key, title,
                  short_description AS "shortDescription",
                  full_description  AS "fullDescription",
                  icon
           FROM services WHERE service_key = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
}

module.exports = { getAllServices, getServiceById };
