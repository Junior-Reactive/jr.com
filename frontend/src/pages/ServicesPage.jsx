import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { contentService } from '../services/contentService';
import HeroSection from '../components/layout/HeroSection';
import ServicesGrid from '../components/layout/ServicesGrid';

const ServicesPage = () => {
    const { data: servicesData, isLoading } = useQuery({
        queryKey: ['services'],
        queryFn: () => contentService.getServices(),
    });

    const services = servicesData?.data?.data || [];

    return (
        <main>
            <HeroSection
                title="Our Services"
                subtitle="Comprehensive AI and IT solutions tailored for you."
            />

            <section className="section">
                <div className="container">
                    {isLoading ? (
                        <p>Loading services...</p>
                    ) : (
                        <ServicesGrid services={services} />
                    )}
                </div>
            </section>

            <section className="section" style={{ backgroundColor: 'var(--color-white)', textAlign: 'center' }}>
                <div className="container">
                    <h2>Need a Custom Solution?</h2>
                    <p>We understand that every business is unique. Let's discuss your specific needs.</p>
                    <Link to="/apply" className="btn">Get in Touch</Link>
                </div>
            </section>
        </main>
    );
};

export default ServicesPage;