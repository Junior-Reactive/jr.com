import React from 'react';

/* Usage examples:
   <SkeletonCard />                      — service / team card
   <SkeletonBlogCard />                  — blog card
   <SkeletonText lines={3} />            — paragraphs
   <SkeletonGrid count={6} Card={SkeletonCard} />
*/

export const SkeletonCard = () => (
    <div className="skeleton-card">
        <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 10, marginBottom: 20 }} />
        <div className="skeleton skeleton-line skeleton-line-lg skeleton-w-3/4" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line skeleton-w-2/3" />
        <div className="skeleton skeleton-line skeleton-w-1/2" style={{ marginTop: 12 }} />
    </div>
);

export const SkeletonBlogCard = () => (
    <div className="blog-card" style={{ overflow: 'hidden' }}>
        <div className="skeleton" style={{ height: 180, borderRadius: 0 }} />
        <div className="blog-card-body">
            <div className="skeleton skeleton-line skeleton-line-sm skeleton-w-1/2" style={{ marginBottom: 12 }} />
            <div className="skeleton skeleton-line skeleton-line-lg skeleton-w-3/4" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-w-2/3" />
        </div>
    </div>
);

export const SkeletonPortfolioCard = () => (
    <div className="portfolio-card">
        <div className="skeleton" style={{ height: 200 }} />
        <div className="portfolio-body">
            <div className="skeleton skeleton-line skeleton-line-sm skeleton-w-1/4" style={{ marginBottom: 8 }} />
            <div className="skeleton skeleton-line skeleton-line-lg skeleton-w-2/3" />
            <div className="skeleton skeleton-line skeleton-w-3/4" />
        </div>
    </div>
);

export const SkeletonTeamCard = () => (
    <div className="team-card">
        <div className="skeleton" style={{ height: 220 }} />
        <div className="team-card-body">
            <div className="skeleton skeleton-line skeleton-line-lg skeleton-w-2/3" style={{ margin: '0 auto 8px' }} />
            <div className="skeleton skeleton-line skeleton-line-sm skeleton-w-1/2" style={{ margin: '0 auto 12px' }} />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-w-3/4" />
        </div>
    </div>
);

export const SkeletonFAQ = () => (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 10, padding: '20px 24px', marginBottom: 12 }}>
        <div className="skeleton skeleton-line skeleton-line-lg skeleton-w-3/4" />
    </div>
);

export const SkeletonText = ({ lines = 3 }) => (
    <div>
        {Array.from({ length: lines }).map((_, i) => (
            <div
                key={i}
                className="skeleton skeleton-line"
                style={{ width: i === lines - 1 ? '60%' : '100%', marginBottom: 10 }}
            />
        ))}
    </div>
);

export const SkeletonGrid = ({ count = 6, Card = SkeletonCard, columns = 'repeat(auto-fit, minmax(290px, 1fr))' }) => (
    <div style={{ display: 'grid', gridTemplateColumns: columns, gap: 24 }}>
        {Array.from({ length: count }).map((_, i) => <Card key={i} />)}
    </div>
);

export default SkeletonCard;
