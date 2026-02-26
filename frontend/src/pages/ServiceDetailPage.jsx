import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import HeroSection from '../components/layout/HeroSection';

const ServiceDetailPage = () => {
    const { id } = useParams();
    const { data, isLoading, error } = useQuery({
        queryKey: ['service', id],
        queryFn: () => contentService.getServiceById(id),
    });

    const service = data?.data?.data;

    if (isLoading) return <div className="container section">Loading...</div>;
    if (error || !service) return (
        <div className="container section">
            <h2>Service Not Found</h2>
            <Link to="/services" className="btn">Back to Services</Link>
        </div>
    );

    return (
        <main>
            <HeroSection
                title={service.title}
                subtitle={service.shortDescription}
            />

            <section className="section">
                <div className="container">
                    <div style={{ background: 'white', padding: 30, borderRadius: 8, boxShadow: 'var(--shadow-card)' }}>
                        <h2>Service Overview</h2>
                        <p>{service.fullDescription}</p>

                        <h3 style={{ marginTop: 30 }}>Key Benefits</h3>
                        <ul style={{ listStyle: 'disc', marginLeft: 20 }}>
                            <li>Professional expertise</li>
                            <li>Scalable solutions</li>
                            <li>24/7 Support availability</li>
                        </ul>

                        <div style={{ marginTop: 40 }}>
                            <Link to={`/apply?service=${service.title}`} className="btn">Apply for this Service</Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ServiceDetailPage;