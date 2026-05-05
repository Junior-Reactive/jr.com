# 01 — Architecture

## System overview

Junior Reactive is a two-tier application:

```
┌─────────────────────────────┐
│  Frontend                   │
│  React 18 on Vercel         │
│  juniorreactive.com         │
└──────────────┬──────────────┘
               │
               │ CORS
               │
       ┌───────▼────────┐
       │   API          │
       │   Express      │
       │   Render       │
       │   Port 5005    │
       └───────┬────────┘
               │
     ┌─────────┴────────┐
     │                  │
┌────▼──────┐  ┌───────▼────┐
│ PostgreSQL│  │ Resend/     │
│ Database  │  │ Nodemailer  │
│ Render    │  │ (Email)     │
└───────────┘  └─────────────┘
```

## Frontend (React 18)

**Location:** `frontend/src/`

**Technology:**
- React 18.2, React Router v6
- Axios for API calls
- TanStack React Query (caching, polling)
- CSS (global + component-scoped)

**Key pages:**
```
/                    → HomePage
/services            → ServicesPage
/services/:id        → ServiceDetailPage
/blog                → BlogPage
/blog/:slug          → BlogPostPage
/about               → AboutPage
/contact             → ContactPage
/apply               → ApplyPage
/portfolio           → PortfolioPage
/team                → TeamPage
/faq                 → FAQPage
/privacy             → PrivacyPage
/terms               → TermsPage

/admin               → AdminLogin
/admin/dashboard     → AdminDashboard
/admin/messages      → AdminMessages
/admin/applications  → AdminApplications
/admin/services      → AdminServices
/admin/analytics     → AdminAnalytics
```

**Session tracking:**
- SessionID persisted in `sessionStorage` (per-browser session)
- Tracked via `GET /api/analytics/track`
- Includes referrer, page path, session ID

**Authentication:**
- Admin login via `/api/admin/login` → JWT in response
- JWT used to access `/api/admin/*` endpoints
- Protected routes via `<ProtectedRoute>` wrapper

## Backend (Node.js/Express)

**Location:** `backend/`

**Entry point:** `backend/server.js` (port 5005 by default)

**Middleware stack (in order):**
1. Trust proxy (for Render reverse proxy)
2. CORS (explicit origin allowlist)
3. Helmet (security headers)
4. JSON parser (10MB limit)
5. Cookie parser
6. Rate limiting (global + per-endpoint)

**Routes:**
```
GET  /api/health                      → Health check (simple)
GET  /api/health/detailed             → Health check (with DB)
GET  /api-docs                        → Swagger UI
GET  /api-docs.json                   → OpenAPI spec

# Content (public)
GET  /api/services                    → List all services
GET  /api/services/:id                → Get one service
GET  /api/blog                        → List blog posts
GET  /api/blog/:slug                  → Get blog post
GET  /api/portfolio                   → List portfolio items
GET  /api/team                        → List team members
GET  /api/faqs                        → List FAQs

# Submissions
POST /api/contact                     → Submit contact form
POST /api/apply                       → Submit job application

# AI
POST /api/ai/chat                     → Chatbot (Groq/Llama3)
POST /api/ai/recommend                → Service recommender
POST /api/ai/brief                    → Project brief generator

# Analytics
POST /api/analytics/track             → Track page view

# Admin
POST /api/admin/login                 → Admin login
GET  /api/admin/messages              → List contact submissions
GET  /api/admin/applications          → List job applications
GET  /api/admin/services              → Admin service list
POST /api/admin/services              → Create service
PUT  /api/admin/services/:id          → Update service
GET  /api/admin/analytics             → View analytics
```

## Request flow: Contact form submission

```
1. User fills contact form (/contact page)
   │
2. Frontend validates with Zod schema
   │ (name, email, phone, subject, message)
   │
3. User clicks Submit
   ├─→ POST /api/contact { name, email, ... }
   │
4. Backend receives request
   ├─→ Rate limit check (20/hour per IP)
   ├─→ Zod schema validation
   ├─→ INSERT into contacts table
   ├─→ Send email to admin (Resend)
   ├─→ Send confirmation to user (Resend)
   │
5. Backend returns 201 Created
   │
6. Frontend shows success message
   │
7. Admin sees new message in /admin/messages
   │
8. Admin replies via interface
   ├─→ POST /api/admin/messages/:id/reply
   │
9. Customer receives reply email
   ├─→ Email sent to stored user email
```

## Database schema (high-level)

```
services
  ├─ id (UUID)
  ├─ title (string)
  ├─ description (text)
  ├─ icon (string)
  └─ created_at (timestamp)

blog_posts
  ├─ id (UUID)
  ├─ slug (string, unique)
  ├─ title (string)
  ├─ content (text)
  ├─ author (string)
  └─ published_at (timestamp)

portfolio_items
  ├─ id (UUID)
  ├─ title (string)
  ├─ description (text)
  ├─ image_url (string)
  ├─ link (string)
  └─ created_at (timestamp)

team_members
  ├─ id (UUID)
  ├─ name (string)
  ├─ position (string)
  ├─ bio (text)
  ├─ photo_url (string)
  └─ created_at (timestamp)

faqs
  ├─ id (UUID)
  ├─ question (string)
  ├─ answer (text)
  ├─ category (string)
  └─ created_at (timestamp)

contacts (submissions)
  ├─ id (UUID)
  ├─ name (string)
  ├─ email (string)
  ├─ phone (string)
  ├─ subject (string)
  ├─ message (text)
  ├─ service (string)
  ├─ status ('new' | 'replied' | 'archived')
  ├─ created_at (timestamp)
  └─ replied_at (timestamp)

applications (job applications)
  ├─ id (UUID)
  ├─ full_name (string)
  ├─ email (string)
  ├─ phone (string)
  ├─ position (string)
  ├─ experience (text)
  ├─ portfolio_url (string)
  ├─ resume_url (string)
  ├─ cover_letter (text)
  ├─ status ('new' | 'reviewed' | 'rejected' | 'accepted')
  ├─ created_at (timestamp)
  └─ reviewed_at (timestamp)

admin_users
  ├─ id (UUID)
  ├─ email (string, unique)
  ├─ password_hash (string)
  ├─ role ('admin' | 'editor' | 'viewer')
  ├─ last_login (timestamp)
  └─ created_at (timestamp)

page_views (analytics)
  ├─ id (UUID)
  ├─ session_id (string)
  ├─ page_path (string)
  ├─ referrer (string)
  ├─ user_agent (string)
  ├─ ip_address (string)
  └─ viewed_at (timestamp)
```

## Environment variables

**Backend (.env)**
```
PORT=5005
NODE_ENV=production
DB_USER=...
DB_PASSWORD=...
DB_SERVER=...
DB_DATABASE=...
FRONTEND_URL=https://juniorreactive.com
JWT_SECRET=...
GROQ_API_KEY=...
RESEND_API_KEY=...
```

**Frontend (.env)**
```
REACT_APP_API_URL=https://jr-backend-1edu.onrender.com/api
REACT_APP_GA_ID=... (optional, for Google Analytics)
```

## Deployment

**Backend (Render):**
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment: Node.js 18+
- Keep-alive: GitHub Actions pings `/api/health` every 5 minutes

**Frontend (Vercel):**
- Framework: Create React App
- Build command: `npm run build`
- Output directory: `build/`
- Environment: Automatic from `.env.local`

**Database (Render PostgreSQL):**
- Hosted on Render
- Connection pooling: Built-in
- Backups: Daily

## Monitoring and logging

- **Backend logs:** Stdout to Render console
- **Frontend errors:** Logged to browser console
- **Health check:** `/api/health` endpoint (simple), `/api/health/detailed` (with DB)
- **Analytics:** `page_views` table tracks all page visits

## Future improvements

- Implement pino logging (structured JSON logs)
- Add TypeScript to backend
- Migrate to Tailwind CSS (frontend)
- Implement Zod validation on all endpoints
- Add audit logging for admin actions
- Create audit trail for sensitive operations
