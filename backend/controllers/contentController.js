const serviceModel = require('../models/serviceModel');
const blogModel = require('../models/blogModel');
const portfolioModel = require('../models/portfolioModel');

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

module.exports = { getServices, getServiceById };