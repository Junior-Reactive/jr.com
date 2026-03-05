const { getAllServices, getServiceById } = require('../models/serviceModel');
const { getAllBlogPosts, getBlogPostBySlug } = require('../models/blogModel');
const { getAllProjects } = require('../models/portfolioModel');
const { getAllTeamMembers } = require('../models/teamModel');
const { getAllFAQs } = require('../models/faqModel');

// ── SERVICES ──────────────────────────────────────────────────
async function getServices(req, res, next) {
    try {
        const data = await getAllServices();
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

async function getServiceById(req, res, next) {
    try {
        const data = await getServiceById(req.params.id);
        if (!data) return res.status(404).json({ success: false, error: 'Service not found' });
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

// ── BLOG ──────────────────────────────────────────────────────
async function getBlogPosts(req, res, next) {
    try {
        const data = await getAllBlogPosts();
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

async function getBlogPostBySlug(req, res, next) {
    try {
        const data = await getBlogPostBySlug(req.params.slug);
        if (!data) return res.status(404).json({ success: false, error: 'Post not found' });
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

// ── PORTFOLIO ─────────────────────────────────────────────────
async function getPortfolioProjects(req, res, next) {
    try {
        const data = await getAllProjects();
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

// ── TEAM ──────────────────────────────────────────────────────
async function getTeamMembers(req, res, next) {
    try {
        const data = await getAllTeamMembers();
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

// ── FAQs ──────────────────────────────────────────────────────
async function getFAQs(req, res, next) {
    try {
        const data = await getAllFAQs();
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

module.exports = {
    getServices,
    getServiceById,
    getBlogPosts,
    getBlogPostBySlug,
    getPortfolioProjects,
    getTeamMembers,
    getFAQs,
};
