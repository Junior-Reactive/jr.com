import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import HeroSection from '../components/layout/HeroSection';

const FAQPage = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['faqs'],
        queryFn: () => contentService.getFAQs(),
    });

    const faqs = data?.data?.data || [];

    return (
        <main>
            <HeroSection
                title="Frequently Asked Questions"
                subtitle="Find answers to common questions about our services."
            />

            <section className="section">
                <div className="container" style={{ maxWidth: 800 }}>
                    {isLoading ? (
                        <p>Loading FAQs...</p>
                    ) : (
                        faqs.map(faq => (
                            <div key={faq.id} style={{ marginBottom: 30 }}>
                                <h3>{faq.question}</h3>
                                <p>{faq.answer}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
};

export default FAQPage;