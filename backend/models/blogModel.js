const { getPool } = require('../config/db');
const cache = require('../utils/cache');

const BLOG_CACHE_KEY = 'all_blog_posts';
const BLOG_CACHE_TTL = 3600; // 1 hour

async function getAllBlogPosts() {
    const cached = cache.get(BLOG_CACHE_KEY);
    if (cached) return cached;

    const pool = getPool();
    const result = await pool.query(
        `SELECT post_id AS id, slug, title, excerpt, author,
                publish_date AS "publishDate",
                TO_CHAR(publish_date, 'Month DD, YYYY') AS "formattedDate"
         FROM blog_posts
         ORDER BY publish_date DESC`
    );

    cache.set(BLOG_CACHE_KEY, result.rows, BLOG_CACHE_TTL);
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
