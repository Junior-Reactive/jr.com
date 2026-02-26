import React from 'react';
import HeroSection from '../components/layout/HeroSection';
import ContactForm from '../components/forms/ContactForm';

const ContactPage = () => {
    return (
        <main>
            <HeroSection
                title="Contact Us"
                subtitle="We'd love to hear from you. Get in touch today."
            />

            <section className="section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                        <div>
                            <h2>Get in Touch</h2>
                            <p>Have a question or want to discuss a project? Fill out the form or use our contact details below.</p>

                            <div style={{ marginTop: 30 }}>
                                <p><strong>Phone:</strong> +256 764524816</p>
                                <p><strong>Email:</strong> juniorreactive@gmail.com</p>
                                <p><strong>Address:</strong> Kampala, Uganda</p>
                            </div>
                        </div>

                        <ContactForm />
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ContactPage;