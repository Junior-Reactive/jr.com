const { getPool, sql } = require('../config/db');

async function getAllServices() {
    const pool = getPool();
    const result = await pool.request()
        .query(`
            SELECT 
                ServiceID as id,
                ServiceKey as [key],
                Title as title,
                ShortDescription as shortDescription,
                Icon as icon
            FROM Services 
            ORDER BY ServiceID
        `);
    return result.recordset;
}

async function getServiceById(id) {
    const pool = getPool();
    const result = await pool.request()
        .input('id', sql.NVarChar, String(id))
        .query(`
            SELECT 
                ServiceID as id,
                ServiceKey as [key],
                Title as title,
                ShortDescription as shortDescription,
                FullDescription as fullDescription,
                Icon as icon
            FROM Services 
            WHERE ServiceKey = @id OR CAST(ServiceID AS NVARCHAR) = @id
        `);
    return result.recordset[0] || null;
}

module.exports = { getAllServices, getServiceById };
