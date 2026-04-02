const { getPool } = require('../config/db');

// ── Dashboard Stats ───────────────────────────────────────────────────────────
async function getDashboardStats() {
    const pool = getPool();

    const [messages, apps, views, services, unread, newApps] = await Promise.all([
        pool.query('SELECT COUNT(*) AS total FROM contact_submissions'),
        pool.query('SELECT COUNT(*) AS total FROM service_applications'),
        pool.query("SELECT COUNT(*) AS total FROM page_views WHERE created_at >= NOW() - INTERVAL '24 hours'"),
        pool.query('SELECT COUNT(*) AS total FROM services'),
        pool.query("SELECT COUNT(*) AS total FROM contact_submissions WHERE is_read = FALSE"),
        pool.query("SELECT COUNT(*) AS total FROM service_applications WHERE status = 'new'"),
    ]);

    // Messages today
    const msgToday = await pool.query(
        "SELECT COUNT(*) AS total FROM contact_submissions WHERE submitted_at >= CURRENT_DATE"
    );
    const appToday = await pool.query(
        "SELECT COUNT(*) AS total FROM service_applications WHERE submitted_at >= CURRENT_DATE"
    );

    return {
        messages:      { total: parseInt(messages.rows[0].total),  today: parseInt(msgToday.rows[0].total), unread: parseInt(unread.rows[0].total) },
        applications:  { total: parseInt(apps.rows[0].total),       today: parseInt(appToday.rows[0].total), new: parseInt(newApps.rows[0].total) },
        pageViewsToday: parseInt(views.rows[0].total),
        services:      parseInt(services.rows[0].total),
    };
}

// ── Page Views (last 7 days) ──────────────────────────────────────────────────
async function getPageViewsChart() {
    const pool = getPool();
    const result = await pool.query(`
        SELECT
            TO_CHAR(d.day, 'Mon DD') AS label,
            COALESCE(v.total, 0)      AS total
        FROM generate_series(
            CURRENT_DATE - INTERVAL '6 days',
            CURRENT_DATE,
            '1 day'
        ) AS d(day)
        LEFT JOIN (
            SELECT DATE(created_at) AS day, COUNT(*) AS total
            FROM page_views
            WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
            GROUP BY DATE(created_at)
        ) v ON v.day = d.day
        ORDER BY d.day
    `);
    return result.rows;
}

// ── Top Pages ─────────────────────────────────────────────────────────────────
async function getTopPages() {
    const pool = getPool();
    const result = await pool.query(`
        SELECT page_path, COUNT(*) AS total
        FROM page_views
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY page_path
        ORDER BY total DESC
        LIMIT 8
    `);
    return result.rows;
}

// ── Messages ──────────────────────────────────────────────────────────────────
async function getAllMessages({ limit = 50, offset = 0 } = {}) {
    const pool = getPool();
    const result = await pool.query(`
        SELECT submission_id AS id, name, email, subject, message,
               submitted_at, is_read, replied_at
        FROM contact_submissions
        ORDER BY submitted_at DESC
        LIMIT $1 OFFSET $2
    `, [limit, offset]);
    return result.rows;
}

async function getMessageById(id) {
    const pool = getPool();
    const result = await pool.query(
        `SELECT submission_id AS id, name, email, subject, message,
                submitted_at, is_read, replied_at
         FROM contact_submissions WHERE submission_id = $1`,
        [id]
    );
    return result.rows[0] || null;
}

async function markMessageRead(id) {
    const pool = getPool();
    await pool.query(
        'UPDATE contact_submissions SET is_read = TRUE WHERE submission_id = $1',
        [id]
    );
}

async function markMessageReplied(id) {
    const pool = getPool();
    await pool.query(
        'UPDATE contact_submissions SET replied_at = NOW(), is_read = TRUE WHERE submission_id = $1',
        [id]
    );
}

async function deleteMessage(id) {
    const pool = getPool();
    await pool.query('DELETE FROM contact_submissions WHERE submission_id = $1', [id]);
}

// ── Applications ──────────────────────────────────────────────────────────────
async function getAllApplications({ limit = 50, offset = 0 } = {}) {
    const pool = getPool();
    const result = await pool.query(`
        SELECT application_id AS id, company, name, email, phone,
               service_type, requirements, submitted_at, status
        FROM service_applications
        ORDER BY submitted_at DESC
        LIMIT $1 OFFSET $2
    `, [limit, offset]);
    return result.rows;
}

async function getApplicationById(id) {
    const pool = getPool();
    const result = await pool.query(
        `SELECT application_id AS id, company, name, email, phone,
                service_type, requirements, submitted_at, status
         FROM service_applications WHERE application_id = $1`,
        [id]
    );
    return result.rows[0] || null;
}

async function updateApplicationStatus(id, status) {
    const pool = getPool();
    await pool.query(
        'UPDATE service_applications SET status = $1 WHERE application_id = $2',
        [status, id]
    );
}

async function deleteApplication(id) {
    const pool = getPool();
    await pool.query('DELETE FROM service_applications WHERE application_id = $1', [id]);
}

// ── Services CRUD ─────────────────────────────────────────────────────────────
async function createService({ key, title, icon, shortDescription, fullDescription }) {
    const pool = getPool();
    const result = await pool.query(
        `INSERT INTO services (service_key, title, icon, short_description, full_description)
         VALUES ($1, $2, $3, $4, $5) RETURNING service_id AS id`,
        [key, title, icon, shortDescription, fullDescription]
    );
    return result.rows[0];
}

async function updateService(id, { title, icon, shortDescription, fullDescription }) {
    const pool = getPool();
    await pool.query(
        `UPDATE services SET title = $1, icon = $2, short_description = $3, full_description = $4
         WHERE service_id = $5`,
        [title, icon, shortDescription, fullDescription, id]
    );
}

async function deleteService(id) {
    const pool = getPool();
    await pool.query('DELETE FROM services WHERE service_id = $1', [id]);
}

// ── Analytics ─────────────────────────────────────────────────────────────────
async function recordPageView({ page_path, session_id, referrer, device_type }) {
    const pool = getPool();
    await pool.query(
        'INSERT INTO page_views (page_path, session_id, referrer, device_type) VALUES ($1, $2, $3, $4)',
        [page_path, session_id || null, referrer || null, device_type || 'desktop']
    );
}

async function getAnalyticsSummary() {
    const pool = getPool();
    const [total, today, week, chart, topPages] = await Promise.all([
        pool.query('SELECT COUNT(*) AS total FROM page_views'),
        pool.query("SELECT COUNT(*) AS total FROM page_views WHERE created_at >= CURRENT_DATE"),
        pool.query("SELECT COUNT(*) AS total FROM page_views WHERE created_at >= NOW() - INTERVAL '7 days'"),
        getPageViewsChart(),
        getTopPages(),
    ]);

    // Device breakdown
    const devices = await pool.query(`
        SELECT device_type, COUNT(*) AS total
        FROM page_views
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY device_type
    `);

    return {
        total:    parseInt(total.rows[0].total),
        today:    parseInt(today.rows[0].total),
        thisWeek: parseInt(week.rows[0].total),
        chart,
        topPages,
        devices:  devices.rows,
    };
}

// ── Admin log ─────────────────────────────────────────────────────────────────
async function logAdminAction(action, details) {
    try {
        const pool = getPool();
        await pool.query(
            'INSERT INTO admin_logs (action, details) VALUES ($1, $2)',
            [action, details]
        );
    } catch (_) { /* non-critical, swallow */ }
}

module.exports = {
    getDashboardStats,
    getPageViewsChart,
    getTopPages,
    getAllMessages,
    getMessageById,
    markMessageRead,
    markMessageReplied,
    deleteMessage,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication,
    createService,
    updateService,
    deleteService,
    recordPageView,
    getAnalyticsSummary,
    logAdminAction,
};
