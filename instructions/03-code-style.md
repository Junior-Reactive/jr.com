# 03 — Code Style

## JavaScript/Node.js

- **Indentation:** 2 spaces (not tabs).
- **Semicolons:** Yes, at the end of statements.
- **Quotes:** Single quotes `'string'` (except for JSON/require).
- **Variable naming:** `camelCase` for variables, `UPPER_SNAKE_CASE` for constants only.
- **Function naming:** Verbs for actions (`createOrder`, `sendEmail`), nouns for queries (`getUser`, `listProducts`).
- **Booleans:** Prefix with `is`, `has`, `can`, `should` (`isActive`, `hasError`).

## File naming

- Backend files: `lowercase.js` or `camelCase.js`
- Schemas: `backend/schemas/contact.js`, `backend/schemas/admin.js`
- Controllers: `backend/controllers/contactController.js`
- Routes: `backend/routes/contactRoutes.js`
- Tests: `*.test.js` (alongside source file)

## React Components (Frontend)

- **Naming:** `PascalCase.jsx` (one component per file)
- **Structure:** Functional components only, hooks for state
- **Props:** Typed via prop-types or JSDoc
- **CSS:** Import `.css` file alongside component
- **Event handlers:** `onClickButton` (prop), `handleClickButton` (implementation inside)

## Formatting

- **Line length:** 100 characters max
- **Comments:** Explain WHY, not what. The code shows what.
- **TODO comments:** Must reference an issue or have a date. Orphan TODOs fail linting.

```javascript
// ✅ Good
// Admin users can bulk-export orders; customers cannot (PR #42)
if (user.role === 'admin') {
  // ...
}

// ❌ Bad
// TODO: add export
// Handle admin export
```

## Error handling

- **Backend:** Throw typed errors from controllers. Middleware catches and converts to HTTP responses.
- **Frontend:** TanStack Query handles API errors. Components render `error` state via a boundary.
- **Never** swallow errors with bare `catch {}`. If ignoring intentionally, log and comment.

## Logging

```javascript
const logger = require('./utils/logger');

// ✅ Good
logger.info({ userId: 123, action: 'login' }, 'User logged in');
logger.warn({ status: 503 }, 'Database slow');

// ❌ Bad
console.log('User:', user); // Uses console
console.log(req.body); // Might log secrets
```

## Database queries

```javascript
// ✅ Good — parameterised
db.query('SELECT * FROM users WHERE email = $1', [email]);

// ❌ Bad — string concatenation
db.query('SELECT * FROM users WHERE email = "' + email + '"');
```

## HTTP and REST

- **Method:** `GET` (read), `POST` (create), `PUT/PATCH` (update), `DELETE` (delete)
- **Status codes:** `200` (success), `201` (created), `400` (bad request), `401` (auth required), `403` (forbidden), `404` (not found), `409` (conflict), `500` (server error)
- **Response format:** Always `{ success: boolean, data: ?, error: ? }` or similar
- **Rate limit headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Validation errors

Return a `400` with details:
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Invalid email format" },
    { "field": "name", "message": "Name required" }
  ]
}
```

## What we do NOT do

- Use `var`. Use `const` and `let`.
- Use `==` or `!=`. Use `===` and `!==`.
- Assign to `req.user` without validation from a token.
- Copy-paste code three times without extracting a function.
- Leave `console.log` in production code.
- Use magic numbers. Name them: `const MAX_RETRIES = 3;`
