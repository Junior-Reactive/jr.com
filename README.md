# Junior Reactive - AI & IT Solutions Website

> A modern, full-stack business website for Junior Reactive, specializing in AI and IT solutions. Built with cutting-edge technologies including React, Node.js, Express, PostgreSQL, and advanced features like real-time analytics, AI chatbot integration, and automated service recommendations.

## 🌐 Live Website
- **Production**: [jrcom.vercel.app](https://jrcom.vercel.app)
- **Admin Dashboard**: [/admin](https://jrcom.vercel.app/admin)

## ✨ Key Features

### For Visitors
- **Service Showcase** - Dynamic service catalog with detailed descriptions
- **Project Portfolio** - Showcase of completed work with case studies
- **Team Profiles** - Meet the team with detailed bios
- **Contact & Inquiry** - Multi-channel communication options
- **Blog** - Industry insights and thought leadership
- **AI Chatbot** - Powered by Groq/Llama3 for instant support
- **Service Recommender** - AI-powered tool to suggest services based on needs
- **Project Brief Generator** - AI tool to help clients articulate project needs
- **Analytics** - Anonymous visitor analytics and insights
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Performance Optimized** - Fast load times with intelligent caching

### For Admin
- **Comprehensive Dashboard** - Real-time metrics and KPIs
- **Message Management** - Organized inbox with filtering
- **Application Tracking** - Manage job applications
- **Analytics Panel** - Visitor insights and engagement metrics
- **Service Management** - Create/edit/delete services
- **Content Management** - Manage blog posts, portfolio, FAQ
- **Admin Authentication** - Secure JWT-based login
- **Team Management** - Manage team member profiles

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 with React Router, React Query
- **Backend**: Node.js/Express with PostgreSQL
- **Hosting**: Vercel (Frontend), Render (Backend)
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JWT tokens with secure storage
- **AI Integration**: Groq API (Llama3 model)
- **Styling**: CSS with custom design system
- **Logging**: Pino with automatic secret redaction

### Project Structure
```
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   └── assets/         # Images, styles, fonts
│   └── package.json
├── backend/                 # Express API
│   ├── routes/             # API endpoints
│   ├── models/             # Database models
│   ├── schemas/            # Validation schemas (Zod)
│   ├── utils/              # Utilities (logger, cache, etc)
│   ├── middleware/         # Auth, error handling
│   └── package.json
├── .github/                # GitHub workflows
│   └── workflows/          # CI/CD pipelines
├── docs/                   # Documentation
├── README.md
└── LICENSE                 # Proprietary License

```

## 🔧 Prerequisites

- **Node.js** v20 or higher
- **npm** or **yarn** package manager
- **PostgreSQL** 12+ (local or cloud)
- Environment variables configured (see below)

## 🚀 Quick Start

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env    # Configure API URL
npm start               # Runs on http://localhost:3001
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env    # Configure database and secrets
npm run dev             # Runs on http://localhost:5005
```

### Environment Variables (Backend)
```env
NODE_ENV=development
PORT=5005
DATABASE_URL=postgresql://user:password@localhost:5432/jr_db
JWT_SECRET=your-secure-secret-key-min-32-chars
GROQ_API_KEY=your-groq-api-key
```

### Environment Variables (Frontend)
```env
REACT_APP_API_URL=http://localhost:5005/api
```

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - Team member profiles
- **services** - Service offerings
- **blog_posts** - Blog articles
- **portfolio** - Project showcase
- **messages** - Contact form submissions
- **applications** - Job applications
- **faq** - Frequently asked questions
- **page_views** - Analytics tracking

## 🔐 Security Features

✅ **Input Validation** - Zod schemas for all inputs
✅ **Secret Redaction** - Automatic redaction in logs
✅ **CORS Protection** - Configured CORS headers
✅ **JWT Authentication** - Secure token-based auth
✅ **Environment Validation** - Strict env variable checking on boot
✅ **Error Handling** - Centralized error management
✅ **Rate Limiting** - Protect against abuse
✅ **XSS Prevention** - Proper content escaping
✅ **CSRF Protection** - Token-based protection

## 📈 Performance Optimization

- **Caching Strategy** - 1-hour TTL for services, blog, portfolio data
- **Database Indexing** - Optimized queries with proper indexes
- **Analytics Optimization** - 90-day rolling window, 5-minute cache
- **Frontend Optimization** - Lazy loading, code splitting
- **API Timeout** - 8-second timeout for fast feedback
- **Health Checks** - Lightweight endpoint for keep-alive

## 🎨 Design System

### Brand Colors
```
Primary Blue:      #1c265e
Secondary Blue:    #5269c3
Accent Blue:       #90a0da
Light Accent:      #a8ccee
Light Background:  #e4eaf9
```

### Typography
- Display Font: Inter
- Font Sizes: Responsive scaling
- Line Heights: Optimized for readability

## 📝 Commit Convention

This project uses **Conventional Commits** format:

```
feat:  New feature
fix:   Bug fix
refactor: Code refactoring
perf:  Performance improvement
docs:  Documentation
style: Code style changes
test:  Test-related changes
chore: Build, dependency updates
```

Example: `feat: add AI chatbot integration with Groq API`

## 🔄 Deployment

### Frontend (Vercel)
- Auto-deploys on push to main
- Production builds optimized
- Environment variables configured in Vercel dashboard

### Backend (Render)
- Auto-deploys on push to main
- Free tier with cold start optimization
- PostgreSQL connection pooling enabled
- Keep-alive cron job prevents cold starts

### Database (PostgreSQL)
- Connection pooling configured
- Automated backups recommended
- Query optimization and indexing applied

## 🤝 Contributing

This is a proprietary project. External contributions are not accepted. For bug reports or feature requests, please contact the project maintainers.

## 📞 Contact

- **Website**: [jrcom.vercel.app](https://jrcom.vercel.app)
- **Email**: Contact through website
- **Admin Panel**: [Login](https://jrcom.vercel.app/admin/login)

## 📄 License

This project is licensed under the Proprietary License - see the [LICENSE](LICENSE) file for details. Unauthorized copying, modification, or distribution is prohibited.

---

**Made with ❤️ by Junior Reactive Solutions**
