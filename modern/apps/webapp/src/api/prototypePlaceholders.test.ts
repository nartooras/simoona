import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
});

describe('prototype placeholders', () => {
    it('returns deterministic mock payloads in demo mode', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');

        const { getPrototypePlaceholder } = await import('./prototypePlaceholders');

        const activitiesFeed = getPrototypePlaceholder('/activities/feed');
        const recognition = getPrototypePlaceholder('/recognition');

        expect(activitiesFeed.dataSource).toBe('mock');
        expect(activitiesFeed.title).toBe('Activity Feed');
        expect(activitiesFeed.cards).toHaveLength(3);
        expect(activitiesFeed.cards[0]?.title).toBe('Today posts');
        expect(activitiesFeed.availableNow[0]).toContain('Route and navigation parity');
        expect(activitiesFeed.actions[0]?.label).toBe('Create Post');

        expect(recognition.dataSource).toBe('mock');
        expect(recognition.cards[2]?.title).toBe('Nomination flow');
        expect(recognition.unavailableInPrototype[0]).toContain('Nomination submit');
    });

    it('keeps prototype routes mock-backed even when demo mode is disabled', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'false');

        const { getPrototypePlaceholder } = await import('./prototypePlaceholders');

        expect(getPrototypePlaceholder('/teams').dataSource).toBe('mock');
        expect(getPrototypePlaceholder('/service-requests').dataSource).toBe('disabled');
        expect(getPrototypePlaceholder('/externals/integrations').dataSource).toBe('disabled');
    });
});
