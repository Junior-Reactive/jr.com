const { getPool, sql } = require('../config/db');

async function getAllPosts() {
    const pool = getPool();
    const result = await pool.request()
        .query(`
            SELECT 
                PostID as id,
                Slug as slug,
                Title as title,
                Excerpt as excerpt,
                Author as author,
                PublishDate as publishDate,
                FORMAT(PublishDate, 'MMMM dd, yyyy') as formattedDate
            FROM BlogPosts 
            ORDER BY PublishDate DESC
        `);
    return result.recordset;
}

async function getPostBySlug(slug) {
    const pool = getPool();
    const result = await pool.request()
        .input('slug', sql.NVarChar, slug)
        .query(`
            SELECT 
                PostID as id,
                Slug as slug,
                Title as title,
                Excerpt as excerpt,
                Content as content,
                Author as author,
                PublishDate as publishDate,
                FORMAT(PublishDate, 'MMMM dd, yyyy') as formattedDate
            FROM BlogPosts 
            WHERE Slug = @slug
        `);
    return result.recordset[0] || null;
}

module.exports = { getAllPosts, getPostBySlug };
