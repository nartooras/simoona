import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
});

describe('eventsExperience adapter', () => {
    it('uses mock fixtures in demo mode and returns deterministic grouped ordering', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');

        const events = await import('./eventsExperience');
        const result = await events.fetchEventsExperience();

        expect(result.dataSource).toBe('mock');
        expect(result.upcoming.kind).toBe('success');
        expect(result.past.kind).toBe('success');

        if (result.upcoming.kind === 'success') {
            expect(result.upcoming.items.map((item) => item.id)).toEqual([
                'mock-coffee-chat',
                'mock-testing-clinic',
                'mock-allhands-march',
            ]);
        }

        if (result.past.kind === 'success') {
            expect(result.past.items.map((item) => item.id)).toEqual([
                'mock-charity-run',
                'mock-roadmap-review',
                'mock-incident-playback',
            ]);
        }
    });

    it('applies deterministic office/type/timeframe filters', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');

        const events = await import('./eventsExperience');
        const result = await events.fetchEventsExperience({
            office: 'kaunas',
            type: 'learning',
            timeframe: 'upcoming',
            sort: 'latest',
        });

        expect(result.dataSource).toBe('mock');
        expect(result.upcoming.kind).toBe('success');
        expect(result.past.kind).toBe('empty');

        if (result.upcoming.kind === 'success') {
            expect(result.upcoming.items).toHaveLength(1);
            expect(result.upcoming.items[0]?.id).toBe('mock-testing-clinic');
        }
    });

    it('returns explicit empty sections when filters produce no events', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');

        const events = await import('./eventsExperience');
        const result = await events.fetchEventsExperience({ office: 'tallinn' });

        expect(result.dataSource).toBe('mock');
        expect(result.upcoming.kind).toBe('empty');
        expect(result.past.kind).toBe('empty');
        expect(result.widgets.kind).toBe('success');
    });

    it('returns explicit unavailable sections for deferred external partner scope', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');

        const events = await import('./eventsExperience');
        const result = await events.fetchEventsExperience({ type: 'external' });

        expect(result.upcoming.kind).toBe('unavailable');
        expect(result.past.kind).toBe('unavailable');
        expect(result.widgets.kind).toBe('unavailable');

        if (result.upcoming.kind === 'unavailable') {
            expect(result.upcoming.reason).toContain('deferred');
        }
    });

    it('uses real fixtures when demo mode is disabled', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'false');

        const events = await import('./eventsExperience');
        const result = await events.fetchEventsExperience({ sort: 'latest' });

        expect(result.dataSource).toBe('real');
        expect(result.upcoming.kind).toBe('success');

        if (result.upcoming.kind === 'success') {
            expect(result.upcoming.items[0]?.id).toBe('real-allhands-march');
        }
    });
});
