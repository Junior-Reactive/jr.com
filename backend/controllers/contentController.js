const serviceModel = require('../models/serviceModel');
const blogModel = require('../models/blogModel');
const portfolioModel = require('../models/portfolioModel');
const teamModel = require('../models/teamModel');
const faqModel = require('../models/faqModel');

async function getServices(req, res, next) {
    try {
        const services = await serviceModel.getAllServices();
        res.json({ success: true, data: services });
    } catch (err) {
        next(err);
    }
}

async function getServiceById(req, res, next) {
    try {
        const service = await serviceModel.getServiceById(req.params.id);
        if (!service) {
            return res.status(404).json({ success: false, error: 'Service not found' });
        }
        res.json({ success: true, data: service });
    } catch (err) {
        next(err);
    }
}

async function getBlogPosts(req, res, next) {
    try {
        const posts = await blogModel.getAllPosts();
        res.json({ success: true, data: posts });
    } catch (err) {
        next(err);
    }
}

async function getBlogPostBySlug(req, res, next) {
    try {
        const post = await blogModel.getPostBySlug(req.params.slug);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Blog post not found' });
        }
        res.json({ success: true, data: post });
    } catch (err) {
        next(err);
    }
}

async function getPortfolioProjects(req, res, next) {
    try {
        const projects = await portfolioModel.getAllProjects();
        res.json({ success: true, data: projects });
    } catch (err) {
        next(err);
    }
}

async function getTeamMembers(req, res, next) {
    try {
        const members = await teamModel.getAllMembers();
        res.json({ success: true, data: members });
    } catch (err) {
        next(err);
    }
}

async function getFAQs(req, res, next) {
    try {
        const faqs = await faqModel.getAllFAQs();
        res.json({ success: true, data: faqs });
    } catch (err) {
        next(err);
    }
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
