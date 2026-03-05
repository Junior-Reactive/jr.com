const express = require('express');
const router = express.Router();
const c = require('../controllers/contentController');

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     description: Returns all 9 services offered by Junior Reactive.
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Array of services
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Service' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/services', c.getServices);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get a service by ID or key
 *     description: Retrieve a single service by its numeric ID or its string key (e.g. "n8n-automation").
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Service numeric ID or key slug
 *         examples:
 *           byKey:
 *             value: n8n-automation
 *             summary: By key
 *           byId:
 *             value: '1'
 *             summary: By ID
 *     responses:
 *       200:
 *         description: Service details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Service' }
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/services/:id', c.getServiceById);

/**
 * @swagger
 * /api/blog:
 *   get:
 *     summary: Get all blog posts
 *     description: Returns all published blog posts ordered by publish date descending.
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: Array of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/BlogPost' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/blog', c.getBlogPosts);

/**
 * @swagger
 * /api/blog/{slug}:
 *   get:
 *     summary: Get a blog post by slug
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *         example: what-is-n8n-and-why-your-business-needs-it
 *     responses:
 *       200:
 *         description: Full blog post with content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/BlogPost' }
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/blog/:slug', c.getBlogPostBySlug);

/**
 * @swagger
 * /api/portfolio:
 *   get:
 *     summary: Get all portfolio projects
 *     tags: [Portfolio]
 *     responses:
 *       200:
 *         description: Array of portfolio projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/PortfolioProject' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/portfolio', c.getPortfolioProjects);

/**
 * @swagger
 * /api/team:
 *   get:
 *     summary: Get all team members
 *     tags: [Team]
 *     responses:
 *       200:
 *         description: Array of team members ordered by DisplayOrder
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/TeamMember' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/team', c.getTeamMembers);

/**
 * @swagger
 * /api/faqs:
 *   get:
 *     summary: Get all FAQs
 *     tags: [FAQs]
 *     responses:
 *       200:
 *         description: Array of frequently asked questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/FAQ' }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/faqs', c.getFAQs);

module.exports = router;
