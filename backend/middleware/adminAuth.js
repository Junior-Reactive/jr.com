const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'jr-admin-fallback-secret-change-this';
const INACTIVITY_TIMEOUT = 30 * 60; // 30 minutes in seconds
const ABSOLUTE_SESSION_MAX = 8 * 60 * 60; // 8 hours in seconds

/**
 * Middleware: verify admin JWT from httpOnly cookie.
 * Validates: JWT signature, expiration, inactivity timeout, absolute session max
 * Attaches decoded payload to req.admin on success.
 */
function adminAuth(req, res, next) {
    const token = req.cookies?.adminToken;

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authenticated.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const now = Math.floor(Date.now() / 1000);

        // Check inactivity timeout (30 minutes since last activity)
        // Using 'iat' claim as proxy for last activity (could be enhanced with request logging)
        const lastActivity = decoded.iat || decoded.sessionStart || 0;
        const inactivitySeconds = now - lastActivity;
        if (inactivitySeconds > INACTIVITY_TIMEOUT) {
            res.clearCookie('adminToken', { path: '/' });
            return res.status(401).json({
                success: false,
                error: 'Session expired due to inactivity. Please log in again.'
            });
        }

        // Check absolute session maximum (8 hours from session start)
        const sessionStart = decoded.sessionStart || decoded.iat || now;
        const sessionAgeSeconds = now - sessionStart;
        if (sessionAgeSeconds > ABSOLUTE_SESSION_MAX) {
            res.clearCookie('adminToken', { path: '/' });
            return res.status(401).json({
                success: false,
                error: 'Session expired. Please log in again.'
            });
        }

        // Attach decoded token to request for later use
        req.admin = decoded;
        req.adminSessionAge = sessionAgeSeconds;

        next();
    } catch (err) {
        // Token verification failed (invalid signature, malformed, etc.)
        res.clearCookie('adminToken', { path: '/' });
        return res.status(401).json({
            success: false,
            error: 'Session expired. Please log in again.'
        });
    }
}

/**
 * Generate CSRF token for POST/PUT/DELETE requests
 * Tokens are session-bound (include session start timestamp)
 */
function generateCSRFToken(sessionStart) {
    const token = crypto.randomBytes(32).toString('hex');
    const payload = `${token}:${sessionStart}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Validate CSRF token from request headers
 */
function validateCSRFToken(req, storedToken) {
    const headerToken = req.headers['x-csrf-token'] || req.body._csrf;
    return headerToken && headerToken === storedToken;
}

/**
 * Middleware: CSRF protection for state-changing requests
 * Should be applied to POST, PUT, PATCH, DELETE routes
 */
function csrfProtection(req, res, next) {
    // Only protect state-changing methods
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        return next();
    }

    // CSRF token should have been generated and stored by the admin panel frontend
    const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;
    if (!csrfToken) {
        return res.status(403).json({
            success: false,
            error: 'CSRF token missing. Request rejected.'
        });
    }

    // In a full implementation, verify the token matches what was issued for this session
    // For now, just verify it exists and has the right format (64 hex chars from sha256)
    if (!/^[a-f0-9]{64}$/.test(csrfToken)) {
        return res.status(403).json({
            success: false,
            error: 'Invalid CSRF token. Request rejected.'
        });
    }

    next();
}

module.exports = {
    adminAuth,
    csrfProtection,
    generateCSRFToken,
    validateCSRFToken,
    JWT_SECRET,
    INACTIVITY_TIMEOUT,
    ABSOLUTE_SESSION_MAX,
};
