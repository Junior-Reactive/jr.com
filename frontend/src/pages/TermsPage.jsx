import React from 'react';
import HeroSection from '../components/layout/HeroSection';

const TermsPage = () => {
    return (
        <main>
            <HeroSection
                title="Terms of Service"
                subtitle="Please read these terms carefully."
            />

            <section className="section">
                <div className="container">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Acceptance of Terms</h3>
                    <p>By accessing our website, you agree to be bound by these Terms of Service.</p>

                    <h3>2. Use of Services</h3>
                    <p>You agree to use our services only for lawful purposes and in accordance with these Terms.</p>
                </div>
            </section>
        </main>
    );
};

export default TermsPage;