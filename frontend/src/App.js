import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './assets/css/global.css';

// Common components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Chatbot from './components/Chatbot';           // ← updated path (new AI chatbot)

// Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ApplyPage from './pages/ApplyPage';
import PortfolioPage from './pages/PortfolioPage';
import TeamPage from './pages/TeamPage';
import FAQPage from './pages/FAQPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';
import AIToolsPage from './pages/AIToolsPage';        // ← ADDED

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Header />
                <Routes>
                    <Route path="/"            element={<HomePage />} />
                    <Route path="/services"    element={<ServicesPage />} />
                    <Route path="/services/:id" element={<ServiceDetailPage />} />
                    <Route path="/blog"        element={<BlogPage />} />
                    <Route path="/blog/:slug"  element={<BlogPostPage />} />
                    <Route path="/about"       element={<AboutPage />} />
                    <Route path="/contact"     element={<ContactPage />} />
                    <Route path="/apply"       element={<ApplyPage />} />
                    <Route path="/portfolio"   element={<PortfolioPage />} />
                    <Route path="/team"        element={<TeamPage />} />
                    <Route path="/faq"         element={<FAQPage />} />
                    <Route path="/ai-tools"    element={<AIToolsPage />} />   {/* ← ADDED */}
                    <Route path="/terms"       element={<TermsPage />} />
                    <Route path="/privacy"     element={<PrivacyPage />} />
                    <Route path="*"            element={<NotFoundPage />} />
                </Routes>
                <Footer />
                <Chatbot />
            </Router>
        </QueryClientProvider>
    );
}

export default App;