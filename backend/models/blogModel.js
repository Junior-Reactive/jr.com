const { getPool } = require('../config/db');

async function getAllPosts() {
    const pool = getPool();
    const result = await pool.request()
        .query('SELECT PostID, Slug, Title, Excerpt, Author, PublishDate FROM BlogPosts ORDER BY PublishDate DESC');
    return result.recordset;
}

async function getPostBySlug(slug) {
    const pool = getPool();
    const result = await pool.request()
        .input('slug', slug)
        .query('SELECT * FROM BlogPosts WHERE Slug = @slug');
    return result.recordset[0];
}

module.exports = { getAllPosts, getPostBySlug };