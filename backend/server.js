const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const { connectDB, getPool } = require('./config/db');
const contentRoutes = require('./routes/contentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = 5005;

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, Swagger UI)
        if (!origin) return callback(null, true);
        const allowed = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5005',
            'https://juniorreactive.com',
            'https://www.juniorreactive.com',
            process.env.FRONTEND_URL,
        ].filter(Boolean);
        if (allowed.includes(origin)) return callback(null, true);
        // Allow all Vercel preview and production deployments automatically
        if (origin.endsWith('.vercel.app')) return callback(null, true);
        callback(new Error(`CORS: ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Must come BEFORE helmet so Swagger UI CSP works
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'unpkg.com', 'cdn.jsdelivr.net'],
            styleSrc: ["'self'", "'unsafe-inline'", 'unpkg.com', 'cdn.jsdelivr.net'],
            imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
            workerSrc: ["'self'", 'blob:'],
            connectSrc: ["'self'"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── RATE LIMITING ────────────────────────────────────────────────────────────
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many requests. Please try again later.' },
});

const submissionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many submissions. Please try again in an hour.' },
});

app.use('/api/', generalLimiter);
app.use('/api/contact', submissionLimiter);
app.use('/api/apply', submissionLimiter);

// ─── SWAGGER ──────────────────────────────────────────────────────────────────
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Junior Reactive API',
            version: '2.0.0',
            description: `## Junior Reactive REST API

Full API documentation for the Junior Reactive website backend.

**Base URL (Development):** \`http://localhost:5005\`

### Authentication
Currently all GET endpoints are public. POST endpoints are rate-limited to prevent spam.

### Response Format
All responses follow this envelope:
\`\`\`json
{
  "success": true,
  "data": { ... }
}
\`\`\`
Errors return:
\`\`\`json
{
  "success": false,
  "error": "Description of what went wrong"
}
\`\`\``,
            contact: {
                name: 'Junior Reactive',
                email: 'juniorreactive@gmail.com',
                url: 'https://juniorreactive.com',
            },
            license: { name: 'Proprietary', url: 'https://juniorreactive.com/terms' },
        },
        servers: [
            { url: 'http://localhost:5005', description: 'Development Server' },
            { url: 'https://api.juniorreactive.com', description: 'Production Server' },
        ],
        tags: [
            { name: 'Health', description: 'Server and database health check' },
            { name: 'Services', description: 'Service catalogue — 9 services available' },
            { name: 'Blog', description: 'Blog posts and articles' },
            { name: 'Portfolio', description: 'Portfolio projects showcase' },
            { name: 'Team', description: 'Team member profiles' },
            { name: 'FAQs', description: 'Frequently asked questions' },
            { name: 'Contact', description: 'Contact form submissions' },
            { name: 'Applications', description: 'Service application submissions' },
        ],
        components: {
            schemas: {
                Service: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        key: { type: 'string', example: 'ai-consulting' },
                        title: { type: 'string', example: 'AI Consulting' },
                        shortDescription: { type: 'string', example: 'Strategic AI roadmaps for your business.' },
                        fullDescription: { type: 'string', example: 'Our AI Consulting service begins with a deep-dive audit...' },
                        icon: { type: 'string', example: '🧠' },
                    },
                },
                BlogPost: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        slug: { type: 'string', example: 'what-is-n8n-and-why-your-business-needs-it' },
                        title: { type: 'string', example: 'What is N8N and Why Your Business Needs It' },
                        excerpt: { type: 'string' },
                        content: { type: 'string' },
                        author: { type: 'string', example: 'Kevin Mutiso' },
                        publishDate: { type: 'string', format: 'date', example: '2025-02-10' },
                        formattedDate: { type: 'string', example: 'February 10, 2025' },
                    },
                },
                PortfolioProject: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        slug: { type: 'string', example: 'logistics-dispatch-automation' },
                        title: { type: 'string', example: 'Logistics Dispatch Automation' },
                        category: { type: 'string', example: 'N8N Automation' },
                        description: { type: 'string' },
                        image: { type: 'string', nullable: true, example: null },
                    },
                },
                TeamMember: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Pharrell Aaron Mugumya' },
                        position: { type: 'string', example: 'Founder & CEO' },
                        bio: { type: 'string' },
                        image: { type: 'string', nullable: true, example: 'Pharrell.jpeg' },
                    },
                },
                FAQ: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        question: { type: 'string', example: 'What services does Junior Reactive offer?' },
                        answer: { type: 'string' },
                    },
                },
                ContactSubmission: {
                    type: 'object',
                    required: ['name', 'email', 'subject', 'message'],
                    properties: {
                        name: { type: 'string', example: 'Jane Doe', description: 'Full name of the sender' },
                        email: { type: 'string', format: 'email', example: 'jane@company.com' },
                        subject: { type: 'string', example: 'Partnership Inquiry' },
                        message: { type: 'string', example: 'Hello, I would like to discuss a potential project...' },
                    },
                },
                ApplicationSubmission: {
                    type: 'object',
                    required: ['name', 'email', 'service_type', 'requirements'],
                    properties: {
                        company: { type: 'string', example: 'Acme Ltd', description: 'Optional company name' },
                        name: { type: 'string', example: 'John Smith', description: 'Contact person full name' },
                        email: { type: 'string', format: 'email', example: 'john@acme.com' },
                        phone: { type: 'string', example: '+256 764 524 816', description: 'Optional phone number' },
                        service_type: { type: 'string', example: 'N8N Workflow Automation', description: 'Service being applied for' },
                        requirements: { type: 'string', example: 'We need to automate our invoice processing workflow...' },
                    },
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: { type: 'object', description: 'The response payload' },
                    },
                },
                SuccessListResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: { type: 'array', items: { type: 'object' } },
                    },
                },
                SubmitResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Your message has been received.' },
                        id: { type: 'integer', example: 42 },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: { type: 'string', example: 'Resource not found' },
                    },
                },
            },
            responses: {
                NotFound: {
                    description: 'Resource not found',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                },
                BadRequest: {
                    description: 'Validation error — check your request body',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                },
                TooManyRequests: {
                    description: 'Rate limit exceeded',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                },
                ServerError: {
                    description: 'Internal server error',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                },
            },
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: `
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info { margin: 30px 0; }
        .swagger-ui .info .title { font-size: 2em; color: #1c265e; }
        .swagger-ui .scheme-container { background: #f8f9ff; padding: 16px; border-radius: 8px; }
        .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #1c265e; }
        .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #5269c3; }
        .swagger-ui .btn.execute { background: #5269c3; border-color: #5269c3; }
        .swagger-ui .btn.execute:hover { background: #1c265e; border-color: #1c265e; }
    `,
    customSiteTitle: 'Junior Reactive API Docs',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'list',
        filter: true,
        showExtensions: true,
        tryItOutEnabled: true,
    },
}));

app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Verify the API server and SQL Server database are both running.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API and database are healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: OK }
 *                 database: { type: string, example: Connected }
 *                 timestamp: { type: string, format: date-time }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
app.get('/api/health', async (req, res) => {
    try {
        const pool = getPool();
        await pool.request().query('SELECT 1 AS ping');
        res.json({
            status: 'OK',
            message: 'Junior Reactive API is running',
            database: 'Connected',
            port: PORT,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        res.status(500).json({
            status: 'Error',
            database: 'Disconnected',
            error: err.message,
        });
    }
});

// ─── API ROUTES ───────────────────────────────────────────────────────────────
app.use('/api', contentRoutes);
app.use('/api', submissionRoutes);

// Catch unmatched /api/* routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, error: `Endpoint not found: ${req.method} ${req.path}` });
});

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── GRACEFUL SHUTDOWN ────────────────────────────────────────────────────────
process.on('SIGINT', async () => {
    console.log('\n Shutting down gracefully...');
    try { const pool = getPool(); await pool.close(); } catch (_) {}
    process.exit(0);
});

// ─── START ────────────────────────────────────────────────────────────────────
(async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log('='.repeat(60));
        console.log('  JUNIOR REACTIVE API SERVER');
        console.log('='.repeat(60));
        console.log(`  API:     http://localhost:${PORT}/api`);
        console.log(`  Swagger: http://localhost:${PORT}/api-docs`);
        console.log(`  Health:  http://localhost:${PORT}/api/health`);
        console.log('='.repeat(60));
    });
})();
