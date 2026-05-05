# 02 — Database Schema

All timestamps are stored in UTC (`timestamp with time zone`). Queries should respect this.

## Tables

### `services`
Core service offerings. Listed on homepage and services page.

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(255),
  price DECIMAL(10, 2),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_featured ON services(featured);
CREATE INDEX idx_services_created ON services(created_at DESC);
```

**Fields:**
- `id`: Unique service identifier
- `title`: Service name (e.g., "Web Development")
- `description`: Detailed service description
- `icon`: Icon filename or URL
- `price`: Optional pricing (for quote requests)
- `featured`: Whether to show on homepage
- `created_at`, `updated_at`: Timestamps

---

### `blog_posts`
Published blog articles. Slug is the URL-friendly identifier.

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blog_slug ON blog_posts(slug);
CREATE INDEX idx_blog_published ON blog_posts(published_at DESC);
```

**Fields:**
- `slug`: URL-friendly identifier (e.g., "why-react-is-great")
- `title`: Blog post title
- `content`: Markdown or HTML content
- `author`: Author name
- `published_at`: Publication date (NULL = draft)

---

### `portfolio_items`
Showcase projects and case studies.

```sql
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  link VARCHAR(500),
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_portfolio_category ON portfolio_items(category);
```

**Fields:**
- `title`: Project name
- `description`: Brief description
- `image_url`: Screenshot or cover image
- `link`: URL to project or case study
- `category`: Type of project (e.g., "Mobile App", "Web Platform")

---

### `team_members`
Company team directory.

```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100),
  bio TEXT,
  photo_url VARCHAR(500),
  email VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_team_position ON team_members(position);
```

**Fields:**
- `name`: Full name
- `position`: Job title
- `bio`: Short bio
- `photo_url`: Photo filename or URL
- `email`: Contact email

---

### `faqs`
Frequently asked questions.

```sql
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_faq_category ON faqs(category);
CREATE INDEX idx_faq_order ON faqs(display_order);
```

**Fields:**
- `question`: FAQ question
- `answer`: Detailed answer
- `category`: Topic (e.g., "Pricing", "Services", "General")
- `display_order`: Sort order in UI

---

### `contacts`
Contact form submissions. Tracks status (new, replied, archived).

```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  service VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  replied_at TIMESTAMP WITH TIME ZONE,
  archived_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created ON contacts(created_at DESC);
CREATE INDEX idx_contacts_email ON contacts(email);
```

**Fields:**
- `status`: One of `new`, `replied`, `archived`
- `ip_address`: Submitter IP (for spam detection)
- `replied_at`: When admin replied
- `archived_at`: When archived by admin

---

### `applications`
Job application submissions.

```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  position VARCHAR(100) NOT NULL,
  experience TEXT,
  portfolio_url VARCHAR(500),
  resume_url VARCHAR(500),
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'new',
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created ON applications(created_at DESC);
CREATE INDEX idx_applications_position ON applications(position);
```

**Fields:**
- `status`: One of `new`, `reviewed`, `rejected`, `accepted`
- `resume_url`: Uploaded resume URL
- `portfolio_url`: Link to portfolio
- `reviewed_at`: When admin reviewed

---

### `admin_users`
Admin panel users with authentication.

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'viewer',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_email ON admin_users(email);
```

**Fields:**
- `email`: Login email (unique)
- `password_hash`: Bcrypt or argon2 hash (never plain text)
- `role`: One of `admin`, `editor`, `viewer`
  - `admin`: Full access
  - `editor`: Can create/edit content, not users
  - `viewer`: Read-only
- `last_login`: Last successful login time

---

### `page_views`
Analytics: page views and user sessions.

```sql
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100) NOT NULL,
  page_path VARCHAR(500),
  referrer VARCHAR(500),
  user_agent TEXT,
  ip_address INET,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pageviews_session ON page_views(session_id);
CREATE INDEX idx_pageviews_path ON page_views(page_path);
CREATE INDEX idx_pageviews_date ON page_views(viewed_at DESC);
```

**Fields:**
- `session_id`: Browser session (from `sessionStorage`)
- `page_path`: URL path (e.g., "/services")
- `referrer`: HTTP referrer
- `user_agent`: Browser/device info
- `ip_address`: User's IP

---

## Queries reference

**List all services:**
```sql
SELECT * FROM services ORDER BY featured DESC, created_at DESC;
```

**Get blog post by slug:**
```sql
SELECT * FROM blog_posts WHERE slug = $1 AND published_at IS NOT NULL;
```

**List new contact submissions:**
```sql
SELECT * FROM contacts WHERE status = 'new' ORDER BY created_at DESC;
```

**Count page views by path (last 7 days):**
```sql
SELECT page_path, COUNT(*) as views
FROM page_views
WHERE viewed_at > NOW() - INTERVAL '7 days'
GROUP BY page_path
ORDER BY views DESC;
```

**Get admin by email:**
```sql
SELECT * FROM admin_users WHERE email = $1;
```

## Data retention

- **`services`, `blog_posts`, `portfolio_items`, `team_members`, `faqs`:** Indefinite
- **`contacts`, `applications`:** Archived after 90 days (deleted flag + anonymised)
- **`page_views`:** Purge after 90 days
- **`admin_users`:** Indefinite (deactivate instead of deleting)

## Constraints

- All timestamps in **UTC** (`TIMESTAMP WITH TIME ZONE`)
- All emails **lowercase** before insert
- All phone numbers **validated** before insert
- No **NULL** values in required fields (enforced at app level)
- Soft deletes preferred (add `deleted_at` column rather than DELETE rows)

## Migrations

Migrations should be idempotent and reversible. See `backend/migrations/` for examples.

```javascript
// Example migration
exports.up = (knex) => {
  return knex.schema.createTable('new_table', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).notNullable();
    table.timestamps(true, true); // created_at, updated_at
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('new_table');
};
```
