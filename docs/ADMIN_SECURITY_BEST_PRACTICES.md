# Admin Access Security: 403 Forbidden Implementation Guide
## Best Practices for Protecting Admin Routes

**Version**: 1.0  
**Last Updated**: May 5, 2026  
**Status**: Reference Documentation

---

## TABLE OF CONTENTS
1. [Security Approach: 403 vs 404](#security-approach)
2. [Authorization Verification](#authorization-verification)
3. [Implementation Guide](#implementation-guide)
4. [Error Page Design](#error-page-design)
5. [Logging & Monitoring](#logging--monitoring)
6. [Testing Procedures](#testing-procedures)
7. [Deployment Checklist](#deployment-checklist)

---

## SECURITY APPROACH

### Why 403 Forbidden Instead of 404?

**The Spectrum of Access Control Responses**:

| HTTP Status | Message | Use Case | Security Benefit |
|-------------|---------|----------|-----------------|
| 200 OK | Shows login form | Authorized access | User-friendly |
| 403 Forbidden | "No permission" | Unauthorized access | **RECOMMENDED** |
| 404 Not Found | "Page not found" | Stealth/masking | Hides admin exists |

### Recommendation: 403 Forbidden

**For Junior Reactive, 403 is optimal because:**

1. **Team-First Design**
   - Your employees know the admin URL
   - 403 confirms: "You found the right place, but no access"
   - No confusion about admin route location

2. **Professional Signal**
   - 403 demonstrates intentional access control
   - Shows you take security seriously
   - Enterprise clients expect this approach

3. **Prevents Lockout Confusion**
   - Team members won't think admin is missing
   - Clear message: "You don't have permission"
   - Reduces support tickets from confused staff

4. **Supports Authorized Access**
   - When employee IS authorized, they know where to go
   - Shows login form only to verified users
   - Password field never exposed to unauthorized parties

5. **Better for Internal Teams**
   - If someone accidentally accesses from office, they see 403
   - No password theft risk if device is compromised
   - Clear security boundary

### When to Use 404 Instead

**Use 404 if:**
- You have no internal team accessing admin (SaaS multi-tenant)
- You want complete stealth (government/defense)
- You're not expecting ANY legitimate unauthorized users
- You want maximum obfuscation

**For Jr Reactive**: Not applicable. Your employees will use /admin intentionally.

---

## AUTHORIZATION VERIFICATION

### Three-Tier Authorization Model

```
Request to /admin
    ↓
[Tier 1] Device Authorization (IP/Fingerprint)
    ├─ PASS → Continue to Tier 2
    ├─ FAIL → Return 403 Forbidden (no password shown)
    └─ UNKNOWN → Continue to Tier 2 (verify on login)
    ↓
[Tier 2] User Authentication (Username/Password)
    ├─ PASS → Grant session token
    ├─ FAIL → Stay on login form, no error hints
    └─ MISSING → Show login form
    ↓
[Tier 3] Session Validation (On each request)
    ├─ VALID → Grant page access
    ├─ EXPIRED → Redirect to login
    └─ INVALID → Clear cookies, redirect to home
```

### Tier 1: Device Authorization

**Option A: IP Whitelist** (Simplest)

```javascript
// backend/middleware/deviceAuth.js
const AUTHORIZED_IPS = [
  '203.0.113.50',     // Office network
  '198.51.100.100',   // VPN gateway
  '192.0.2.5'         // Backup IP
];

function verifyDeviceAuthorization(req) {
  const clientIP = req.ip; // or req.headers['x-forwarded-for']
  return AUTHORIZED_IPS.includes(clientIP);
}

router.get('/admin', (req, res) => {
  if (!verifyDeviceAuthorization(req)) {
    res.status(403).sendFile(path.join(__dirname, 'public/403.html'));
    logger.warn(`Unauthorized admin access attempt from ${req.ip}`);
    return;
  }
  // Continue to login page or dashboard
});
```

**Pros**: Simple, fast, no session overhead  
**Cons**: Fails if team works remotely, requires IP management

---

**Option B: Device Fingerprint** (More flexible)

```javascript
// frontend/utils/deviceFingerprint.js
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export async function getDeviceFingerprint() {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
}

// backend/middleware/deviceAuth.js
async function verifyDeviceAuthorization(req, fingerprint) {
  const authorized = await db.authorizedDevices.findOne({
    fingerprint,
    isActive: true
  });
  return !!authorized;
}

// frontend/pages/AdminLogin.jsx
useEffect(() => {
  getDeviceFingerprint().then(fingerprint => {
    fetch('/api/admin/verify-device', {
      method: 'POST',
      body: JSON.stringify({ fingerprint })
    })
    .then(r => r.json())
    .then(data => {
      if (!data.authorized) {
        setShowForbidden(true);
      }
    });
  });
}, []);
```

**Pros**: Flexible (works from office, home, VPN), user-friendly  
**Cons**: Slightly more complex, fingerprinting not 100% reliable

---

**Option C: Device Token** (Most secure for teams)

```javascript
// Admin registers device once, gets long-lived token
// backend/routes/admin.js
router.post('/authorize-device', authenticate, (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  const device = {
    adminId: req.admin.id,
    token: hashToken(token), // Never store plain tokens
    name: req.body.deviceName || 'New Device',
    authorizedAt: new Date(),
    lastUsedAt: new Date(),
    isActive: true
  };
  db.authorizedDevices.create(device);
  res.json({ deviceToken: token }); // Show once, admin saves in .env
});

// frontend/.env.local
REACT_APP_DEVICE_TOKEN=abc123def456...

// frontend/pages/AdminLogin.jsx
const deviceToken = process.env.REACT_APP_DEVICE_TOKEN;
const isDeviceAuthorized = await verifyDeviceToken(deviceToken);
if (!isDeviceAuthorized) {
  showForbidden();
}
```

**Pros**: Explicit, no fingerprinting, very secure  
**Cons**: Requires setup, token management needed

---

### Tier 2: User Authentication

**Password Requirements**:
- Minimum 12 characters (recommended)
- Mix of uppercase, lowercase, numbers, special characters
- No dictionary words
- Salted and hashed (bcrypt with cost factor 12+)

**Credential Verification**:
```javascript
// backend/routes/admin.js
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const admin = await db.admin.findOne({ email });
  if (!admin) {
    // Don't reveal "user not found" - use generic error
    return res.status(401).json({ 
      error: 'Invalid credentials' // Same for non-existent user
    });
  }
  
  // Verify password
  const validPassword = await bcrypt.compare(password, admin.passwordHash);
  if (!validPassword) {
    // Log failed attempt
    await db.adminLog.create({
      adminId: admin.id,
      action: 'FAILED_LOGIN',
      ip: req.ip,
      timestamp: new Date()
    });
    
    // Check if too many failures
    const failedAttempts = await countRecentFailedAttempts(
      admin.id, 
      5 // minutes
    );
    if (failedAttempts >= 5) {
      return res.status(429).json({
        error: 'Too many failed attempts. Try again in 5 minutes.'
      });
    }
    
    return res.status(401).json({ 
      error: 'Invalid credentials' // Generic message
    });
  }
  
  // Success: Create session
  req.session.adminId = admin.id;
  req.session.loginTime = new Date();
  
  // Log successful login
  await db.adminLog.create({
    adminId: admin.id,
    action: 'LOGIN',
    ip: req.ip,
    timestamp: new Date()
  });
  
  res.json({ success: true, redirectTo: '/admin/dashboard' });
});
```

**Key Points**:
- ✅ Use same error message for "user not found" and "wrong password"
- ✅ Don't reveal which field is incorrect
- ✅ Implement rate limiting (5 attempts per 5 minutes)
- ✅ Log all attempts for security monitoring
- ✅ Use bcrypt (cost factor ≥12) for hashing

---

### Tier 3: Session Validation

**Session Configuration**:
```javascript
// backend/server.js
const session = require('express-session');
const RedisStore = require('connect-redis').default;

app.use(session({
  secret: process.env.SESSION_SECRET, // Min 32 random chars
  store: new RedisStore({ 
    client: redisClient,
    prefix: 'admin_session:'
  }),
  cookie: {
    httpOnly: true,        // Can't be accessed by JavaScript
    secure: true,          // HTTPS only
    sameSite: 'Strict',    // CSRF protection
    maxAge: 1800000,       // 30 minutes
    domain: process.env.SESSION_DOMAIN, // Only for admin.* subdomain
    path: '/admin'         // Only for /admin routes
  },
  rolling: true,           // Reset timeout on each request
  resave: false,
  saveUninitialized: false
}));

// Verify session on protected routes
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.adminId) {
    return res.redirect('/admin'); // Redirect to login
  }
  
  // Check session age
  const loginAge = Date.now() - req.session.loginTime;
  const maxAge = 8 * 60 * 60 * 1000; // 8 hours absolute max
  if (loginAge > maxAge) {
    req.session.destroy();
    return res.redirect('/admin');
  }
  
  next();
};

app.get('/admin/dashboard', requireAuth, (req, res) => {
  // Session is valid, show dashboard
});
```

**Session Timeout Strategy**:
- **Inactivity Timeout**: 30 minutes (auto-clears if unused)
- **Absolute Timeout**: 8 hours (forces re-login even if active)
- **Logout**: Immediately invalidates session
- **Multi-Device**: Optional: prevent concurrent logins

---

## IMPLEMENTATION GUIDE

### Step 1: Create Authorization Middleware

**File**: `backend/middleware/adminAuth.js`

```javascript
const crypto = require('crypto');
const logger = require('../utils/logger');

// Verify device is authorized
async function verifyDeviceAuthorization(req) {
  // Use one of the three options above
  // Option A: IP whitelist
  // Option B: Device fingerprint
  // Option C: Device token
  
  // This example uses device token
  const token = req.headers['x-device-token'];
  
  if (!token) {
    logger.warn('No device token provided');
    return false;
  }
  
  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  const device = await db.authorizedDevices.findOne({
    tokenHash,
    isActive: true
  });
  
  return !!device;
}

// Middleware function
async function adminGuard(req, res, next) {
  // Skip if user already has active session
  if (req.session && req.session.adminId) {
    return next();
  }
  
  // Check device authorization
  const isAuthorized = await verifyDeviceAuthorization(req);
  
  if (!isAuthorized) {
    // Return 403 Forbidden
    res.status(403);
    res.type('html');
    res.sendFile(path.join(__dirname, '../public/403.html'));
    
    // Log the attempt
    logger.warn('Unauthorized admin access attempt', {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      timestamp: new Date()
    });
    
    return;
  }
  
  // Device is authorized, continue to login page or dashboard
  next();
}

module.exports = { adminGuard, verifyDeviceAuthorization };
```

---

### Step 2: Apply Middleware to Routes

**File**: `backend/routes/admin.js`

```javascript
const express = require('express');
const { adminGuard } = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Apply guard to all /admin routes
router.use(adminGuard);

// Login page (authorized devices only)
router.get('/login', adminController.showLogin);

// Login submission
router.post('/login', adminController.handleLogin);

// Dashboard (requires login + valid session)
router.get('/dashboard', requireAuth, adminController.showDashboard);

// Logout
router.post('/logout', requireAuth, adminController.logout);

// Other admin routes...
router.get('/messages', requireAuth, adminController.getMessages);
router.get('/analytics', requireAuth, adminController.getAnalytics);

module.exports = router;
```

---

### Step 3: Create 403 Error Page

**File**: `frontend/public/403.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>403 Forbidden</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #1c265e 0%, #2d3a7a 100%);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 600px;
            text-align: center;
            animation: slideIn 0.5s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .status-code {
            font-size: 120px;
            font-weight: 800;
            line-height: 1;
            margin-bottom: 20px;
            opacity: 0.9;
            letter-spacing: -2px;
        }
        
        h1 {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 16px;
            line-height: 1.3;
        }
        
        p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 32px;
            opacity: 0.95;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .cta {
            display: inline-block;
            padding: 12px 32px;
            background: rgba(255, 255, 255, 0.15);
            color: #fff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .cta:hover {
            background: rgba(255, 255, 255, 0.25);
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        
        .cta:active {
            transform: translateY(0);
        }
        
        .logo {
            margin-bottom: 40px;
            opacity: 0.8;
        }
        
        .logo-box {
            display: inline-block;
            width: 56px;
            height: 56px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            font-weight: 900;
        }
        
        .footer {
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 14px;
            opacity: 0.6;
        }
        
        @media (max-width: 640px) {
            .status-code {
                font-size: 80px;
            }
            
            h1 {
                font-size: 28px;
            }
            
            p {
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <div class="logo-box">🔒</div>
        </div>
        
        <div class="status-code">403</div>
        
        <h1>Access Forbidden</h1>
        
        <p>You do not have permission to access this resource.</p>
        
        <a href="/" class="cta">← Return to Home</a>
        
        <div class="footer">
            <p>© 2026 Junior Reactive. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

---

## ERROR PAGE DESIGN

### Design Principles

✅ **DO**:
- Keep it minimal and professional
- Use brand colors (Jr's blue #1c265e)
- Make it responsive
- Link to homepage or contact
- Add light animation (optional)
- Use company logo or icon
- Make it obvious it's intentional

❌ **DON'T**:
- Ask for password
- Hint at authorization method
- Show technical stack info
- Include error codes or stack traces
- Make it look like a bug
- Ask "which URL should you use?"

### Design Variations

**Option 1: Minimal Apple Style**
```html
<h1>403 Forbidden</h1>
<p>You do not have permission to access this resource.</p>
<a href="/">← Back</a>
```

**Option 2: Branded Professional**
```html
<logo>JR</logo>
<h1>Access Denied</h1>
<p>This area is restricted to authorized users.</p>
<a href="/">Return to Home</a>
```

**Option 3: Helpful (Still Secure)**
```html
<h1>403 - Access Restricted</h1>
<p>This resource requires authorization.</p>
<div class="actions">
  <a href="/">Go to Home</a>
  <a href="mailto:admin@jrcom.dev">Contact Support</a>
</div>
```

---

## LOGGING & MONITORING

### What to Log

```javascript
// backend/models/AdminLog.js
const adminLogSchema = {
  adminId: String,           // Which admin (if known)
  action: String,            // LOGIN, LOGOUT, FAILED_LOGIN, UNAUTHORIZED_ACCESS
  ipAddress: String,         // Source IP
  userAgent: String,         // Browser/device info
  timestamp: Date,           // When it happened
  deviceFingerprint: String, // Device identifier
  success: Boolean,          // Did the action succeed?
  errorMessage: String,      // If failed, why?
  sessionDuration: Number    // Minutes, if logout
};

// Log examples
async function logLoginAttempt(admin, req, success) {
  await AdminLog.create({
    adminId: admin?.id,
    action: success ? 'LOGIN' : 'FAILED_LOGIN',
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date(),
    success
  });
}

async function logUnauthorizedAccess(req) {
  await AdminLog.create({
    action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date(),
    success: false,
    errorMessage: 'Device not authorized'
  });
}
```

### Alerts to Set Up

**Alert Conditions**:
1. **5+ Failed Login Attempts** from same IP in 5 minutes
   - Action: Rate limit that IP
   - Notify: Admin immediately
2. **Login from New Device**
   - Action: Log and notify admin
   - Response: Require confirmation (optional)
3. **Unauthorized Access Attempt**
   - Action: Log immediately
   - Notify: Admin dashboard
4. **Multiple Unauthorized Attempts** from same IP
   - Action: Consider blocking IP
   - Notify: Admin + log
5. **Session Activity During Unusual Hours**
   - Action: Log and flag
   - Notify: Admin (optional)

### Dashboard Metrics

Create admin page showing:
- Last 10 login/logout events
- Failed attempts in last 24 hours
- Unique IPs attempting access
- Active sessions count
- Device authorizations (list/manage)

---

## TESTING PROCEDURES

### Manual Testing Checklist

```
Browser-Based Testing:
☐ Unauthorized IP → Shows 403 page (no password field)
☐ Authorized IP (no session) → Shows login form
☐ Authorized IP + valid login → Shows dashboard
☐ Authorized IP + invalid password → Shows login form (no error hint)
☐ Session timeout (30 min) → Redirects to login
☐ Manual logout → Session cleared
☐ Try session cookie manipulation → Fails gracefully
☐ Try SQL injection in password → Blocked (prepared statements)
☐ Try brute force (many attempts) → Rate limited
☐ 403 page responsive on mobile → Yes
☐ 403 page has no password field → Confirmed
☐ Links work on 403 page → Yes
☐ Logo/branding visible on 403 → Yes

Network Testing:
☐ Check HTTP response headers (no sensitive info)
☐ Check cookies (HttpOnly, Secure, SameSite flags)
☐ Verify HTTPS enforcement
☐ Check CORS headers on /admin routes
☐ Verify CSP headers set
☐ Check X-Frame-Options header

Security Testing:
☐ Test with invalid/missing device token
☐ Test with modified device token
☐ Test with old IP (if using IP whitelist)
☐ Test password requirements enforced
☐ Test session stealing attempt
☐ Test CSRF token validation
☐ Test with VPN/proxy enabled
```

### Automated Testing

```javascript
// test/admin.test.js
describe('Admin Authorization', () => {
  test('Unauthorized IP receives 403', async () => {
    const res = await request(app)
      .get('/admin')
      .set('x-forwarded-for', '1.2.3.4'); // Unauthorized IP
    
    expect(res.status).toBe(403);
    expect(res.text).not.toContain('password');
    expect(res.text).toContain('403');
  });
  
  test('Authorized IP receives login form', async () => {
    const res = await request(app)
      .get('/admin')
      .set('x-device-token', VALID_DEVICE_TOKEN);
    
    expect(res.status).toBe(200);
    expect(res.text).toContain('login');
  });
  
  test('Invalid password resets form', async () => {
    const res = await request(app)
      .post('/admin/login')
      .send({
        email: 'admin@example.com',
        password: 'wrong-password'
      });
    
    expect(res.status).toBe(401);
    expect(res.body.error).not.toContain('password');
  });
  
  test('Rate limiting activates after failures', async () => {
    // Make 5 failed attempts
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/admin/login')
        .send({ email: 'admin@example.com', password: 'wrong' });
    }
    
    // 6th attempt should be rate limited
    const res = await request(app)
      .post('/admin/login')
      .send({ email: 'admin@example.com', password: 'wrong' });
    
    expect(res.status).toBe(429);
  });
  
  test('Valid login creates session', async () => {
    const res = await request(app)
      .post('/admin/login')
      .send({
        email: 'admin@example.com',
        password: 'correct-password-hash'
      });
    
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toContain('HttpOnly');
    expect(res.headers['set-cookie'][0]).toContain('Secure');
  });
});
```

---

## DEPLOYMENT CHECKLIST

### Pre-Deployment

- [ ] All tests passing (unit + integration + security)
- [ ] Code reviewed by team lead
- [ ] Device authorization method chosen and configured
- [ ] All environment variables set:
  - [ ] `SESSION_SECRET` (32+ random characters)
  - [ ] `DEVICE_TOKENS` or `AUTHORIZED_IPS` configured
  - [ ] `SESSION_DOMAIN` set correctly
  - [ ] `REDIS_URL` configured (if using Redis)
- [ ] 403 page HTML file created and tested
- [ ] Error logging configured
- [ ] Alert system configured
- [ ] Admin can access from authorized device
- [ ] Rate limiting active in staging
- [ ] HTTPS enforced on /admin routes
- [ ] Session timeout configured (30 min + 8 hour max)

### Deployment

1. **Stage Environment**
   - [ ] Deploy to staging first
   - [ ] Run full test suite
   - [ ] Manual testing from multiple locations
   - [ ] Verify error logging
   - [ ] Check alert system

2. **Production Rollout**
   - [ ] Create git tag (v1.0.0-admin-security)
   - [ ] Deploy during low-traffic period
   - [ ] Monitor logs closely first 30 minutes
   - [ ] Test login from authorized device
   - [ ] Verify 403 response for unauthorized
   - [ ] Check for any errors in application logs
   - [ ] Verify analytics/logging working

3. **Post-Deployment**
   - [ ] Verify unauthorized access logs show 403 returns
   - [ ] Check admin can login successfully
   - [ ] Verify session timeout working
   - [ ] Monitor error rates (should be minimal)
   - [ ] Test from VPN if team uses VPN
   - [ ] Document any issues
   - [ ] Create runbook for troubleshooting

### Rollback Plan

If issues occur:
```bash
# Immediate rollback
git revert <commit-hash>
npm run build && npm run deploy:prod

# Verify rollback
# - Check /admin returns login page for all IPs
# - Verify admin can still login
# - Monitor logs for errors
```

---

## SECURITY HARDENING CHECKLIST

Beyond the basics:

```
HTTP Headers:
☐ Content-Security-Policy: default-src 'self'; script-src 'self'
☐ X-Content-Type-Options: nosniff
☐ X-Frame-Options: DENY
☐ X-XSS-Protection: 1; mode=block
☐ Strict-Transport-Security: max-age=31536000; includeSubDomains
☐ Referrer-Policy: no-referrer

Input Validation:
☐ Email validation (RFC 5322)
☐ Password strength requirements
☐ Prepared statements (no SQL injection)
☐ HTML escaping (no XSS)
☐ Request size limits
☐ Rate limiting on all endpoints

Database:
☐ Passwords hashed with bcrypt (cost ≥12)
☐ No plain text secrets stored
☐ Database credentials in env variables
☐ Regular backups encrypted
☐ Database user has minimal permissions

Monitoring:
☐ Admin access attempts logged
☐ Failed login attempts tracked
☐ Session activity logged
☐ Alerts for suspicious patterns
☐ Regular log review (weekly minimum)
☐ Automated threat detection

Deployment:
☐ No credentials in code/git
☐ Environment variables used for secrets
☐ HTTPS only (no HTTP)
☐ Security headers on all responses
☐ Dependencies up-to-date
☐ No known vulnerabilities (npm audit)
```

---

## TROUBLESHOOTING GUIDE

### Problem: Admin Can't Access /admin

**Symptoms**: Authorized admin sees 403 page

**Diagnosis**:
1. Check device authorization method
   - If IP whitelist: Is admin's IP in list?
   - If device token: Is token valid/registered?
   - If fingerprint: Has device been authorized?
2. Check browser cookies
   - Are cookies being set? (DevTools → Application → Cookies)
3. Check HTTPS
   - Is connection encrypted?
   - Is admin using HTTPS?
4. Check VPN
   - Is admin using VPN? (IP might change)
   - Is VPN IP in whitelist?

**Solutions**:
- Add admin's current IP to whitelist
- Register device token if using that method
- Clear browser cache/cookies and retry
- Test from different network
- Check server logs for specific error

---

### Problem: Too Many Users Locked Out

**Symptoms**: Multiple team members see 403

**Diagnosis**:
- Office IP changed?
- ISP assigned new IP?
- VPN IP blocked?
- Device tokens expired?

**Quick Fix**:
```javascript
// Temporarily disable rate limiting
DELETE FROM admin_logs WHERE action = 'FAILED_LOGIN' AND timestamp > NOW() - INTERVAL '5 minutes';

// Re-enable auth with known good credentials
// Or temporarily switch to IP whitelist verification
```

---

### Problem: Performance Degradation

**Symptoms**: Login slow, timeouts

**Diagnosis**:
- Redis/session store down?
- Database slow?
- Rate limiter misconfigured?

**Solutions**:
- Check Redis status: `redis-cli ping`
- Check database: `SELECT 1` query timing
- Review rate limiting rules
- Check server logs for errors

---

## MAINTENANCE

### Weekly
- [ ] Review admin access logs
- [ ] Check for suspicious patterns
- [ ] Verify alerts working

### Monthly
- [ ] Update dependencies (npm audit)
- [ ] Review password policy
- [ ] Check session timeout settings
- [ ] Test disaster recovery
- [ ] Update device authorizations (remove old devices)

### Quarterly
- [ ] Security audit/penetration testing
- [ ] Review and update authorization method
- [ ] Train team on security best practices
- [ ] Review incident reports
- [ ] Update threat model

---

## REFERENCES

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Security Guidelines](https://csrc.nist.gov/)
- [bcrypt Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Session Security](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

**Document Version**: 1.0  
**Last Updated**: May 5, 2026  
**Next Review**: May 2027  
**Owner**: Junior Reactive Security Team

