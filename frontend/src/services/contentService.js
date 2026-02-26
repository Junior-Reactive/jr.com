import api from './api';

export const contentService = {
    // Services
    getServices: () => api.get('/services'),
    getServiceById: (id) => api.get(`/services/${id}`),

    // Blog
    getBlogPosts: () => api.get('/blog'),
    getBlogPostBySlug: (slug) => api.get(`/blog/${slug}`),

    // Portfolio
    getPortfolioProjects: () => api.get('/portfolio'),

    // Team
    getTeamMembers: () => api.get('/team'),

    // FAQs
    getFAQs: () => api.get('/faqs'),
};