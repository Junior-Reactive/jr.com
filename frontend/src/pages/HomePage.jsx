import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { contentService } from '../services/contentService';
import HeroSection from '../components/layout/HeroSection';
import ServicesGrid from '../components/layout/ServicesGrid';

const HomePage = () => {
    const { data: servicesData, isLoading } = useQuery({
        queryKey: ['services'],
        queryFn: () => contentService.getServices(),
    });

    const services = servicesData?.data?.data || [];

    return (
        <main>
            <HeroSection
                title="AI That Works For You"
                subtitle="Empowering your business with intelligent solutions and robust IT infrastructure."
                primaryBtnText="Explore Services"
                primaryBtnLink="/services"
                secondaryBtnText="Contact Us"
                secondaryBtnLink="/contact"
            />

            <section className="section">
                <div className="container">
                    <h2>Our Core Services</h2>
                    {isLoading ? (
                        <p>Loading services...</p>
                    ) : (
                        <>
                            <ServicesGrid services={services.slice(0, 3)} />
                            <div style={{ textAlign: 'center', marginTop: 30 }}>
                                <Link to="/services" className="btn btn-outline">View All Services</Link>
                            </div>
                        </>
                    )}
                </div>
            </section>

            <section className="section" style={{ backgroundColor: 'var(--color-white)' }}>
                <div className="container">
                    <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                            <h2>Who We Are</h2>
                            <p>Junior Reactive is a premier AI and IT services provider founded by Pharrell Aaron Mugumya. We are dedicated to bridging the gap between complex technology and practical business application.</p>
                            <Link to="/about" className="btn">Meet the Team</Link>
                        </div>
                        <div style={{ flex: 1, background: 'var(--color-light)', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
                            <p style={{ color: 'var(--color-accent-1)' }}>[Image Placeholder: Team Collaboration]</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" style={{ backgroundColor: 'var(--color-accent-2)', textAlign: 'center' }}>
                <div className="container">
                    <h2>Ready to Transform Your Business?</h2>
                    <p>Join the future of industry with our tailored AI solutions.</p>
                    <Link to="/apply" className="btn">Apply for Services</Link>
                </div>
            </section>
        </main>
    );
};

export default HomePage;