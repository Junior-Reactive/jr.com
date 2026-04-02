-- ============================================================
--  Junior Reactive — Admin Setup Migration
--  Run this ONCE against your Neon PostgreSQL database
--  You can run it via: psql $DATABASE_URL -f admin_setup.sql
-- ============================================================

-- 1. Add is_read + replied columns to contact_submissions
ALTER TABLE contact_submissions
    ADD COLUMN IF NOT EXISTS is_read     BOOLEAN   DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS replied_at  TIMESTAMP DEFAULT NULL;

-- 2. Add status column to service_applications
ALTER TABLE service_applications
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'new'
        CHECK (status IN ('new','reviewed','accepted','rejected'));

-- 3. Page views analytics table
CREATE TABLE IF NOT EXISTS page_views (
    view_id     SERIAL PRIMARY KEY,
    page_path   VARCHAR(500) NOT NULL,
    session_id  VARCHAR(100),
    referrer    VARCHAR(500),
    device_type VARCHAR(20),   -- 'mobile' | 'tablet' | 'desktop'
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_path       ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);

-- 4. Admin activity log
CREATE TABLE IF NOT EXISTS admin_logs (
    log_id     SERIAL PRIMARY KEY,
    action     VARCHAR(100) NOT NULL,
    details    TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Done
SELECT 'Migration complete' AS status;
