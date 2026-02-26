import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import HeroSection from '../components/layout/HeroSection';

const TeamPage = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['team'],
        queryFn: () => contentService.getTeamMembers(),
    });

    const members = data?.data?.data || [];

    if (isLoading) {
        return (
            <main>
                <HeroSection
                    title="Our Team"
                    subtitle="The minds behind Junior Reactive."
                />
                <section className="section">
                    <div className="container" style={{ textAlign: 'center' }}>
                        <div className="loading-spinner"></div>
                        <p>Loading team members...</p>
                        <p style={{ color: 'var(--color-accent-1)', fontSize: '0.9rem', marginTop: '10px' }}>
                            If this takes too long, check that the backend is running at {process.env.REACT_APP_API_URL}
                        </p>
                    </div>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <HeroSection
                    title="Our Team"
                    subtitle="The minds behind Junior Reactive."
                />
                <section className="section">
                    <div className="container" style={{ textAlign: 'center' }}>
                        <div style={{ 
                            backgroundColor: '#f8d7da', 
                            color: '#721c24', 
                            padding: '20px', 
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}>
                            <h3>⚠️ Error Loading Team</h3>
                            <p>{error.message || 'Could not connect to the server'}</p>
                            <p>Please ensure the backend is running at: {process.env.REACT_APP_API_URL}</p>
                            <button 
                                onClick={() => refetch()} 
                                className="btn"
                                style={{ marginTop: '15px' }}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main>
            <HeroSection
                title="Our Team"
                subtitle="The minds behind Junior Reactive."
            />

            <section className="section">
                <div className="container">
                    {members.length === 0 ? (
                        <p style={{ textAlign: 'center' }}>No team members found.</p>
                    ) : (
                        <div className="services-grid">
                            {members.map(member => (
                                <div key={member.id} className="card">
                                    <div style={{ 
                                        height: 200, 
                                        backgroundColor: 'var(--color-light)', 
                                        marginBottom: 15,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '8px',
                                        overflow: 'hidden'
                                    }}>
                                        {member.image ? (
                                            <img 
                                                src={`/images/team/${member.image}`} 
                                                alt={member.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <span style={{ color: 'var(--color-accent-1)' }}>No Image</span>
                                        )}
                                    </div>
                                    <h3>{member.name}</h3>
                                    <p style={{ color: 'var(--color-secondary)' }}>{member.position}</p>
                                    <p>{member.bio}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default TeamPage;