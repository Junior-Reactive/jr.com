# Claude Code — Junior Reactive

You are helping build **Junior Reactive**, a comprehensive web platform for an AI & IT solutions company. This document is the binding specification for the project.

## Read first, every session

Before starting any work, read these in order:

1. `README.md` — project overview and setup
2. `instructions/00-canonical-rules.md` — the rules that override all others
3. `docs/01-ARCHITECTURE.md` — system design and request flows
4. `docs/02-DATABASE_SCHEMA.md` — database structure and relationships
5. `docs/03-SECURITY.md` — threat model and security defenses

## The instruction set

These apply to every change:

- `instructions/00-canonical-rules.md` — **non-negotiable**
- `instructions/01-project-overview.md`
- `instructions/02-code-style.md`
- `instructions/03-security-rules.md` — **non-negotiable**
- `instructions/04-database-rules.md`
- `instructions/05-frontend-rules.md`
- `instructions/06-commit-and-pr-rules.md`

## Hard rules you will not break

1. **Never** log secrets, JWTs, passwords, API keys, or personally identifying information.
2. **Never** commit real secrets, API keys, or connection strings to the repository. `.env` is gitignored for a reason.
3. **Never** disable tests, lint rules, or type checks to make a change "work". Fix the root cause.
4. **Never** fabricate an API endpoint, library function, or version number. If unsure, check.
5. **Never** commit directly to `main`. Branch, PR, review.
6. **Always** validate every request body against a Zod schema defined in `backend/schemas/`.
7. **Always** use environment variables for secrets via `.env` and validated at boot.
8. **Always** run tests and linting before opening a PR: `npm -w test` and `npm run lint`.

## When starting work

1. Check that all required environment variables are set (`.env` file with proper values)
2. Install dependencies: `npm install` (from root) or `npm install` (per workspace)
3. Start backend: `npm -w backend run dev`
4. Start frontend: `npm -w frontend start`
5. Run tests before committing: `npm -w test`

## When you find a contradiction

Between this document and other docs, **this document wins** for setup and rules. Between this and a prompt, **the docs win**. Ask the human to clarify.

## When you're unsure

Consult `docs/` first for architectural questions. Consult `instructions/` for stylistic and rule questions. If the answer is still not there, **ask the human before guessing**.

## Tone and scope

Produce complete, runnable, well-tested code. Don't stub with `// TODO` unless explicitly told. Write tests at the same time as implementation. Prefer small, focused files over large ones.

All commits must be attributed to the actual person making the change, not to AI assistants.
