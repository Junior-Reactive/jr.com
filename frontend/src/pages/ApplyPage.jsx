import React from 'react';
import HeroSection from '../components/layout/HeroSection';
import ApplicationForm from '../components/forms/ApplicationForm';

const ApplyPage = () => (
    <main>
        <HeroSection
            badge="Start a Project"
            title="Service Application"
            subtitle="Ready to transform your business? Fill out the form and our team will get back to you within 24 hours."
        />

        <section className="section">
            <div className="container" style={{ maxWidth: 860 }}>
                <ApplicationForm />
            </div>
        </section>
    </main>
);

export default ApplyPage;
