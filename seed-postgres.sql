-- ============================================================
--  Junior Reactive — PostgreSQL Seed Script
--  Run this in Railway's query console after creating the DB.
-- ============================================================

-- ── CREATE TABLES ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS services (
    service_id        SERIAL PRIMARY KEY,
    service_key       VARCHAR(100) UNIQUE NOT NULL,
    title             VARCHAR(200) NOT NULL,
    short_description TEXT,
    full_description  TEXT,
    icon              VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS team_members (
    member_id      SERIAL PRIMARY KEY,
    name           VARCHAR(200) NOT NULL,
    position       VARCHAR(200),
    bio            TEXT,
    image_filename VARCHAR(200),
    display_order  INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS blog_posts (
    post_id      SERIAL PRIMARY KEY,
    slug         VARCHAR(300) UNIQUE NOT NULL,
    title        VARCHAR(300) NOT NULL,
    excerpt      TEXT,
    content      TEXT,
    author       VARCHAR(200),
    publish_date DATE
);

CREATE TABLE IF NOT EXISTS portfolio_projects (
    project_id     SERIAL PRIMARY KEY,
    slug           VARCHAR(300) UNIQUE NOT NULL,
    title          VARCHAR(300) NOT NULL,
    category       VARCHAR(100),
    description    TEXT,
    image_filename VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS faqs (
    faq_id        SERIAL PRIMARY KEY,
    question      TEXT NOT NULL,
    answer        TEXT,
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS contact_submissions (
    submission_id SERIAL PRIMARY KEY,
    name          VARCHAR(200),
    email         VARCHAR(200),
    subject       VARCHAR(300),
    message       TEXT,
    submitted_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_applications (
    application_id SERIAL PRIMARY KEY,
    company        VARCHAR(200),
    name           VARCHAR(200),
    email          VARCHAR(200),
    phone          VARCHAR(50),
    service_type   VARCHAR(200),
    requirements   TEXT,
    submitted_at   TIMESTAMP DEFAULT NOW()
);

-- ── SERVICES ──────────────────────────────────────────────────
TRUNCATE services RESTART IDENTITY CASCADE;

INSERT INTO services (service_key, title, short_description, full_description, icon) VALUES
('ai-consulting','AI Consulting',
 'Strategic AI roadmaps that turn business challenges into intelligent, automated solutions.',
 'Our AI Consulting service begins with a deep-dive audit of your current operations, data assets, and business goals. We identify the highest-value AI opportunities, define a phased implementation roadmap, and guide your team through adoption. From feasibility studies to vendor selection and change management, we are your trusted AI strategy partner.','🧠'),

('custom-software','Custom Software Development',
 'Bespoke, scalable software engineered precisely around your business workflows.',
 'We design and build robust web applications, internal tools, APIs, and platforms from the ground up. Our full-stack development team follows agile methodologies — delivering working software in short cycles. Every solution is built with performance, security, and long-term maintainability in mind.','💻'),

('data-analytics','Data Analytics & Insights',
 'Transform your raw data into clear, actionable intelligence that drives confident decisions.',
 'We help organisations unlock the value hidden in their data. Our team designs end-to-end analytics pipelines — from data collection and cleaning through to interactive dashboards and executive reports. Whether you need sales forecasting, customer segmentation, or operational KPI tracking, we deliver insights that move the needle.','📊'),

('cloud-solutions','Cloud Solutions',
 'Secure, scalable cloud infrastructure designed for performance and cost-efficiency.',
 'We architect, migrate, and manage cloud environments on AWS, Azure, and Google Cloud. Our services cover cloud readiness assessments, lift-and-shift migrations, containerisation with Docker and Kubernetes, serverless architectures, and ongoing cloud cost optimisation.','☁️'),

('predictive-modeling','Predictive Modeling',
 'Custom machine learning models that forecast outcomes and surface hidden opportunities.',
 'From churn prediction and demand forecasting to fraud detection and recommendation engines, we build and deploy production-ready ML models tailored to your domain. Our data scientists deliver models that are explainable and maintainable.','🔮'),

('n8n-automation','N8N Workflow Automation',
 'Connect your tools and automate repetitive processes with powerful visual N8N workflows.',
 'We design and implement intelligent business automation using N8N — the open-source workflow automation platform. Whether you need to automate CRM updates, sync data across SaaS tools, trigger email campaigns, or build complex multi-step integrations between 400+ apps, we build workflows that run reliably 24/7.','⚡'),

('ai-awareness','AI Awareness Sessions',
 'Practical, demystifying AI training for teams who need to understand and leverage AI today.',
 'Our AI Awareness Sessions are designed for non-technical stakeholders — executives, managers, and operational teams. Sessions cover AI fundamentals, real-world use cases in your industry, ethical considerations, prompt engineering basics, and how to identify automation opportunities in your workflows.','🎓'),

('ai-courses','AI Courses & Training',
 'Structured, practical AI education programmes for individuals and corporate teams.',
 'We offer a growing catalogue of structured AI training programmes ranging from beginner to advanced. Courses cover: Introduction to AI and Machine Learning, Python for Data Science, Prompt Engineering Mastery, Building AI-Powered Applications, Data Analytics with Power BI, and Automating Business Workflows with N8N.','📚'),

('bi-dashboards','Business Intelligence Dashboards',
 'Real-time, interactive dashboards that give every stakeholder the visibility they need.',
 'We design and build custom BI dashboards using Power BI, Tableau, and web-based technologies. Our dashboards connect to your existing data sources and present metrics in clear, interactive visualisations. We specialise in executive dashboards, operational monitoring boards, and financial reporting suites.','📈');

-- ── TEAM MEMBERS ──────────────────────────────────────────────
TRUNCATE team_members RESTART IDENTITY CASCADE;

INSERT INTO team_members (name, position, bio, image_filename, display_order) VALUES
('Pharrell Aaron Mugumya','Founder & CEO',
 'Pharrell founded Junior Reactive with a mission to make cutting-edge AI accessible to businesses across East Africa. With a background in software engineering and business strategy, he leads the company vision, partnerships, and product direction.',
 'Pharrell.jpeg',1),
('David Ochieng','Head of Engineering',
 'David brings 8 years of full-stack development experience across fintech and logistics. He oversees technical architecture, code quality, and engineering team delivery.',
 'david.jpeg',2),
('Amara Nkosi','Lead Data Scientist',
 'Amara specialises in machine learning and predictive analytics. She has built production ML models for retail, healthcare, and financial services clients.',
 'amara.jpeg',3),
('Brian Ssekandi','Cloud & DevOps Engineer',
 'Brian is an AWS and Azure certified cloud architect responsible for infrastructure reliability and deployment pipelines.',
 'brian.jpeg',4),
('Grace Auma','AI Trainer & Curriculum Lead',
 'Grace designs and delivers all of Junior Reactive''s AI awareness programmes and training courses, making complex AI concepts genuinely accessible.',
 'grace.jpeg',5),
('Kevin Mutiso','N8N Automation Specialist',
 'Kevin is the team''s workflow automation expert, having built over 200 N8N automations for SMEs across East Africa.',
 'kevin.jpeg',6);

-- ── BLOG POSTS ────────────────────────────────────────────────
TRUNCATE blog_posts RESTART IDENTITY CASCADE;

INSERT INTO blog_posts (slug, title, excerpt, content, author, publish_date) VALUES
('what-is-n8n-and-why-your-business-needs-it',
 'What is N8N and Why Your Business Needs It in 2025',
 'N8N is the open-source workflow automation platform quietly transforming how small and mid-sized businesses operate.',
 'If you have ever found yourself manually copying data from one app to another, sending the same email every Monday, or spending hours on tasks that feel like they should just happen automatically — you need N8N.

N8N is an open-source, self-hostable workflow automation platform that connects your apps and services through visual, drag-and-drop workflows. Think of it like Zapier, but far more powerful, fully customisable, and something you can host on your own server so your data never leaves your control.

HOW IT WORKS

At its core, N8N works through nodes. Each node represents an action or a trigger. You connect nodes visually, define conditions and transformations, and N8N runs the workflow automatically, 24/7. It connects to over 400 apps out of the box.

WHY WE RECOMMEND IT

For most of our clients, N8N solves three categories of problem immediately: data synchronisation, notification and alert systems, and customer journey automation. We recently helped a Kampala-based logistics company automate their daily dispatch report — what previously took two staff members 90 minutes each morning now runs automatically at 6 AM.',
 'Kevin Mutiso','2025-02-10'),

('building-your-first-ai-strategy',
 'Building Your First AI Strategy: A Practical Guide for East African Businesses',
 'AI strategy does not have to be complex or expensive. Here is the straightforward framework we use with every new client.',
 'Every week, we speak to business owners who know AI is important but have no idea where to start. This post cuts through that noise with a practical, grounded framework for building your first AI strategy.

STEP 1: AUDIT YOUR OPERATIONS FOR REPETITION

The highest-value AI applications are almost always in tasks that are repetitive, rule-based, and time-consuming. Start by asking every department head what their team spends the most time on that feels manual.

STEP 2: IDENTIFY YOUR DATA ASSETS

AI is only as good as the data feeding it. Most businesses have far more data than they realise — locked in spreadsheets, email threads, and accounting systems.

STEP 3: PRIORITISE BY VALUE AND FEASIBILITY

Score each opportunity on two dimensions: potential business value and implementation feasibility. Start with the opportunities that score high on both.

STEP 4: START SMALL, PROVE IT, SCALE IT

Pick one use case, implement it properly, measure the results rigorously, and use that success to build internal confidence for the next project.',
 'Pharrell Aaron Mugumya','2025-01-22'),

('power-bi-vs-spreadsheets',
 'Power BI vs Spreadsheets: Why Your Business Has Outgrown Excel',
 'There comes a point in every growing business where Excel becomes the single biggest bottleneck to good decision-making.',
 'We are not here to argue that Excel is bad. It is an extraordinary piece of software. But there is a version of Excel use that actively harms your business.

THE WARNING SIGNS

You have outgrown spreadsheets when reports take hours to produce and are out of date the moment they are finished, when you have multiple versions of the same spreadsheet, and when leadership makes decisions based on numbers that were accurate three weeks ago.

THE POWER BI ALTERNATIVE

Microsoft Power BI connects directly to your data sources and refreshes automatically. Key advantages include live data, interactive visualisations, role-based access, and a single source of truth so everyone works from the same numbers.',
 'Amara Nkosi','2025-01-08'),

('real-cost-of-not-automating',
 'The Real Cost of Not Automating Your Business Processes',
 'Most business owners think automation is expensive. The reality is that not automating is costing them far more.',
 'Let us do some honest arithmetic. If you have one employee spending 2 hours per day on manual data entry, at an average salary of UGX 1,500,000 per month, that is approximately 40 percent of their time being spent on work that a properly configured automation could handle in seconds. Over 12 months, that is UGX 7,200,000 in salary cost for work that could be eliminated.

A mid-complexity N8N automation build covering three to five integrated workflows typically runs between UGX 2,000,000 and UGX 5,000,000 as a one-time build cost. The payback period for most clients is less than 60 days.',
 'Kevin Mutiso','2025-02-28'),

('what-to-expect-from-ai-awareness-session',
 'What to Expect From Our AI Awareness Sessions',
 'Our AI Awareness Sessions are designed to change how your team understands AI in a single day.',
 'The most common thing we hear from participants at the end of our AI Awareness Sessions is that they wish they had done it two years earlier. No buzzwords. No hype. Just clear, honest, practical information.

The morning covers AI foundations: what AI actually is and what it is not, the AI landscape today, and an honest look at Large Language Models. The afternoon covers application: AI use cases specific to your industry, a hands-on prompt engineering workshop, and building an internal AI adoption roadmap.

Each participant leaves with a personal AI toolkit and a practical 30-day action plan.',
 'Grace Auma','2025-03-01'),

('cloud-migration-guide',
 'Cloud Migration: What Every East African Business Should Know Before Moving',
 'A poorly planned cloud migration can create more problems than it solves. Here is our honest guide.',
 'The cloud is not magic. It is infrastructure — and like all infrastructure, it requires proper planning and ongoing management to deliver its promised benefits.

THE GENUINE BENEFITS

Real scalability where your infrastructure grows with your demand automatically. Cloud providers run data centres with 99.99 percent uptime guarantees and disaster recovery built in.

THE REAL RISKS TO MANAGE

Data sovereignty, unexpected cost spikes without proper monitoring, and misconfigured security settings. We start every cloud migration with a three-week discovery phase before touching a single production system.',
 'Brian Ssekandi','2025-02-15');

-- ── FAQs ──────────────────────────────────────────────────────
TRUNCATE faqs RESTART IDENTITY CASCADE;

INSERT INTO faqs (question, answer, display_order) VALUES
('What services does Junior Reactive offer?','We offer nine core services: AI Consulting, Custom Software Development, Data Analytics and Insights, Cloud Solutions, Predictive Modeling, N8N Workflow Automation, AI Awareness Sessions, AI Courses and Training, and Business Intelligence Dashboards.',1),
('How do I get started with Junior Reactive?','Fill out our Service Application form. We review every application within 24 hours and schedule a free discovery call.',2),
('Do you work with businesses outside Uganda?','Yes. We are headquartered in Kampala but work with clients across East Africa and can deliver all services fully remotely.',3),
('What is N8N and how does it relate to your services?','N8N is an open-source workflow automation platform. We build, host, and maintain N8N workflows for clients, and also train teams to manage their own automations.',4),
('How long does a typical project take?','An AI Awareness Session can be delivered in a single day. A custom automation workflow typically takes 2 to 4 weeks. A full custom software build usually runs 8 to 20 weeks.',5),
('Do you offer ongoing support after a project is delivered?','Yes. All deliverables include a handover period with documentation and training. We also offer ongoing support retainers.',6),
('How are your AI Courses structured?','Courses range from half-day workshops to multi-week programmes, all including hands-on exercises and a certificate of completion.',7),
('What does it cost to work with you?','We do not publish fixed prices. After our free discovery call we provide a detailed proposal with transparent pricing.',8),
('Is my data safe when you build systems for us?','We sign NDAs with all clients, follow data minimisation principles, and implement appropriate encryption and access controls.',9),
('Can you train my internal team alongside building the solution?','Yes — all project engagements include knowledge transfer sessions and we can embed formal training in any scope.',10);

-- ── PORTFOLIO ─────────────────────────────────────────────────
TRUNCATE portfolio_projects RESTART IDENTITY CASCADE;

INSERT INTO portfolio_projects (slug, title, category, description, image_filename) VALUES
('logistics-dispatch-automation','Logistics Dispatch Automation','N8N Automation',
 'Automated the daily dispatch reporting process for a Kampala logistics firm, eliminating 90 minutes of manual work each morning.',NULL),
('retail-sales-intelligence-dashboard','Retail Sales Intelligence Dashboard','Business Intelligence',
 'Built a real-time Power BI dashboard suite for a multi-branch retail chain, replacing 12 separate spreadsheets and saving 15 hours per week.',NULL),
('hr-onboarding-automation','HR Onboarding Automation System','N8N Automation',
 'Built a complete employee onboarding automation for a 200-person organisation — automatically creating accounts and scheduling first-week meetings.',NULL),
('customer-churn-prediction-model','Customer Churn Prediction Model','Machine Learning',
 'Developed a predictive churn model identifying at-risk customers 30 days before they churn with 78% accuracy, reducing churn by 23%.',NULL),
('agri-market-price-platform','Agricultural Market Price Platform','Custom Software',
 'Built a web platform aggregating real-time crop prices from markets across Uganda for a farmers cooperative.',NULL),
('ai-awareness-financial-services','AI Awareness Programme — Financial Services','Training',
 'Delivered a 4-session AI Awareness Programme for a microfinance institution leadership team. All 18 participants rated it 5 out of 5.',NULL);

SELECT 'Seed complete' AS status,
       (SELECT COUNT(*) FROM services)            AS services,
       (SELECT COUNT(*) FROM team_members)        AS team,
       (SELECT COUNT(*) FROM blog_posts)          AS blog,
       (SELECT COUNT(*) FROM faqs)                AS faqs,
       (SELECT COUNT(*) FROM portfolio_projects)  AS portfolio;
