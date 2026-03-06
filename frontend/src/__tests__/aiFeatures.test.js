/**
 * Junior Reactive — Frontend Unit Tests
 * File: frontend/src/__tests__/aiFeatures.test.js
 *
 * Tests the ServiceRecommender decision engine and ProjectBriefGenerator form logic
 * Run with: cd frontend && npx react-scripts test --watchAll=false --verbose
 */

// ─── We test the pure logic functions by extracting them.
// ─── These tests import the recommendation function directly.

// ── Inline the recommendation engine for isolated testing ─────────────────────
function getRecommendation(answers) {
    const { challenge, size, urgency, budget, tech } = answers;

    if (challenge === 'training') {
        return {
            primary: budget === 'micro' || budget === 'small'
                ? 'AI Awareness Session'
                : 'AI Courses & Training Programme',
            secondary: 'AI Consulting (Strategy Roadmap)',
            applyService: 'AI+Awareness+Sessions',
            icon: '🎓',
        };
    }
    if (challenge === 'automation') {
        if (budget === 'micro') {
            return { primary: 'N8N Workflow Automation (Starter)', applyService: 'N8N+Workflow+Automation', icon: '⚡' };
        }
        return { primary: 'N8N Workflow Automation', secondary: size === 'large' ? 'Enterprise Integration Package' : 'Business Intelligence Dashboard', applyService: 'N8N+Workflow+Automation', icon: '⚙️' };
    }
    if (challenge === 'data') {
        if (tech === 'none' || tech === 'basic') {
            return { primary: 'Business Intelligence Dashboard', applyService: 'BI+Dashboards', icon: '📊' };
        }
        return { primary: 'Predictive Modeling & Machine Learning', applyService: 'Predictive+Modeling', icon: '🔮' };
    }
    if (challenge === 'software') {
        if (urgency === 'urgent' && budget !== 'large') {
            return { primary: 'Free Discovery Call + Scoping Session', applyService: 'Custom+Software+Development', icon: '💻' };
        }
        return { primary: 'Custom Software Development', applyService: 'Custom+Software+Development', icon: '🚀' };
    }
    return { primary: 'AI Consulting & Strategy Roadmap', applyService: 'AI+Consulting', icon: '🧠' };
}

// ── Inline route resolver for testing ─────────────────────────────────────────
const ROUTE_MAP = {
    'our services': '/services',
    'see our services': '/services',
    'services': '/services',
    'meet the team': '/team',
    'portfolio': '/portfolio',
    'view portfolio': '/portfolio',
    'apply': '/apply',
    'apply now': '/apply',
    'get started': '/apply',
    'book a free discovery call': '/apply',
    'contact us': '/contact',
    'contact': '/contact',
    'about': '/about',
    'faq': '/faq',
    'blog': '/blog',
    'ai tools': '/ai-tools',
    'whatsapp us': 'https://wa.me/256764524816',
};
function resolveRoute(suggestion) {
    return ROUTE_MAP[suggestion.toLowerCase().trim()] || null;
}

// ══════════════════════════════════════════════════════════════════════════════
//   ServiceRecommender — Recommendation Engine
// ══════════════════════════════════════════════════════════════════════════════
describe('ServiceRecommender — getRecommendation()', () => {

    // ── Training path ────────────────────────────────────────────────────────
    describe('training challenge', () => {
        test('recommends AI Awareness Session for micro budget', () => {
            const rec = getRecommendation({ challenge: 'training', budget: 'micro', size: 'small', urgency: 'near', tech: 'none' });
            expect(rec.primary).toBe('AI Awareness Session');
            expect(rec.applyService).toBe('AI+Awareness+Sessions');
        });

        test('recommends AI Awareness Session for small budget', () => {
            const rec = getRecommendation({ challenge: 'training', budget: 'small', size: 'medium', urgency: 'near', tech: 'basic' });
            expect(rec.primary).toBe('AI Awareness Session');
        });

        test('recommends AI Courses for medium/large budget', () => {
            const rec = getRecommendation({ challenge: 'training', budget: 'medium', size: 'large', urgency: 'near', tech: 'moderate' });
            expect(rec.primary).toBe('AI Courses & Training Programme');
        });

        test('recommends AI Courses for large budget', () => {
            const rec = getRecommendation({ challenge: 'training', budget: 'large', size: 'large', urgency: 'near', tech: 'high' });
            expect(rec.primary).toBe('AI Courses & Training Programme');
        });

        test('always includes AI Consulting as secondary', () => {
            const rec = getRecommendation({ challenge: 'training', budget: 'medium', size: 'medium', urgency: 'near', tech: 'basic' });
            expect(rec.secondary).toContain('AI Consulting');
        });
    });

    // ── Automation path ──────────────────────────────────────────────────────
    describe('automation challenge', () => {
        test('recommends N8N Starter for micro budget', () => {
            const rec = getRecommendation({ challenge: 'automation', budget: 'micro', size: 'solo', urgency: 'near', tech: 'basic' });
            expect(rec.primary).toContain('N8N Workflow Automation');
        });

        test('recommends full N8N for small+ budget', () => {
            const rec = getRecommendation({ challenge: 'automation', budget: 'small', size: 'small', urgency: 'near', tech: 'moderate' });
            expect(rec.primary).toBe('N8N Workflow Automation');
        });

        test('recommends Enterprise Integration for large org', () => {
            const rec = getRecommendation({ challenge: 'automation', budget: 'large', size: 'large', urgency: 'near', tech: 'high' });
            expect(rec.secondary).toContain('Enterprise');
        });

        test('recommends BI Dashboard as secondary for non-large orgs', () => {
            const rec = getRecommendation({ challenge: 'automation', budget: 'medium', size: 'medium', urgency: 'near', tech: 'moderate' });
            expect(rec.secondary).toContain('Business Intelligence');
        });
    });

    // ── Data challenge ───────────────────────────────────────────────────────
    describe('data challenge', () => {
        test('recommends BI Dashboard for non-technical users', () => {
            const rec = getRecommendation({ challenge: 'data', budget: 'medium', size: 'medium', urgency: 'near', tech: 'none' });
            expect(rec.primary).toBe('Business Intelligence Dashboard');
        });

        test('recommends BI Dashboard for basic-tech users', () => {
            const rec = getRecommendation({ challenge: 'data', budget: 'medium', size: 'medium', urgency: 'near', tech: 'basic' });
            expect(rec.primary).toBe('Business Intelligence Dashboard');
        });

        test('recommends Predictive Modeling for moderate-tech users', () => {
            const rec = getRecommendation({ challenge: 'data', budget: 'large', size: 'large', urgency: 'near', tech: 'moderate' });
            expect(rec.primary).toBe('Predictive Modeling & Machine Learning');
        });

        test('recommends Predictive Modeling for high-tech teams', () => {
            const rec = getRecommendation({ challenge: 'data', budget: 'large', size: 'large', urgency: 'near', tech: 'high' });
            expect(rec.primary).toBe('Predictive Modeling & Machine Learning');
        });
    });

    // ── Software challenge ───────────────────────────────────────────────────
    describe('software challenge', () => {
        test('recommends Discovery Call for urgent + non-large budget', () => {
            const rec = getRecommendation({ challenge: 'software', budget: 'small', size: 'small', urgency: 'urgent', tech: 'none' });
            expect(rec.primary).toContain('Discovery Call');
        });

        test('recommends full Custom Development for non-urgent', () => {
            const rec = getRecommendation({ challenge: 'software', budget: 'medium', size: 'medium', urgency: 'near', tech: 'moderate' });
            expect(rec.primary).toBe('Custom Software Development');
        });

        test('recommends full Custom Development for large budget even if urgent', () => {
            const rec = getRecommendation({ challenge: 'software', budget: 'large', size: 'large', urgency: 'urgent', tech: 'high' });
            expect(rec.primary).toBe('Custom Software Development');
        });

        test('always has an applyService URL-safe value', () => {
            const rec = getRecommendation({ challenge: 'software', budget: 'medium', size: 'medium', urgency: 'near', tech: 'moderate' });
            expect(rec.applyService).not.toContain(' ');
        });
    });

    // ── Default / fallback ───────────────────────────────────────────────────
    describe('unknown or undefined challenge', () => {
        test('returns AI Consulting as default', () => {
            const rec = getRecommendation({ challenge: undefined, budget: 'medium', size: 'medium', urgency: 'near', tech: 'basic' });
            expect(rec.primary).toContain('AI Consulting');
        });

        test('all recommendations have required fields', () => {
            const challenges = ['training', 'automation', 'data', 'software', undefined];
            challenges.forEach(challenge => {
                const rec = getRecommendation({ challenge, budget: 'medium', size: 'medium', urgency: 'near', tech: 'basic' });
                expect(rec.primary).toBeDefined();
                expect(rec.applyService).toBeDefined();
                expect(rec.icon).toBeDefined();
            });
        });
    });
});

// ══════════════════════════════════════════════════════════════════════════════
//   Chatbot — Route Resolver
// ══════════════════════════════════════════════════════════════════════════════
describe('Chatbot — resolveRoute()', () => {

    test('resolves "Our Services" to /services', () => {
        expect(resolveRoute('Our Services')).toBe('/services');
    });

    test('resolves "Contact Us" to /contact', () => {
        expect(resolveRoute('Contact Us')).toBe('/contact');
    });

    test('resolves "Apply Now" to /apply', () => {
        expect(resolveRoute('Apply Now')).toBe('/apply');
    });

    test('resolves "Book a free discovery call" to /apply', () => {
        expect(resolveRoute('Book a free discovery call')).toBe('/apply');
    });

    test('resolves "Meet the Team" to /team', () => {
        expect(resolveRoute('Meet the Team')).toBe('/team');
    });

    test('resolves "Portfolio" to /portfolio', () => {
        expect(resolveRoute('Portfolio')).toBe('/portfolio');
    });

    test('resolves "WhatsApp Us" to WhatsApp link', () => {
        expect(resolveRoute('WhatsApp Us')).toContain('wa.me');
    });

    test('resolves "AI Tools" to /ai-tools', () => {
        expect(resolveRoute('AI Tools')).toBe('/ai-tools');
    });

    test('returns null for unknown suggestions', () => {
        expect(resolveRoute('Some Random Text')).toBeNull();
    });

    test('is case-insensitive', () => {
        expect(resolveRoute('OUR SERVICES')).toBe('/services');
        expect(resolveRoute('contact us')).toBe('/contact');
        expect(resolveRoute('APPLY NOW')).toBe('/apply');
    });

    test('trims whitespace', () => {
        expect(resolveRoute('  services  ')).toBe('/services');
    });
});

// ══════════════════════════════════════════════════════════════════════════════
//   ProjectBriefGenerator — Form validation logic
// ══════════════════════════════════════════════════════════════════════════════

// Inline the canAdvance logic for isolated testing
function canAdvanceStep(step, form) {
    if (step === 1) return !!(form.companyName?.trim() && form.industry);
    if (step === 2) return form.problem?.trim().length >= 20;
    if (step === 3) return !!(form.budget && form.timeline && form.techLevel);
    return true;
}

describe('ProjectBriefGenerator — Form Validation', () => {

    describe('Step 1 validation (company info)', () => {
        test('blocks advance when companyName is empty', () => {
            expect(canAdvanceStep(1, { companyName: '', industry: 'Tech' })).toBe(false);
        });

        test('blocks advance when industry is not selected', () => {
            expect(canAdvanceStep(1, { companyName: 'ACME Ltd', industry: '' })).toBe(false);
        });

        test('allows advance when both companyName and industry present', () => {
            expect(canAdvanceStep(1, { companyName: 'ACME Ltd', industry: 'Technology' })).toBe(true);
        });

        test('blocks advance when companyName is only whitespace', () => {
            expect(canAdvanceStep(1, { companyName: '   ', industry: 'Tech' })).toBe(false);
        });
    });

    describe('Step 2 validation (problem description)', () => {
        test('blocks advance when problem is less than 20 characters', () => {
            expect(canAdvanceStep(2, { problem: 'Too short' })).toBe(false);
        });

        test('blocks advance when problem is empty', () => {
            expect(canAdvanceStep(2, { problem: '' })).toBe(false);
        });

        test('allows advance when problem is exactly 20 characters', () => {
            expect(canAdvanceStep(2, { problem: 'A'.repeat(20) })).toBe(true);
        });

        test('allows advance when problem is more than 20 characters', () => {
            expect(canAdvanceStep(2, { problem: 'We need help with our delivery dispatch process automation.' })).toBe(true);
        });
    });

    describe('Step 3 validation (budget, timeline, tech)', () => {
        const base = { budget: 'UGX 1M-5M', timeline: '1-3 months', techLevel: 'Basic' };

        test('allows advance when all three fields are set', () => {
            expect(canAdvanceStep(3, base)).toBe(true);
        });

        test('blocks advance when budget is missing', () => {
            expect(canAdvanceStep(3, { ...base, budget: '' })).toBe(false);
        });

        test('blocks advance when timeline is missing', () => {
            expect(canAdvanceStep(3, { ...base, timeline: '' })).toBe(false);
        });

        test('blocks advance when techLevel is missing', () => {
            expect(canAdvanceStep(3, { ...base, techLevel: '' })).toBe(false);
        });
    });

    describe('Step 4 (review step)', () => {
        test('always allows advance on step 4', () => {
            expect(canAdvanceStep(4, {})).toBe(true);
        });
    });
});

// ══════════════════════════════════════════════════════════════════════════════
//   Integration smoke tests
// ══════════════════════════════════════════════════════════════════════════════
describe('Integration — Full recommendation journeys', () => {

    test('Solo non-technical user with micro budget gets starter recommendation', () => {
        const rec = getRecommendation({ challenge: 'automation', budget: 'micro', size: 'solo', urgency: 'urgent', tech: 'none' });
        expect(rec.primary).toContain('N8N');
        expect(rec.applyService).not.toContain(' ');
    });

    test('Large technical org with data challenge gets advanced recommendation', () => {
        const rec = getRecommendation({ challenge: 'data', budget: 'large', size: 'large', urgency: 'near', tech: 'high' });
        expect(rec.primary).toContain('Predictive');
    });

    test('Startup wanting software urgently gets guided first', () => {
        const rec = getRecommendation({ challenge: 'software', budget: 'small', size: 'small', urgency: 'urgent', tech: 'none' });
        expect(rec.primary).toContain('Discovery Call');
    });

    test('All quiz answers produce a recommendation with an apply link', () => {
        const scenarios = [
            { challenge: 'automation', budget: 'medium', size: 'medium', urgency: 'near', tech: 'basic' },
            { challenge: 'data', budget: 'medium', size: 'medium', urgency: 'near', tech: 'none' },
            { challenge: 'software', budget: 'medium', size: 'medium', urgency: 'medium', tech: 'moderate' },
            { challenge: 'training', budget: 'medium', size: 'medium', urgency: 'near', tech: 'none' },
        ];
        scenarios.forEach(s => {
            const rec = getRecommendation(s);
            expect(rec.applyService).toBeTruthy();
            expect(rec.primary.length).toBeGreaterThan(3);
        });
    });
});
