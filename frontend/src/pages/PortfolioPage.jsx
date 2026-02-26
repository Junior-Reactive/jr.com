import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import HeroSection from '../components/layout/HeroSection';

const PortfolioPage = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['portfolio'],
        queryFn: () => contentService.getPortfolioProjects(),
    });

    const projects = data?.data?.data || [];

    return (
        <main>
            <HeroSection
                title="Our Portfolio"
                subtitle="See other projects we have handled."
            />

            <section className="section">
                <div className="container">
                    <div className="services-grid">
                        {isLoading ? (
                            <p>Loading projects...</p>
                        ) : (
                            projects.map(project => (
                                <div key={project.id} className="card">
                                    <div style={{ height: 200, backgroundColor: 'var(--color-light)', marginBottom: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        Image: {project.image}
                                    </div>
                                    <span style={{ color: 'var(--color-secondary)', fontSize: '0.9rem', fontWeight: 'bold' }}>{project.category}</span>
                                    <h3>{project.title}</h3>
                                    <p>{project.description}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default PortfolioPage;