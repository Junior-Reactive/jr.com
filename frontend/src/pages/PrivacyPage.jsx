import React from 'react';
import HeroSection from '../components/layout/HeroSection';

const PrivacyPage = () => {
    return (
        <main>
            <HeroSection
                title="Privacy Policy"
                subtitle="How we handle your data."
            />

            <section className="section">
                <div className="container">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Information Collection</h3>
                    <p>We collect information you provide directly to us when you fill out a form or communicate with us.</p>

                    <h3>2. Use of Information</h3>
                    <p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you.</p>

                    <h3>3. Contact Us</h3>
                    <p>If you have any questions about this Privacy Policy, please contact us at juniorreactive@gmail.com.</p>
                </div>
            </section>
        </main>
    );
};

export default PrivacyPage;