import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/layout/HeroSection';

const AboutPage = () => {
    return (
        <main>
            <HeroSection
                title="About Us"
                subtitle="Building the future with intelligence and integrity."
            />

            <section className="section">
                <div className="container">
                    <h2>Our Story</h2>
                    <p>Founded by Pharrell Aaron Mugumya, Junior Reactive started with a simple mission: to make Artificial Intelligence accessible and effective for businesses of all sizes. We believe that technology should serve people, not the other way around.</p>

                    <h2>Our Values</h2>
                    <ul style={{ listStyle: 'disc', marginLeft: 20, marginBottom: 20 }}>
                        <li><strong>Innovation:</strong> Constantly pushing boundaries.</li>
                        <li><strong>Integrity:</strong> Honest and transparent dealings.</li>
                        <li><strong>Excellence:</strong> Delivering nothing but the best.</li>
                    </ul>

                    <h2>Why Choose Us?</h2>
                    <p>We combine deep technical expertise with strategic business acumen. Our team doesn't just write code; we solve problems. From the initial consultation to final deployment, we are your partners in growth.</p>
                </div>
            </section>

            <section className="section" style={{ backgroundColor: 'var(--color-white)' }}>
                <div className="container">
                    <h2>Meet the Founder</h2>
                    <div className="card" style={{ maxWidth: 400, textAlign: 'center' }}>
                        <img
                            src="/images/team/Pharrell.jpeg"
                            alt="Pharrell Aaron Mugumya"
                            style={{
                                width: '100%',
                                borderRadius: '8px',
                                marginBottom: '15px'
                            }}
                        />
                        <h3>Pharrell Aaron Mugumya</h3>
                        <p><strong>Founder & CEO</strong></p>
                        <p>Passionate about leveraging AI to create meaningful impact.</p>
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <Link to="/team" className="btn btn-outline">View Full Team</Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AboutPage;
