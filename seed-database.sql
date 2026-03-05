-- ============================================================
--  Junior Reactive — Full Database Seed
--  Run in SSMS against the JRWebsite database.
-- ============================================================
USE JRWebsite;
GO

-- ── SERVICES ─────────────────────────────────────────────────
DELETE FROM Services;
DBCC CHECKIDENT ('Services', RESEED, 0);

INSERT INTO Services (ServiceKey, Title, ShortDescription, FullDescription, Icon) VALUES
('ai-consulting','AI Consulting',
 'Strategic AI roadmaps that turn business challenges into intelligent, automated solutions.',
 'Our AI Consulting service begins with a deep-dive audit of your current operations, data assets, and business goals. We identify the highest-value AI opportunities, define a phased implementation roadmap, and guide your team through adoption. From feasibility studies to vendor selection and change management, we are your trusted AI strategy partner — ensuring every investment delivers measurable ROI.','🧠'),

('custom-software','Custom Software Development',
 'Bespoke, scalable software engineered precisely around your business workflows.',
 'We design and build robust web applications, internal tools, APIs, and platforms from the ground up. Our full-stack development team follows agile methodologies — delivering working software in short cycles, incorporating your feedback continuously. Every solution is built with performance, security, and long-term maintainability in mind.','💻'),

('data-analytics','Data Analytics & Insights',
 'Transform your raw data into clear, actionable intelligence that drives confident decisions.',
 'We help organisations unlock the value hidden in their data. Our team designs end-to-end analytics pipelines — from data collection and cleaning through to interactive dashboards and executive reports. Whether you need sales forecasting, customer segmentation, or operational KPI tracking, we deliver insights that move the needle.','📊'),

('cloud-solutions','Cloud Solutions',
 'Secure, scalable cloud infrastructure designed for performance and cost-efficiency.',
 'We architect, migrate, and manage cloud environments on AWS, Azure, and Google Cloud. Our services cover cloud readiness assessments, lift-and-shift migrations, containerisation with Docker and Kubernetes, serverless architectures, and ongoing cloud cost optimisation.','☁️'),

('predictive-modeling','Predictive Modeling',
 'Custom machine learning models that forecast outcomes and surface hidden opportunities.',
 'From churn prediction and demand forecasting to fraud detection and recommendation engines, we build and deploy production-ready ML models tailored to your domain. Our data scientists combine statistical rigour with practical engineering — delivering models that are explainable and maintainable.','🔮'),

('n8n-automation','N8N Workflow Automation',
 'Connect your tools and automate repetitive processes with powerful visual N8N workflows.',
 'We design and implement intelligent business automation using N8N — the open-source workflow automation platform. Whether you need to automate CRM updates, sync data across SaaS tools, trigger email campaigns, or build complex multi-step integrations between 400+ apps, we build workflows that run reliably 24/7. We also self-host N8N for clients who require full data sovereignty.','⚡'),

('ai-awareness','AI Awareness Sessions',
 'Practical, demystifying AI training for teams who need to understand and leverage AI today.',
 'Our AI Awareness Sessions are designed for non-technical stakeholders — executives, managers, and operational teams. Sessions cover AI fundamentals, real-world use cases in your industry, ethical considerations, prompt engineering basics, and how to identify automation opportunities in your workflows. Available as half-day, full-day, or multi-session programmes.','🎓'),

('ai-courses','AI Courses & Training',
 'Structured, practical AI education programmes for individuals and corporate teams.',
 'We offer a growing catalogue of structured AI training programmes ranging from beginner to advanced. Courses cover: Introduction to AI and Machine Learning, Python for Data Science, Prompt Engineering Mastery, Building AI-Powered Applications, Data Analytics with Power BI, and Automating Business Workflows with N8N. All courses include hands-on project work and a certificate of completion.','📚'),

('bi-dashboards','Business Intelligence Dashboards',
 'Real-time, interactive dashboards that give every stakeholder the visibility they need.',
 'We design and build custom BI dashboards using Power BI, Tableau, and web-based technologies. Our dashboards connect to your existing data sources — SQL databases, spreadsheets, CRMs, ERPs, and APIs — and present metrics in clear, interactive visualisations. We specialise in executive dashboards, operational monitoring boards, sales performance trackers, and financial reporting suites.','📈');

PRINT 'Services: 9 rows inserted';
GO

-- ── TEAM MEMBERS ─────────────────────────────────────────────
DELETE FROM TeamMembers;
DBCC CHECKIDENT ('TeamMembers', RESEED, 0);

INSERT INTO TeamMembers (Name, Position, Bio, ImageFileName, DisplayOrder) VALUES
('Pharrell Aaron Mugumya','Founder & CEO',
 'Pharrell founded Junior Reactive with a mission to make cutting-edge AI accessible to businesses across East Africa. With a background in software engineering and business strategy, he leads the company vision, partnerships, and product direction.',
 'Pharrell.jpeg',1),

('David Ochieng','Head of Engineering',
 'David brings 8 years of full-stack development experience across fintech and logistics. He oversees technical architecture, code quality, and engineering team delivery. Passionate about clean APIs and scalable systems.',
 'david.jpeg',2),

('Amara Nkosi','Lead Data Scientist',
 'Amara specialises in machine learning and predictive analytics. She has built production ML models for retail, healthcare, and financial services clients. She holds an MSc in Data Science from the University of Cape Town.',
 'amara.jpeg',3),

('Brian Ssekandi','Cloud & DevOps Engineer',
 'Brian is an AWS and Azure certified cloud architect responsible for infrastructure reliability and deployment pipelines. He ensures all client systems are secure, scalable, and cost-efficient.',
 'brian.jpeg',4),

('Grace Auma','AI Trainer & Curriculum Lead',
 'Grace designs and delivers all of Junior Reactive''s AI awareness programmes and training courses. With a background in adult education and software development, she makes complex AI concepts genuinely accessible.',
 'grace.jpeg',5),

('Kevin Mutiso','N8N Automation Specialist',
 'Kevin is the team''s workflow automation expert, having built over 200 N8N automations for SMEs across East Africa. He helps clients eliminate repetitive manual tasks and connect their entire tool stack seamlessly.',
 'kevin.jpeg',6);

PRINT 'Team members: 6 rows inserted (Sarah Jenkins removed)';
GO

-- ── BLOG POSTS ───────────────────────────────────────────────
DELETE FROM BlogPosts;
DBCC CHECKIDENT ('BlogPosts', RESEED, 0);

INSERT INTO BlogPosts (Slug, Title, Excerpt, Content, Author, PublishDate) VALUES
('what-is-n8n-and-why-your-business-needs-it',
 'What is N8N and Why Your Business Needs It in 2025',
 'N8N is the open-source workflow automation platform quietly transforming how small and mid-sized businesses operate. Here is what it is, how it works, and why we recommend it to almost every client.',
 'If you have ever found yourself manually copying data from one app to another, sending the same email every Monday, or spending hours on tasks that feel like they should just happen automatically — you need N8N.

N8N is an open-source, self-hostable workflow automation platform that connects your apps and services through visual, drag-and-drop workflows. Think of it like Zapier, but far more powerful, fully customisable, and something you can host on your own server so your data never leaves your control.

HOW IT WORKS

At its core, N8N works through nodes. Each node represents an action or a trigger. You connect nodes visually, define conditions and transformations, and N8N runs the workflow automatically, 24/7. It connects to over 400 apps out of the box: Gmail, Slack, Notion, HubSpot, WhatsApp Business, Stripe, Shopify, and many more.

WHY WE RECOMMEND IT

For most of our clients, N8N solves three categories of problem immediately: data synchronisation, notification and alert systems, and customer journey automation. We recently helped a Kampala-based logistics company automate their daily dispatch report — what previously took two staff members 90 minutes each morning now runs automatically at 6 AM and lands in the manager inbox before they arrive at the office.

SELF-HOSTING ADVANTAGES

Unlike Zapier, N8N can be self-hosted on a VPS for as little as $10 per month. For businesses handling sensitive data in finance, healthcare, or legal sectors, this is a compliance advantage, not just a cost saving. At Junior Reactive, we install, configure, and maintain N8N instances for our clients, build their initial workflows, and train their teams to add new automations independently.',
 'Kevin Mutiso','2025-02-10'),

('building-your-first-ai-strategy',
 'Building Your First AI Strategy: A Practical Guide for East African Businesses',
 'AI strategy does not have to be complex or expensive. Here is the straightforward framework we use with every new client to identify where AI creates the most value — quickly and sustainably.',
 'Every week, we speak to business owners who know AI is important but have no idea where to start. This post cuts through that noise with a practical, grounded framework for building your first AI strategy.

STEP 1: AUDIT YOUR OPERATIONS FOR REPETITION

The highest-value AI applications are almost always in tasks that are repetitive, rule-based, and time-consuming. Start by asking every department head what their team spends the most time on that feels manual. Common answers include data entry, report generation, responding to customer inquiries, scheduling, invoice processing, and inventory tracking.

STEP 2: IDENTIFY YOUR DATA ASSETS

AI is only as good as the data feeding it. Most businesses have far more data than they realise — locked in spreadsheets, email threads, accounting systems, and paper records. A data audit is always the first deliverable we produce for new AI consulting clients.

STEP 3: PRIORITISE BY VALUE AND FEASIBILITY

Score each opportunity on two dimensions: potential business value and implementation feasibility. The opportunities that score high on both are your quick wins. Start there.

STEP 4: START SMALL, PROVE IT, SCALE IT

Pick one use case, implement it properly, measure the results rigorously, and use that success to build internal confidence and momentum for the next project. Our initial AI strategy consultation is free.',
 'Pharrell Aaron Mugumya','2025-01-22'),

('power-bi-vs-spreadsheets',
 'Power BI vs Spreadsheets: Why Your Business Has Outgrown Excel',
 'Excel is a brilliant tool. But there comes a point in every growing business where it becomes the single biggest bottleneck to good decision-making.',
 'We are not here to argue that Excel is bad. It is an extraordinary piece of software. But there is a version of Excel use that actively harms your business — and millions of companies are living in it right now.

THE WARNING SIGNS

You have outgrown spreadsheets when reports take hours to produce and are out of date the moment they are finished, when you have multiple versions of the same spreadsheet with nobody sure which is correct, and when leadership makes decisions based on numbers that were accurate three weeks ago.

THE POWER BI ALTERNATIVE

Microsoft Power BI connects directly to your data sources and refreshes automatically. Key advantages include live data that is always current, interactive visualisations that let you drill from annual to daily in two clicks, role-based access so each stakeholder sees only what is relevant to them, and a single source of truth so everyone works from the same numbers.

WHAT WE DO

Our BI team designs Power BI dashboards from scratch, connected to your existing data infrastructure. A typical engagement runs 3 to 6 weeks and delivers dashboards covering finance, operations, sales, and HR. We also train your team to build and modify their own reports so you are not dependent on us forever.',
 'Amara Nkosi','2025-01-08'),

('real-cost-of-not-automating',
 'The Real Cost of Not Automating Your Business Processes',
 'Most business owners think automation is expensive. The reality is that not automating is costing them far more — in salaries, errors, and missed opportunities.',
 'Let us do some honest arithmetic. If you have one employee spending 2 hours per day on manual data entry, at an average salary of UGX 1,500,000 per month, that is approximately 40 percent of their time being spent on work that a properly configured automation could handle in seconds. Over 12 months, that is UGX 7,200,000 in salary cost for work that could be eliminated.

THE HIDDEN COSTS

Beyond direct salary cost, employee morale suffers when talented people fill their days with repetitive tasks and turnover is expensive. Manual processes create customer experience problems. And a business built on manual processes cannot grow past a certain point without proportional headcount increases.

WHAT AUTOMATION ACTUALLY COSTS

A mid-complexity N8N automation build covering three to five integrated workflows typically runs between UGX 2,000,000 and UGX 5,000,000 as a one-time build cost, plus a modest monthly hosting fee. The payback period for most clients is less than 60 days. We offer a free process audit where we identify your top three automation opportunities and estimate the ROI for each.',
 'Kevin Mutiso','2025-02-28'),

('what-to-expect-from-ai-awareness-session',
 'What to Expect From Our AI Awareness Sessions',
 'Many teams know they need to understand AI but do not know where to begin. Our AI Awareness Sessions are designed to change that in a single day.',
 'The most common thing we hear from participants at the end of our AI Awareness Sessions is that they wish they had done it two years earlier. No buzzwords. No hype. Just clear, honest, practical information about what AI is, what it can and cannot do, and how it applies to your industry and role.

WHO IS IT FOR

Our sessions are designed for non-technical stakeholders: CEOs, department heads, operations managers, marketing teams, and anyone whose job requires working with or alongside AI tools.

WHAT A FULL-DAY SESSION COVERS

The morning covers AI foundations: what AI actually is and what it is not, the AI landscape today, how AI is already embedded in tools you use daily, and an honest look at Large Language Models. The afternoon covers application: AI use cases specific to your industry, a hands-on prompt engineering workshop, identifying automation opportunities in your own workflows, and building an internal AI adoption roadmap.

Each participant leaves with a personal AI toolkit and a practical 30-day action plan.',
 'Grace Auma','2025-03-01'),

('cloud-migration-guide',
 'Cloud Migration: What Every East African Business Should Know Before Moving',
 'Cloud computing promises cost savings, scalability, and resilience. But a poorly planned migration can create more problems than it solves.',
 'The cloud is not magic. It is infrastructure — and like all infrastructure, it requires proper planning, skilled implementation, and ongoing management to deliver its promised benefits.

THE GENUINE BENEFITS

When done right, cloud migration delivers real scalability where your infrastructure grows with your demand automatically. Cloud providers run data centres with 99.99 percent uptime guarantees and disaster recovery built in. Moving from capital expenditure on servers to operational expenditure for what you use improves cash flow and makes technology costs predictable.

THE REAL RISKS TO MANAGE

Data sovereignty is a serious consideration — understand where your data will be stored geographically and whether that complies with your local regulations. Cloud costs can spiral without proper monitoring, so we always configure cost alerts and budget limits from day one. And while the cloud provider secures the infrastructure, you are responsible for configuring it correctly.

OUR APPROACH

We start every cloud migration with a three-week discovery phase: auditing your current infrastructure, mapping dependencies, assessing security requirements, and producing a detailed migration plan. Only then do we touch a single production system.',
 'Brian Ssekandi','2025-02-15');

PRINT 'Blog posts: 6 rows inserted';
GO

-- ── FAQs ─────────────────────────────────────────────────────
DELETE FROM FAQs;
DBCC CHECKIDENT ('FAQs', RESEED, 0);

INSERT INTO FAQs (Question, Answer, DisplayOrder) VALUES
('What services does Junior Reactive offer?',
 'We offer nine core services: AI Consulting, Custom Software Development, Data Analytics and Insights, Cloud Solutions, Predictive Modeling, N8N Workflow Automation, AI Awareness Sessions, AI Courses and Training, and Business Intelligence Dashboards. Most client engagements combine two or more of these.',1),
('How do I get started with Junior Reactive?',
 'Fill out our Service Application form — describe your business, what challenges you are facing, and what you are hoping to achieve. We review every application within 24 hours and schedule a free discovery call to explore whether we are the right fit.',2),
('Do you work with businesses outside Uganda?',
 'Yes. While we are headquartered in Kampala, we work with clients across East Africa and have delivered projects for organisations in Kenya, Tanzania, Rwanda, and South Africa. All our services can be delivered fully remotely.',3),
('What is N8N and how does it relate to your services?',
 'N8N is an open-source workflow automation platform — similar to Zapier but more powerful and self-hostable. We use N8N to automate repetitive business processes: syncing data between apps, triggering notifications, processing forms, and connecting your entire tool stack. We build, host, and maintain N8N workflows for clients, and we also train teams to manage their own automations.',4),
('How long does a typical project take?',
 'It depends on scope. An AI Awareness Session can be delivered in a single day. A custom automation workflow typically takes 2 to 4 weeks. A full custom software build or cloud migration usually runs 8 to 20 weeks. We provide detailed timelines after the discovery phase.',5),
('Do you offer ongoing support after a project is delivered?',
 'Yes. All deliverables include a handover period with documentation and training. We also offer ongoing support retainers for clients who want continued access to our team for maintenance, updates, and new feature development.',6),
('How are your AI Courses structured?',
 'Our courses range from half-day awareness workshops to multi-week structured programmes. All include hands-on exercises, real-world case studies, and a certificate of completion. Corporate packages include customisation for your industry and role.',7),
('What does it cost to work with you?',
 'We do not publish fixed prices because every engagement is scoped individually. After our free discovery call, we provide a detailed proposal with clear, transparent pricing and flexible payment structures for longer engagements.',8),
('Is my data safe when you build systems for us?',
 'Absolutely. We sign NDAs with all clients, follow data minimisation principles, and implement appropriate encryption, access controls, and audit logging in all systems we build. For cloud projects, we configure security from day one.',9),
('Can you train my internal team alongside building the solution?',
 'Yes — we encourage it. All our project engagements include knowledge transfer sessions, and we can embed formal training as a deliverable in any project scope.',10);

PRINT 'FAQs: 10 rows inserted';
GO

-- ── PORTFOLIO ────────────────────────────────────────────────
DELETE FROM PortfolioProjects;
DBCC CHECKIDENT ('PortfolioProjects', RESEED, 0);

INSERT INTO PortfolioProjects (Slug, Title, Category, Description, ImageFileName) VALUES
('logistics-dispatch-automation','Logistics Dispatch Automation','N8N Automation',
 'Automated the daily dispatch reporting process for a Kampala logistics firm — eliminating 90 minutes of manual work each morning. The N8N workflow pulls live data from their fleet management system and delivers formatted reports via email and WhatsApp at 6 AM daily.',NULL),
('retail-sales-intelligence-dashboard','Retail Sales Intelligence Dashboard','Business Intelligence',
 'Designed and built a real-time Power BI dashboard suite for a multi-branch retail chain across Uganda, replacing 12 separate spreadsheets and saving the finance team 15 hours per week.',NULL),
('hr-onboarding-automation','HR Onboarding Automation System','N8N Automation',
 'Built a complete employee onboarding automation for a 200-person organisation — automatically creating accounts, sending welcome communications, and scheduling first-week meetings when HR adds a new hire.',NULL),
('customer-churn-prediction-model','Customer Churn Prediction Model','Machine Learning',
 'Developed a predictive churn model for a SaaS company identifying at-risk customers 30 days before they churn with 78% accuracy, reducing churn by 23% within six months of deployment.',NULL),
('agri-market-price-platform','Agricultural Market Price Platform','Custom Software',
 'Built a web platform aggregating real-time crop prices from markets across Uganda for a farmers cooperative, helping farmers negotiate better prices through live market data.',NULL),
('ai-awareness-financial-services','AI Awareness Programme — Financial Services','Training',
 'Delivered a 4-session AI Awareness Programme for the senior leadership team of a Kampala-based microfinance institution. All 18 participants rated the programme 5 out of 5.',NULL);

PRINT 'Portfolio: 6 rows inserted';
PRINT '';
PRINT '====================================================';
PRINT ' Seed complete. Services:9  Team:6  Blog:6  FAQ:10';
PRINT '====================================================';
GO
