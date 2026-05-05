# 02 — Security Rules (Non-Negotiable)

## Secrets and credentials

- **Never** commit a real secret, API key, or connection string. `.env` is gitignored.
- **Validate** every required env var on boot via Zod. Missing or malformed → exit 1.
- **Never** log a secret, password, token, TOTP code, or payment credential at any level.
- **Redact** automatically via logger: `pino` redaction config removes keys like `password`, `token`, `secret`, `apiKey`.
- **Rotate** every secret annually and immediately on any suspicion of compromise.

## Authentication

- Passwords hashed with **bcrypt** or **argon2id** (never plaintext or weak hashing).
- JWTs signed with **HMAC-SHA256**.
- Access tokens: 15-minute TTL.
- Refresh tokens: opaque random values, hashed before storage.
- Cookies: `HttpOnly`, `Secure` (production), `SameSite=Lax`, explicit path.
- **Never** store tokens in `localStorage` or `sessionStorage`. HTTP-only cookies only.

## Input validation

- **Every** request body validated via Zod schema in `backend/schemas/`.
- **Every** query parameter and path ID validated (UUIDs, bounded strings, enum values).
- Never use `req.body.*` directly in business logic. Always use the validated schema result.

## Database

- **Parameterised queries only.** No string concatenation into SQL.
- Return `404` (not `403`) when a session looks up a resource belonging to another user/org.
- Least-privilege DB user: `SELECT/INSERT/UPDATE/DELETE` only; no `DROP`, `ALTER`, or `CREATE`.

## XSS and output encoding

- React escapes by default — use it.
- **Never** use `dangerouslySetInnerHTML` for user input.
- User-entered text is treated as untrusted everywhere (displayed in HTML, emails, admin panels).

## CSRF

- Double-submit cookie pattern on state-changing endpoints (`POST`, `PUT`, `DELETE`).
- `SameSite=Lax` on auth cookies blocks cross-origin CSRF by default.
- Non-authenticated endpoints (contact form) protected by rate limiting.

## File uploads

- Uploads go **directly to Cloudinary** via signed presets. Server never handles raw bytes.
- Validate URL pattern before storing (must match Cloudinary account).

## Rate limiting

- Global: 300 requests per 15 minutes per IP.
- Auth endpoints (`/api/admin/login`): 5 attempts per 15 minutes per IP.
- Contact and apply forms: 20 submissions per hour per IP.
- Prevents brute force, DoS, and spam.

## CORS

- Explicit origin allowlist: `localhost:3000`, `localhost:3001`, `juniorreactive.com`, `*.vercel.app`.
- No wildcards (`*`).
- `Access-Control-Allow-Credentials: true` only for trusted origins.

## Webhooks and external calls

- Inbound webhooks: verify signature/source before processing.
- Outbound calls: set timeouts and retry bounds (max 3 retries with exponential backoff).
- Never trust webhook bodies blindly — re-verify critical state with the source API.

## Logging

- Use `logger` from `backend/utils/logger.js`, never `console.log`.
- Structured logs (object, not string concatenation).
- Redaction automatically removes: `password`, `token`, `secret`, `key`, `apiKey`, `authorization`.
- Never log full request bodies on auth or payment endpoints.
- Log levels: `debug` (dev only), `info` (events), `warn` (unexpected but recoverable), `error` (unrecoverable).

## Response headers

Every response includes:
```
Strict-Transport-Security: max-age=63072000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## What a security review checks

1. New endpoints have input validation (Zod schema).
2. Auth endpoints rate-limited appropriately.
3. No secrets logged or returned to clients.
4. No unparameterised SQL queries.
5. No `dangerouslySetInnerHTML` with user input.
6. No cookies without `HttpOnly`, `Secure`, `SameSite`.
7. External API calls have timeouts and retry logic.
8. Sensitive admin actions are logged with context.

## Incident response

1. Declare in Slack or email immediately.
2. Assess severity (P0 = data leak, P1 = auth bypass, P2 = DoS, P3 = minor bug).
3. Contain (rollback, disable feature, block IP, rotate secret).
4. Communicate to affected users per severity SLA.
5. Post-mortem within 72 hours for P0/P1.
