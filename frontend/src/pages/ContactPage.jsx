import React from 'react';
import HeroSection from '../components/layout/HeroSection';
import ContactForm from '../components/forms/ContactForm';

const INFO = [
    { icon: '📞', label: 'Phone', value: '+256 764 524 816', href: 'tel:+256764524816' },
    { icon: '✉️', label: 'Email', value: 'juniorreactive@gmail.com', href: 'mailto:juniorreactive@gmail.com' },
    { icon: '📍', label: 'Location', value: 'Kampala, Uganda', href: null },
    { icon: '💬', label: 'WhatsApp', value: 'Chat with us', href: 'https://wa.me/256764524816' },
];

const ContactPage = () => (
    <main>
        <HeroSection
            badge="Get in Touch"
            title="Contact Us"
            subtitle="Have a question or want to discuss a project? We'd love to hear from you."
        />

        <section className="section">
            <div className="container">
                {/* Responsive contact grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'clamp(280px, 40%, 420px) 1fr',
                    gap: 48,
                    alignItems: 'start',
                }}>
                    {/* Left — info */}
                    <div>
                        <h2 style={{ marginBottom: 8 }}>Let's Talk</h2>
                        <p style={{ marginBottom: 32 }}>
                            Whether you're ready to start a project or just exploring options — we're here to help. Fill out the form or reach us directly.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {INFO.map((item) => (
                                <div key={item.label} style={{
                                    display: 'flex', gap: 14, alignItems: 'flex-start',
                                    padding: '16px 18px', background: 'var(--color-white)',
                                    borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                                    boxShadow: 'var(--shadow-xs)',
                                }}>
                                    <span style={{
                                        fontSize: '1.25rem', width: 40, height: 40,
                                        background: 'var(--gradient-light)', borderRadius: 8,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        {item.icon}
                                    </span>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-light)', margin: 0 }}>
                                            {item.label}
                                        </p>
                                        {item.href ? (
                                            <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                                                style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: '0.95rem' }}>
                                                {item.value}
                                            </a>
                                        ) : (
                                            <span style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: '0.95rem' }}>{item.value}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — form */}
                    <ContactForm />
                </div>
            </div>
        </section>

        {/* Responsive override */}
        <style>{`
            @media (max-width: 860px) {
                .contact-grid-inner {
                    grid-template-columns: 1fr !important;
                }
            }
        `}</style>
    </main>
);

export default ContactPage;
