import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/layout/HeroSection';

const NotFoundPage = () => {
    return (
        <main>
            <HeroSection
                title="404 - Page Not Found"
                subtitle="The page you are looking for doesn't exist or has been moved."
            />
            <section className="section" style={{ textAlign: 'center' }}>
                <Link to="/" className="btn">Go Home</Link>
            </section>
        </main>
    );
};

export default NotFoundPage;