const express = require('express');
const router  = express.Router();
const { recordPageView } = require('../models/adminModel');

/**
 * POST /api/analytics/track
 * Called by the frontend on every route change.
 * Body: { path, sessionId, referrer }
 */
router.post('/track', async (req, res) => {
    try {
        const { path, sessionId, referrer } = req.body;
        if (!path) return res.status(400).json({ success: false });

        // Detect device type from User-Agent
        const ua = req.headers['user-agent'] || '';
        let device_type = 'desktop';
        if (/mobile/i.test(ua))  device_type = 'mobile';
        else if (/tablet|ipad/i.test(ua)) device_type = 'tablet';

        await recordPageView({
            page_path:   path.slice(0, 500),
            session_id:  sessionId || null,
            referrer:    referrer  || null,
            device_type,
        });

        res.json({ success: true });
    } catch (err) {
        // Non-critical — don't expose errors
        res.json({ success: false });
    }
});

module.exports = router;
