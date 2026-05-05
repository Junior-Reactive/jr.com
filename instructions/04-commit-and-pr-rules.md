# 04 — Commit and PR Rules

## Commit message format (Conventional Commits)

```
<type>: <subject>

<body>

<footer>
```

### Type

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Formatting, missing semicolons, etc. (no code change)
- `refactor:` Code reorganisation without changing behaviour
- `perf:` Performance improvement
- `test:` Adding or updating tests
- `chore:` Build, dependency updates, config (no code change)

### Subject

- Imperative mood: "add feature" not "added feature"
- No period at the end
- Max 50 characters
- Lowercase first letter

### Body

- Explain WHAT changed and WHY, not HOW
- Wrap at 72 characters
- Reference related issues: "Fixes #123" or "See #456"
- Mention breaking changes clearly

### Footer

**Do NOT include** `Co-Authored-By: Claude` or AI assistant mentions.
- Commits are attributed to the actual person making the change
- Example correct format:
  ```
  feat: add contact form validation schema

  - Create Zod schema for contact form inputs
  - Validate name, email, phone, subject, message
  - Return 400 with field-level error details
  - Add unit tests for schema validation

  Fixes #15
  ```

## Branch naming

```
feat/short-description     # New feature
fix/short-description      # Bug fix
docs/short-description     # Documentation
refactor/short-description # Reorganisation
```

Examples:
- `feat/contact-form-validation`
- `fix/health-endpoint-timeout`
- `docs/architecture-diagrams`

## Pull request process

1. **Create branch** from `main`: `git checkout -b feat/your-feature`
2. **Make commits** with proper messages (see above)
3. **Push branch:** `git push origin feat/your-feature`
4. **Open PR** with title and description:
   ```
   Title: Add contact form validation schema

   ## Summary
   - Adds Zod schema for contact form
   - Validates all inputs before DB INSERT
   - Returns 400 with field-level errors

   ## Test plan
   - [ ] Test valid contact submission
   - [ ] Test invalid email
   - [ ] Test too-long message
   - [ ] Test rate limiting on contact endpoint
   ```
5. **Request review** from team
6. **Address feedback** — push additional commits to the same branch
7. **Merge** once approved: use "Squash and merge" or "Create a merge commit" (team decides)

## Before opening a PR

- [ ] Run tests: `npm -w test`
- [ ] Check linting: `npm run lint` (if configured)
- [ ] Verify no secrets in code or commit messages
- [ ] Rebase onto latest `main`: `git rebase origin/main`
- [ ] Force-push if needed: `git push origin feat/your-feature --force-with-lease`

## Do not

- **Commit directly to `main`.** Always use a branch and PR.
- **Include secrets, API keys, or credentials** in commits.
- **Amend published commits.** Create new commits instead.
- **Force-push to `main`.** Ever.
- **Merge without review** unless you're the only developer.
- **Leave TODO comments** without an issue reference or date.

## What a good commit history looks like

```
7f57076 fix: lightweight health check endpoint for Render keep-alive
3826bc4 fix: chatbot CSS, admin sidebar sections, reply cookie
e196149 fix: add missing Chatbot.css
d86bf71 feat: admin panel, analytics, keep-alive cron
1d7549c feat: AI chatbot (Groq/Llama3), Service Recommender, Brief Generator
```

Clear, atomic, reversible. Each commit can stand alone.
