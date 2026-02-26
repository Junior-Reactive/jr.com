import React from 'react';
import HeroSection from '../components/layout/HeroSection';
import ApplicationForm from '../components/forms/ApplicationForm';

const ApplyPage = () => {
    return (
        <main>
            <HeroSection
                title="Service Application"
                subtitle="Ready to start? Fill out the form below to apply for our services."
            />

            <section className="section">
                <div className="container" style={{ maxWidth: 800 }}>
                    <ApplicationForm />
                </div>
            </section>
        </main>
    );
};

export default ApplyPage;