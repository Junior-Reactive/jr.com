const { getPool } = require('../config/db');

async function getAllBlogPosts() {
    const pool = getPool();
    const result = await pool.query(
        `SELECT post_id AS id, slug, title, excerpt, author,
                publish_date AS "publishDate",
                TO_CHAR(publish_date, 'Month DD, YYYY') AS "formattedDate"
         FROM blog_posts
         ORDER BY publish_date DESC`
    );
    return result.rows;
}

async function getBlogPostBySlug(slug) {
    const pool = getPool();
    const result = await pool.query(
        `SELECT post_id AS id, slug, title, excerpt, content, author,
                publish_date AS "publishDate",
                TO_CHAR(publish_date, 'Month DD, YYYY') AS "formattedDate"
         FROM blog_posts WHERE slug = $1`,
        [slug]
    );
    return result.rows[0] || null;
}

module.exports = { getAllBlogPosts, getBlogPostBySlug };
