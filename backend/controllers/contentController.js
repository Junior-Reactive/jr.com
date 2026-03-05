const serviceModel   = require('../models/serviceModel');
const blogModel      = require('../models/blogModel');
const portfolioModel = require('../models/portfolioModel');
const teamModel      = require('../models/teamModel');
const faqModel       = require('../models/faqModel');

// ── SERVICES ──────────────────────────────────────────────────
async function getServices(req, res, next) {
    try {
        const data = await serviceModel.getAllServices();
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

async function getServiceById(req, res, next) {
    try {
        const data = await serviceModel.getServiceById(req.params.id);
        if (!data) return res.status(404).json({ success: false, error: 'Service not found' });
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

// ── BLOG ──────────────────────────────────────────────────────
async function getBlogPosts(req, res, next) {
    try {
        const data = await blogModel.getAllBlogPosts();
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

async function getBlogPostBySlug(req, res, next) {
    try {
        const data = await blogModel.getBlogPostBySlug(req.params.slug);
        if (!data) return res.status(404).json({ success: false, error: 'Post not found' });
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

// ── PORTFOLIO ─────────────────────────────────────────────────
async function getPortfolioProjects(req, res, next) {
    try {
        const data = await portfolioModel.getAllProjects();
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

// ── TEAM ──────────────────────────────────────────────────────
async function getTeamMembers(req, res, next) {
    try {
        const data = await teamModel.getAllTeamMembers();
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

// ── FAQs ──────────────────────────────────────────────────────
async function getFAQs(req, res, next) {
    try {
        const data = await faqModel.getAllFAQs();
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
