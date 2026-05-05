const logger = require('../utils/logger');

/**
 * Device Authorization Middleware
 *
 * Verifies that the requesting device/IP is authorized to access the admin panel.
 * Uses IP whitelist for authorization.
 *
 * If unauthorized: Returns 403 Forbidden (no login form shown)
 * If authorized: Continues to next middleware (shows login form)
 */

// Authorized IP addresses (from environment or hardcoded)
const AUTHORIZED_IPS = [
  // Development
  '127.0.0.1',
  'localhost',
  '::1',  // IPv6 localhost
  '::ffff:127.0.0.1',  // IPv6-mapped IPv4 localhost

  // Add your office/VPN IPs here
  // Examples:
  // '203.0.113.50',     // Office network
  // '198.51.100.100',   // VPN gateway
  // '192.0.2.5'         // Backup IP
].map(ip => ip.toLowerCase());

/**
 * Get client IP address from request
 * Handles proxies and load balancers
 */
function getClientIP(req) {
  // Check for IP from various headers (proxy/load balancer)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim().toLowerCase();
  }

  // Fallback to direct connection
  return (req.connection.remoteAddress || req.socket.remoteAddress || req.ip || '').toLowerCase();
}

/**
 * Check if IP is in authorized list
 */
function isIPAuthorized(ip) {
  // Normalize IPv6-mapped IPv4 addresses
  const normalizedIP = ip.replace(/^::ffff:/, '');

  return AUTHORIZED_IPS.some(authorizedIP => {
    // Exact match
    if (normalizedIP === authorizedIP) return true;

    // Wildcard matching for ranges (e.g., "192.168.1.*")
    if (authorizedIP.includes('*')) {
      const pattern = new RegExp(
        '^' + authorizedIP.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$'
      );
      return pattern.test(normalizedIP);
    }

    return false;
  });
}

/**
 * Middleware: Check device/IP authorization
 */
function deviceAuthorization(req, res, next) {
  const clientIP = getClientIP(req);
  const isAuthorized = isIPAuthorized(clientIP);

  logger.info('Admin access attempt', {
    ip: clientIP,
    authorized: isAuthorized,
    userAgent: req.get('user-agent'),
    path: req.path,
    timestamp: new Date().toISOString()
  });

  // If not authorized, return 403 Forbidden
  if (!isAuthorized) {
    logger.warn('Unauthorized admin access attempt', {
      ip: clientIP,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString()
    });

    // Return 403 with HTML response (no login form shown)
    return res.status(403).send(get403HTML());
  }

  // Device is authorized, continue to next middleware
  next();
}

/**
 * Generate 403 Forbidden HTML page
 * This is the response shown to unauthorized users
 */
function get403HTML() {
  return `<!DOCTYPE html>
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
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .logo {
            margin-bottom: 40px;
            opacity: 0.8;
        }
        .logo-box {
            display: inline-block;
            width: 64px;
            height: 64px;
            background: rgba(255, 255, 255, 0.12);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            line-height: 1;
            border: 1px solid rgba(255, 255, 255, 0.2);
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
        a {
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
        a:hover {
            background: rgba(255, 255, 255, 0.25);
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        .footer {
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 14px;
            opacity: 0.6;
        }
        @media (max-width: 640px) {
            .status-code { font-size: 80px; }
            h1 { font-size: 28px; }
            p { font-size: 15px; }
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
        <a href="/">← Return to Home</a>
        <div class="footer">
            <p>© 2026 Junior Reactive. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Function to add an IP to authorized list (for dynamic updates)
 * Usage: call this function to authorize a new IP at runtime
 */
function authorizeIP(ip) {
  const normalizedIP = ip.toLowerCase();
  if (!AUTHORIZED_IPS.includes(normalizedIP)) {
    AUTHORIZED_IPS.push(normalizedIP);
    logger.info('Authorized new IP', { ip: normalizedIP });
  }
}

/**
 * Function to remove an IP from authorized list
 */
function deauthorizeIP(ip) {
  const normalizedIP = ip.toLowerCase();
  const index = AUTHORIZED_IPS.indexOf(normalizedIP);
  if (index > -1) {
    AUTHORIZED_IPS.splice(index, 1);
    logger.info('Deauthorized IP', { ip: normalizedIP });
  }
}

/**
 * Get list of authorized IPs
 */
function getAuthorizedIPs() {
  return [...AUTHORIZED_IPS];
}

module.exports = {
  deviceAuthorization,
  authorizeIP,
  deauthorizeIP,
  getAuthorizedIPs,
  getClientIP,
  isIPAuthorized
};
