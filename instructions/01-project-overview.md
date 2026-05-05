# 01 — Project Overview

## What is Junior Reactive?

Junior Reactive is a comprehensive web platform for an AI & IT solutions company based in Kampala, Uganda.

**Core offerings:**
- Web development and consulting services
- AI-powered chatbot (Llama 3 via Groq)
- Service recommendations and project brief generation
- Admin panel for managing services, blog, portfolio, applications
- Contact form and job application submissions
- Analytics tracking for page views and user sessions

## The product stack

### Backend (Node.js/Express)
- Entry point: `backend/server.js`
- API endpoint: `https://jr-backend-1edu.onrender.com/api`
- Database: PostgreSQL (Render)
- Key features:
  - Content management (services, blog, portfolio)
  - Contact & application submissions
  - Admin authentication and dashboard
  - AI chatbot integration (Groq/Llama3)
  - Page analytics
  - Email notifications (Nodemailer/Resend)

### Frontend (React 18)
- Entry point: `frontend/src/index.js`
- Deployment: Vercel
- URL: `https://juniorreactive.com` (and www)
- Key pages:
  - Homepage, Services, Blog, Portfolio, Team
  - About, Contact, Apply, FAQs
  - Admin dashboard (login, messages, applications, services, analytics)
  - AI Tools page (chatbot, service recommender, brief generator)

## Request flow example: Contact Form

```
1. User fills contact form on /contact page
2. Frontend validates with Zod schema
3. POST /api/contact → Backend validation → DB INSERT
4. Email sent to admin + confirmation to user
5. Admin sees message in /admin/messages
6. Admin replies → Email sent to user
7. User gets notification
```

## Key metrics

- **Services:** 7-10 offerings (web dev, AI, mobile, etc.)
- **Blog posts:** Growing collection
- **Portfolio items:** Showcase of past projects
- **Team:** About 5-7 members
- **Users:** Customers, applicants, admins

## Deployment

- **Backend:** Render (Node.js dyno)
- **Frontend:** Vercel (Static site with dynamic routes)
- **Database:** Postgres on Render
- **Email:** Resend API (primary), Nodemailer fallback
- **Assets:** Inline, no external CDN
- **Keep-alive:** GitHub Actions cron job pings `/api/health` every 5 minutes

## Development URLs

- Backend: `http://localhost:5005/api`
- Frontend: `http://localhost:3000`
- API Docs: `http://localhost:5005/api-docs`

## Success criteria

- ✅ Website loads in < 3 seconds on 3G
- ✅ Admin can manage all content
- ✅ Contact form works end-to-end
- ✅ Chatbot responds within 5 seconds
- ✅ Zero data leaks (no secrets in logs)
- ✅ All emails deliver successfully
