import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/contentService';
import HeroSection from '../components/layout/HeroSection';

const BlogPage = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['blog'],
        queryFn: () => contentService.getBlogPosts(),
    });

    const posts = data?.data?.data || [];

    return (
        <main>
            <HeroSection
                title="Blog & Insights"
                subtitle="Latest news, trends, and thoughts from the Junior Reactive team."
            />

            <section className="section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30 }}>
                        {isLoading ? (
                            <p>Loading posts...</p>
                        ) : (
                            posts.map(post => (
                                <div key={post.id} className="card">
                                    <div style={{ color: 'var(--color-accent-1)', marginBottom: 10, fontSize: '0.9rem' }}>
                                        {post.formattedDate} | {post.author}
                                    </div>
                                    <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
                                    <p>{post.excerpt}</p>
                                    <Link to={`/blog/${post.slug}`} style={{ color: 'var(--color-secondary)' }}>Read More &rarr;</Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default BlogPage;