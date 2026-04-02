const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'jr-admin-fallback-secret-change-this';

/**
 * Middleware: verify admin JWT from httpOnly cookie.
 * Attaches decoded payload to req.admin on success.
 */
function adminAuth(req, res, next) {
    const token = req.cookies?.adminToken;

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authenticated.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Session expired. Please log in again.' });
    }
}

module.exports = { adminAuth, JWT_SECRET };
