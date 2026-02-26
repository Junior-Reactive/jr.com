const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database configuration
const dbConfig = {
    user: "JR",
    password: "0000",
    server: "localhost",
    database: "JRWebsite",
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

// ============ SWAGGER CONFIGURATION ============

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Junior Reactive API",
            version: "1.0.0",
            description: "RESTful API for Junior Reactive - AI and IT Solutions Provider",
            contact: {
                name: "Junior Reactive",
                email: "juniorreactive@gmail.com",
                url: "http://localhost:5000"
            },
            license: {
                name: "Private",
                url: "https://juniorreactive.com"
            }
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Development Server"
            },
            {
                url: "https://api.juniorreactive.com",
                description: "Production Server"
            }
        ],
        tags: [
            { name: "Health", description: "API Health Check endpoints" },
            { name: "Services", description: "Service management endpoints" },
            { name: "Blog", description: "Blog post management endpoints" },
            { name: "Portfolio", description: "Portfolio project endpoints" },
            { name: "Team", description: "Team member endpoints" },
            { name: "FAQs", description: "FAQ management endpoints" },
            { name: "Contact", description: "Contact form submission endpoints" },
            { name: "Applications", description: "Service application endpoints" }
        ],
        components: {
            schemas: {
                Service: {
                    type: "object",
                    properties: {
                        id: { type: "integer", description: "Service ID" },
                        key: { type: "string", description: "Unique service key" },
                        title: { type: "string", description: "Service title" },
                        shortDescription: { type: "string", description: "Brief description" },
                        fullDescription: { type: "string", description: "Detailed description" },
                        icon: { type: "string", description: "Service icon emoji" }
                    }
                },
                BlogPost: {
                    type: "object",
                    properties: {
                        id: { type: "integer", description: "Post ID" },
                        slug: { type: "string", description: "URL-friendly slug" },
                        title: { type: "string", description: "Post title" },
                        excerpt: { type: "string", description: "Short excerpt" },
                        content: { type: "string", description: "Full content" },
                        author: { type: "string", description: "Author name" },
                        publishDate: { type: "string", format: "date", description: "Publish date" },
                        formattedDate: { type: "string", description: "Formatted date string" }
                    }
                },
                PortfolioProject: {
                    type: "object",
                    properties: {
                        id: { type: "integer", description: "Project ID" },
                        slug: { type: "string", description: "URL-friendly slug" },
                        title: { type: "string", description: "Project title" },
                        category: { type: "string", description: "Project category" },
                        description: { type: "string", description: "Project description" },
                        image: { type: "string", description: "Image filename" }
                    }
                },
                TeamMember: {
                    type: "object",
                    properties: {
                        id: { type: "integer", description: "Member ID" },
                        name: { type: "string", description: "Member name" },
                        position: { type: "string", description: "Job position" },
                        bio: { type: "string", description: "Biography" },
                        image: { type: "string", description: "Image filename" }
                    }
                },
                FAQ: {
                    type: "object",
                    properties: {
                        id: { type: "integer", description: "FAQ ID" },
                        question: { type: "string", description: "FAQ question" },
                        answer: { type: "string", description: "FAQ answer" }
                    }
                },
                ContactSubmission: {
                    type: "object",
                    required: ["name", "email", "subject", "message"],
                    properties: {
                        name: { type: "string", description: "Full name" },
                        email: { type: "string", format: "email", description: "Email address" },
                        subject: { type: "string", description: "Message subject" },
                        message: { type: "string", description: "Message content" }
                    }
                },
                ApplicationSubmission: {
                    type: "object",
                    required: ["name", "email", "service_type", "requirements"],
                    properties: {
                        company: { type: "string", description: "Company name" },
                        name: { type: "string", description: "Contact person name" },
                        email: { type: "string", format: "email", description: "Email address" },
                        phone: { type: "string", description: "Phone number" },
                        service_type: { type: "string", description: "Type of service interested in" },
                        requirements: { type: "string", description: "Project requirements" }
                    }
                },
                Error: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", default: false },
                        error: { type: "string", description: "Error message" }
                    }
                },
                Success: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", default: true },
                        message: { type: "string", description: "Success message" },
                        id: { type: "integer", description: "Created record ID" }
                    }
                }
            },
            responses: {
                NotFound: {
                    description: "Resource not found",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" }
                        }
                    }
                },
                BadRequest: {
                    description: "Invalid input",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" }
                        }
                    }
                },
                ServerError: {
                    description: "Server error",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Error" }
                        }
                    }
                }
            }
        }
    },
    apis: [__filename], // This file contains the JSDoc comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Junior Reactive API Documentation",
    customfavIcon: "https://juniorreactive.com/favicon.ico"
}));

// Serve JSON version of Swagger spec
app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

// ============ DATABASE CONNECTION POOL ============
let pool;
async function getPool() {
    if (!pool) {
        pool = await sql.connect(dbConfig);
    }
    return pool;
}

// ============ API ENDPOINTS WITH SWAGGER DOCS ============

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API and database health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 message:
 *                   type: string
 *                   example: "Server is running"
 *                 database:
 *                   type: string
 *                   example: "Connected"
 *       500:
 *         description: Database connection failed
 *         $ref: '#/components/responses/ServerError'
 */
app.get("/api/health", async (req, res) => {
    try {
        const pool = await getPool();
        await pool.request().query("SELECT 1");
        res.json({ 
            status: "OK", 
            message: "Server is running",
            database: "Connected",
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({ 
            status: "Error", 
            message: "Database connection failed",
            error: err.message 
        });
    }
});

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of services
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
app.get("/api/services", async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT 
                ServiceID as id,
                ServiceKey as key,
                Title as title,
                ShortDescription as shortDescription,
                Icon as icon
            FROM Services 
            ORDER BY ServiceID
        `);
        res.json({ success: true, data: result.recordset });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get a single service by ID or key
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID or key (e.g., "1" or "ai-consulting")
 *     responses:
 *       200:
 *         description: Service details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Service'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
app.get("/api/services/:id", async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input("id", sql.NVarChar, req.params.id)
            .query(`
                SELECT 
                    ServiceID as id,
                    ServiceKey as key,
                    Title as title,
                    ShortDescription as shortDescription,
                    FullDescription as fullDescription,
                    Icon as icon
                FROM Services 
                WHERE ServiceKey = @id OR ServiceID = @id
            `);
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, error: "Service not found" });
        }
        
        res.json({ success: true, data: result.recordset[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/blog:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: List of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogPost'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
app.get("/api/blog", async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT 
                PostID as id,
                Slug as slug,
                Title as title,
                Excerpt as excerpt,
                Author as author,
                PublishDate as publishDate,
                FORMAT(PublishDate, 'MMMM dd, yyyy') as formattedDate
            FROM BlogPosts 
            ORDER BY PublishDate DESC
        `);
        res.json({ success: true, data: result.recordset });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/blog/{slug}:
 *   get:
 *     summary: Get a single blog post by slug
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post slug (e.g., "future-of-ai")
 *     responses:
 *       200:
 *         description: Blog post details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/BlogPost'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
app.get("/api/blog/:slug", async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input("slug", sql.NVarChar, req.params.slug)
            .query(`
                SELECT 
                    PostID as id,
                    Slug as slug,
                    Title as title,
                    Excerpt as excerpt,
                    Content as content,
                    Author as author,
                    PublishDate as publishDate,
                    FORMAT(PublishDate, 'MMMM dd, yyyy') as formattedDate
                FROM BlogPosts 
                WHERE Slug = @slug
            `);
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, error: "Blog post not found" });
        }
        
        res.json({ success: true, data: result.recordset[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/portfolio:
 *   get:
 *     summary: Get all portfolio projects
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: List of portfolio projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PortfolioProject'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
app.get("/api/portfolio", async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT 
                ProjectID as id,
                Slug as slug,
                Title as title,
                Category as category,
                Description as description,
                ImageFileName as image
            FROM PortfolioProjects 
            ORDER BY ProjectID
        `);
        res.json({ success: true, data: result.recordset });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/team:
 *   get:
 *     summary: Get all team members
 *     tags: [Team]
 *     responses:
 *       200:
 *         description: List of team members
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TeamMember'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
app.get("/api/team", async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT 
                MemberID as id,
                Name as name,
                Position as position,
                Bio as bio,
                ImageFileName as image
            FROM TeamMembers 
            ORDER BY DisplayOrder
        `);
        res.json({ success: true, data: result.recordset });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/faqs:
 *   get:
 *     summary: Get all FAQs
 *     tags: [FAQs]
 *     responses:
 *       200:
 *         description: List of FAQs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FAQ'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
app.get("/api/faqs", async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
            SELECT 
                FAQID as id,
                Question as question,
                Answer as answer
            FROM FAQs 
            ORDER BY DisplayOrder
        `);
        res.json({ success: true, data: result.recordset });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit a contact form
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactSubmission'
 *     responses:
 *       201:
 *         description: Form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                error: "All fields are required" 
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: "Invalid email format"
            });
        }
        
        const pool = await getPool();
        const result = await pool.request()
            .input("name", sql.NVarChar, name)
            .input("email", sql.NVarChar, email)
            .input("subject", sql.NVarChar, subject)
            .input("message", sql.NVarChar, message)
            .query(`
                INSERT INTO ContactSubmissions (FullName, Email, Subject, Message)
                OUTPUT INSERTED.SubmissionID as id
                VALUES (@name, @email, @subject, @message)
            `);
        
        res.status(201).json({ 
            success: true, 
            message: "Contact form submitted successfully",
            id: result.recordset[0].id
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * @swagger
 * /api/apply:
 *   post:
 *     summary: Submit a service application
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationSubmission'
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
app.post("/api/apply", async (req, res) => {
    try {
        const { company, name, email, phone, service_type, requirements } = req.body;
        
        // Validate required fields
        if (!name || !email || !service_type || !requirements) {
            return res.status(400).json({ 
                success: false, 
                error: "Name, email, service type, and requirements are required" 
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: "Invalid email format"
            });
        }
        
        const pool = await getPool();
        const result = await pool.request()
            .input("company", sql.NVarChar, company || null)
            .input("name", sql.NVarChar, name)
            .input("email", sql.NVarChar, email)
            .input("phone", sql.NVarChar, phone || null)
            .input("service_type", sql.NVarChar, service_type)
            .input("requirements", sql.NVarChar, requirements)
            .query(`
                INSERT INTO ServiceApplications (Company, ContactPerson, Email, Phone, ServiceType, Requirements)
                OUTPUT INSERTED.ApplicationID as id
                VALUES (@company, @name, @email, @phone, @service_type, @requirements)
            `);
        
        res.status(201).json({ 
            success: true, 
            message: "Application submitted successfully",
            id: result.recordset[0].id
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Handle cleanup on server shutdown
process.on("SIGINT", async () => {
    if (pool) {
        await pool.close();
        console.log("Database connection closed");
    }
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log("=".repeat(60));
    console.log("🚀 JUNIOR REACTIVE API SERVER");
    console.log("=".repeat(60));
    console.log(`📡 Server:   http://localhost:${PORT}`);
    console.log(`📚 Swagger:  http://localhost:${PORT}/api-docs`);
    console.log(`📋 JSON:     http://localhost:${PORT}/api-docs.json`);
    console.log("=".repeat(60));
    console.log("\n📌 Available Endpoints:");
    console.log("   GET  /api/health");
    console.log("   GET  /api/services");
    console.log("   GET  /api/services/:id");
    console.log("   GET  /api/blog");
    console.log("   GET  /api/blog/:slug");
    console.log("   GET  /api/portfolio");
    console.log("   GET  /api/team");
    console.log("   GET  /api/faqs");
    console.log("   POST /api/contact");
    console.log("   POST /api/apply");
    console.log("=".repeat(60));
});
