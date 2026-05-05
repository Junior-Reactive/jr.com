# 00 — Canonical Rules

> These rules apply to every change, every file, every commit. When in doubt, these override everything else except the docs.

## The hard prohibitions

**You do NOT:**

1. Log secrets, JWTs, passwords, API keys, payment credentials, or personally identifying information.
2. Commit a real secret, API key, connection string, or credential to the repository. `.env` is gitignored for a reason.
3. Accept a value from the client request (body, query, path) as authoritative if it should come from the authenticated session.
4. Disable a test, type check, or lint rule to make a change pass. Fix the root cause.
5. Fabricate an API endpoint, library function, or version number. If unsure it exists, check.
6. Commit directly to `main`. Branch, PR, review.
7. Use `eval`, `new Function`, or `dangerouslySetInnerHTML` for user input.
8. Build a SQL query with string concatenation. Use parameterised queries only.
9. Return `403 Forbidden` when a session accesses a resource belonging to another tenant. Return `404 Not Found` instead.
10. Persist a cookie without `HttpOnly`, `Secure` (in production), and an explicit `SameSite`.

## The hard obligations

**You always:**

1. Validate every request body against a Zod schema defined in `backend/schemas/`.
2. Validate every required environment variable on boot via Zod. Missing or malformed → refuse to start.
3. Take user identity and role from the authenticated token, never from the request body.
4. Log admin/sensitive actions with context: who, what, when, why, IP address.
5. Use the logger, never `console.log`. Logger redacts secrets automatically.
6. Mark every HTTP response header with `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and `Referrer-Policy: strict-origin-when-cross-origin`.
7. Check rate limits before processing auth attempts, payments, or bulk operations.
8. Write tests for every security-related change: auth, validation, rate limiting, CORS.
9. Commit with the format in `instructions/06-commit-and-pr-rules.md` (Conventional Commits).
10. Run `npm run lint` and `npm -w test` before opening a PR. Failing checks block merges.

## When you catch yourself about to violate a rule

Stop. Reread this file. Do the boring correct thing. The 20 minutes spent doing it right is not worth the security incident you spend a week recovering from.

## If a prompt contradicts a doc

The doc wins. If there's ambiguity, ask the human before proceeding.
