const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const { connectDB, getPool } = require('./config/db');
const contentRoutes    = require('./routes/contentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const errorHandler     = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5005;

// ── TRUST PROXY (required on Render / any reverse proxy) ──────
app.set('trust proxy', 1);

// ── CORS ──────────────────────────────────────────────────────
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const allowed = [
            'http://localhost:3000',
            'http://localhost:3001',
            process.env.FRONTEND_URL,
        ].filter(Boolean);
        if (allowed.includes(origin)) return callback(null, true);
        // Allow all vercel.app preview URLs automatically
        if (origin.endsWith('.vercel.app')) return callback(null, true);
        callback(new Error(`CORS: ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc:  ["'self'", "'unsafe-inline'", 'unpkg.com', 'cdn.jsdelivr.net'],
            styleSrc:   ["'self'", "'unsafe-inline'", 'unpkg.com', 'cdn.jsdelivr.net'],
            imgSrc:     ["'self'", 'data:', 'validator.swagger.io'],
            workerSrc:  ["'self'", 'blob:'],
            connectSrc: ["'self'"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── RATE LIMITING ─────────────────────────────────────────────
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

// ── SWAGGER ───────────────────────────────────────────────────
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Junior Reactive API',
            version: '2.0.0',
            description: 'Full API documentation for the Junior Reactive website backend.',
            contact: { name: 'Junior Reactive', email: 'juniorreactive@gmail.com' },
        },
        servers: [
            { url: 'https://jr-backend-1edu.onrender.com', description: 'Production' },
            { url: 'http://localhost:5005',                description: 'Development' },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'Junior Reactive API Docs',
}));

// ── HEALTH CHECK ──────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
    try {
        const pool = getPool();
        await pool.query('SELECT 1');          // pg syntax — not mssql
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

// ── ROUTES ────────────────────────────────────────────────────
app.use('/api', contentRoutes);
app.use('/api', submissionRoutes);

app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, error: `Endpoint not found: ${req.method} ${req.path}` });
});

// ── ERROR HANDLER ─────────────────────────────────────────────
app.use(errorHandler);

// ── START ─────────────────────────────────────────────────────
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
