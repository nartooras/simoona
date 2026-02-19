import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
});

describe('kudosExperience adapter', () => {
    it('uses mock fixtures in demo mode with deterministic feed and leaderboard ordering', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');

        const kudos = await import('./kudosExperience');
        const result = await kudos.fetchKudosExperience();

        expect(result.dataSource).toBe('mock');
        expect(result.feed.kind).toBe('success');
        expect(result.leaderboard.kind).toBe('success');

        if (result.feed.kind === 'success') {
            expect(result.feed.items[0]?.id).toBe('mock-kudos-1');
        }

        if (result.leaderboard.kind === 'success') {
            expect(result.leaderboard.items[0]?.receiver).toBe('Inga P.');
            expect(result.leaderboard.items[0]?.count).toBe(2);
        }
    });

    it('applies deterministic period/type/team filters for feed', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');

        const kudos = await import('./kudosExperience');
        const result = await kudos.fetchKudosExperience({
            period: 'last-30-days',
            type: 'teamwork',
            team: 'engineering',
        });

        expect(result.feed.kind).toBe('success');

        if (result.feed.kind === 'success') {
            expect(result.feed.items).toHaveLength(1);
            expect(result.feed.items[0]?.id).toBe('mock-kudos-1');
        }
    });

    it('returns explicit empty states when filters produce no kudos rows', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');

        const kudos = await import('./kudosExperience');
        const result = await kudos.fetchKudosExperience({ team: 'finance', period: 'last-30-days' });

        expect(result.feed.kind).toBe('empty');
        expect(result.leaderboard.kind).toBe('empty');
        expect(result.distribution.kind).toBe('empty');
    });

    it('returns explicit unavailable state for deferred external recognition scope', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');

        const kudos = await import('./kudosExperience');
        const result = await kudos.fetchKudosExperience({ type: 'external' });

        expect(result.feed.kind).toBe('unavailable');
        expect(result.leaderboard.kind).toBe('unavailable');
        expect(result.distribution.kind).toBe('unavailable');

        if (result.feed.kind === 'unavailable') {
            expect(result.feed.reason).toContain('deferred');
        }
    });

    it('uses real fixtures outside demo mode', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'false');

        const kudos = await import('./kudosExperience');
        const result = await kudos.fetchKudosExperience({ period: 'last-30-days' });

        expect(result.dataSource).toBe('real');
        expect(result.feed.kind).toBe('success');

        if (result.feed.kind === 'success') {
            expect(result.feed.items).toHaveLength(5);
            expect(result.feed.items[0]?.id).toBe('real-kudos-1');
        }
    });
});
