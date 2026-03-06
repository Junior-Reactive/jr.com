/**
 * Junior Reactive — Backend AI Routes Unit Tests
 * File: backend/tests/aiRoutes.test.js
 *
 * Run with: cd backend && npx jest tests/aiRoutes.test.js --verbose
 */

const request  = require('supertest');
const express  = require('express');
const aiRoutes = require('../routes/aiRoutes');

// ─── Minimal express app for testing ─────────────────────────────────────────
function buildApp() {
    const app = express();
    app.use(express.json());
    app.use('/api/ai', aiRoutes);
    return app;
}

// ─── Mock fetch so tests don't hit the real Groq API ─────────────────────────
global.fetch = jest.fn();

function mockGroqSuccess(content) {
    global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
            choices: [{ message: { content } }],
        }),
    });
}

function mockGroqFailure(status = 500) {
    global.fetch.mockResolvedValueOnce({
        ok: false,
        status,
        text: async () => 'Internal Groq Error',
    });
}

beforeEach(() => {
    jest.clearAllMocks();
    process.env.GROQ_API_KEY = 'test-key-123';
});

// ══════════════════════════════════════════════════════════════════════════════
//   POST /api/ai/chat
// ══════════════════════════════════════════════════════════════════════════════
describe('POST /api/ai/chat', () => {

    test('✅ returns a message and suggestions on valid input', async () => {
        const mockResponse = `Tell me more about our services! {"suggestions": ["View our services", "Get a quote", "Contact Us"]}`;
        mockGroqSuccess(mockResponse);

        const res = await request(buildApp())
            .post('/api/ai/chat')
            .send({ userMessage: 'What do you do?', messages: [] });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(typeof res.body.message).toBe('string');
        expect(res.body.message.length).toBeGreaterThan(0);
        expect(Array.isArray(res.body.suggestions)).toBe(true);
    });

    test('✅ parses navigate action from AI response', async () => {
        const mockResponse = `Let me take you to our services page! {"suggestions": ["Apply now"], "navigate": "/services"}`;
        mockGroqSuccess(mockResponse);

        const res = await request(buildApp())
            .post('/api/ai/chat')
            .send({ userMessage: 'Show me services', messages: [] });

        expect(res.status).toBe(200);
        expect(res.body.navigate).toBe('/services');
    });

    test('✅ provides default suggestions when AI returns none', async () => {
        mockGroqSuccess('Here is some info about us. No JSON here.');

        const res = await request(buildApp())
            .post('/api/ai/chat')
            .send({ userMessage: 'Tell me about JR', messages: [] });

        expect(res.status).toBe(200);
        expect(res.body.suggestions.length).toBeGreaterThan(0);
    });

    test('✅ includes message history in Groq call', async () => {
        mockGroqSuccess('Great question! {"suggestions": ["Apply now"]}');

        const history = [
            { role: 'user', content: 'Hello' },
            { role: 'assistant', content: 'Hi there!' },
        ];

        await request(buildApp())
            .post('/api/ai/chat')
            .send({ userMessage: 'What are your services?', messages: history });

        const callBody = JSON.parse(global.fetch.mock.calls[0][1].body);
        expect(callBody.messages.length).toBeGreaterThan(2); // system + history + new message
        expect(callBody.messages[0].role).toBe('system');
    });

    test('❌ returns 400 when userMessage is missing', async () => {
        const res = await request(buildApp())
            .post('/api/ai/chat')
            .send({ messages: [] });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toMatch(/userMessage/i);
    });

    test('❌ returns 400 when userMessage is empty string', async () => {
        const res = await request(buildApp())
            .post('/api/ai/chat')
            .send({ userMessage: '   ', messages: [] });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('❌ returns 400 when userMessage is not a string', async () => {
        const res = await request(buildApp())
            .post('/api/ai/chat')
            .send({ userMessage: 12345 });

        expect(res.status).toBe(400);
    });

    test('❌ handles Groq API failure gracefully', async () => {
        mockGroqFailure(500);

        const res = await request(buildApp())
            .post('/api/ai/chat')
            .send({ userMessage: 'Hello', messages: [] });

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(typeof res.body.message).toBe('string'); // fallback message provided
    });

    test('❌ handles missing GROQ_API_KEY', async () => {
        delete process.env.GROQ_API_KEY;

        const res = await request(buildApp())
            .post('/api/ai/chat')
            .send({ userMessage: 'Hello', messages: [] });

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
    });

    test('✅ limits history to last 8 messages', async () => {
        mockGroqSuccess('Response {"suggestions": ["Next step"]}');

        const longHistory = Array.from({ length: 20 }, (_, i) => ({
            role: i % 2 === 0 ? 'user' : 'assistant',
            content: `Message ${i}`,
        }));

        await request(buildApp())
            .post('/api/ai/chat')
            .send({ userMessage: 'New message', messages: longHistory });

        const callBody = JSON.parse(global.fetch.mock.calls[0][1].body);
        // system message + max 8 history + 1 new = max 10
        expect(callBody.messages.length).toBeLessThanOrEqual(10);
    });
});

// ══════════════════════════════════════════════════════════════════════════════
//   POST /api/ai/brief
// ══════════════════════════════════════════════════════════════════════════════
describe('POST /api/ai/brief', () => {

    const validPayload = {
        companyName: 'Test Company Ltd',
        industry: 'Logistics',
        problem: 'We manually process 200 delivery orders per day and it is causing errors.',
        budget: 'UGX 2M–5M',
        timeline: '1–3 months',
        techLevel: 'Basic',
    };

    test('✅ returns a brief on valid input', async () => {
        mockGroqSuccess('## Executive Summary\nTest company needs automation.\n## Recommended Services\n- N8N Automation');

        const res = await request(buildApp())
            .post('/api/ai/brief')
            .send(validPayload);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(typeof res.body.brief).toBe('string');
        expect(res.body.brief.length).toBeGreaterThan(10);
    });

    test('✅ includes meta with companyName and generatedAt', async () => {
        mockGroqSuccess('## Executive Summary\nBrief content here.');

        const res = await request(buildApp())
            .post('/api/ai/brief')
            .send(validPayload);

        expect(res.status).toBe(200);
        expect(res.body.meta.companyName).toBe('Test Company Ltd');
        expect(res.body.meta.industry).toBe('Logistics');
        expect(typeof res.body.meta.generatedAt).toBe('string');
    });

    test('✅ uses llama-3.3-70b-versatile model for briefs', async () => {
        mockGroqSuccess('Brief content here.');

        await request(buildApp())
            .post('/api/ai/brief')
            .send(validPayload);

        const callBody = JSON.parse(global.fetch.mock.calls[0][1].body);
        expect(callBody.model).toBe('llama-3.3-70b-versatile');
    });

    test('❌ returns 400 when companyName is missing', async () => {
        const { companyName, ...rest } = validPayload;
        const res = await request(buildApp())
            .post('/api/ai/brief')
            .send(rest);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('❌ returns 400 when industry is missing', async () => {
        const { industry, ...rest } = validPayload;
        const res = await request(buildApp())
            .post('/api/ai/brief')
            .send(rest);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('❌ returns 400 when problem is missing', async () => {
        const { problem, ...rest } = validPayload;
        const res = await request(buildApp())
            .post('/api/ai/brief')
            .send(rest);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('✅ works without optional fields (budget, timeline, techLevel)', async () => {
        mockGroqSuccess('## Executive Summary\nMinimal brief.');

        const res = await request(buildApp())
            .post('/api/ai/brief')
            .send({
                companyName: 'Minimal Co',
                industry: 'Retail',
                problem: 'We need help with our processes.',
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('❌ handles Groq failure gracefully', async () => {
        mockGroqFailure(429); // rate limit

        const res = await request(buildApp())
            .post('/api/ai/brief')
            .send(validPayload);

        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
    });
});

// ══════════════════════════════════════════════════════════════════════════════
//   Groq API call helper tests
// ══════════════════════════════════════════════════════════════════════════════
describe('Groq API request format', () => {

    test('✅ sends correct Authorization header', async () => {
        process.env.GROQ_API_KEY = 'my-secret-key';
        mockGroqSuccess('Response {"suggestions": []}');

        await request(buildApp())
            .post('/api/ai/chat')
            .send({ userMessage: 'Hi', messages: [] });

        const callHeaders = global.fetch.mock.calls[0][1].headers;
        expect(callHeaders['Authorization']).toBe('Bearer my-secret-key');
        expect(callHeaders['Content-Type']).toBe('application/json');
    });

    test('✅ hits correct Groq endpoint', async () => {
        mockGroqSuccess('Response {"suggestions": []}');

        await request(buildApp())
            .post('/api/ai/chat')
            .send({ userMessage: 'Hi', messages: [] });

        expect(global.fetch.mock.calls[0][0]).toBe(
            'https://api.groq.com/openai/v1/chat/completions'
        );
    });

    test('✅ uses POST method for Groq requests', async () => {
        mockGroqSuccess('Response {"suggestions": []}');

        await request(buildApp())
            .post('/api/ai/chat')
            .send({ userMessage: 'Hi', messages: [] });

        expect(global.fetch.mock.calls[0][1].method).toBe('POST');
    });
});
