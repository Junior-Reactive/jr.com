const express  = require('express');
const rateLimit = require('express-rate-limit');
const router   = express.Router();
const ctrl     = require('../controllers/adminController');
const { adminAuth, csrfProtection } = require('../middleware/adminAuth');
const { deviceAuthorization } = require('../middleware/deviceAuthorization');

// ── Login rate limit: 10 attempts per 15 min ──────────────────────────────────
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, error: 'Too many login attempts. Try again in 15 minutes.' },
});

// ── Device Authorization (first check) ────────────────────────────────────────
// All admin routes require device/IP authorization before anything else

// ── Public routes (device authorized, but no JWT required) ────────────────────
router.post('/login',  deviceAuthorization, loginLimiter, ctrl.login);
router.post('/logout', deviceAuthorization, ctrl.logout);

// ── Protected routes (device authorized + valid JWT cookie) ──────────────────
router.get('/verify', deviceAuthorization, adminAuth, ctrl.verify);

// Dashboard
router.get('/dashboard', deviceAuthorization, adminAuth, ctrl.getDashboard);

// Messages
router.get('/messages',            deviceAuthorization, adminAuth, ctrl.getMessages);
router.get('/messages/:id',        deviceAuthorization, adminAuth, ctrl.getMessage);
router.post('/messages/:id/reply', deviceAuthorization, adminAuth, csrfProtection, ctrl.replyToMessage);
router.patch('/messages/:id/read', deviceAuthorization, adminAuth, csrfProtection, ctrl.markRead);
router.delete('/messages/:id',     deviceAuthorization, adminAuth, csrfProtection, ctrl.deleteMessage);

// Applications
router.get('/applications',               deviceAuthorization, adminAuth, ctrl.getApplications);
router.get('/applications/:id',           deviceAuthorization, adminAuth, ctrl.getApplication);
router.patch('/applications/:id/status',  deviceAuthorization, adminAuth, csrfProtection, ctrl.updateStatus);
router.delete('/applications/:id',        deviceAuthorization, adminAuth, csrfProtection, ctrl.deleteApplication);

// Services CRUD
router.post('/services',       deviceAuthorization, adminAuth, csrfProtection, ctrl.createService);
router.put('/services/:id',    deviceAuthorization, adminAuth, csrfProtection, ctrl.updateService);
router.delete('/services/:id', deviceAuthorization, adminAuth, csrfProtection, ctrl.deleteService);

// Analytics
router.get('/analytics', deviceAuthorization, adminAuth, ctrl.getAnalytics);

module.exports = router;
