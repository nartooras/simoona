import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchHomeExperience, getHomeAdapterNotes } from './homeExperience';

afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
});

describe('homeExperience', () => {
    it('uses mock adapters in demo mode for home feed and right rail', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');

        const result = await fetchHomeExperience();

        expect(result.feed.kind).toBe('success');
        expect(result.widgets.kind).toBe('success');
        if (result.feed.kind !== 'success' || result.widgets.kind !== 'success') {
            return;
        }

        expect(result.feed.adapter).toBe('mock');
        expect(result.widgets.adapter).toBe('mock');
        expect(result.feed.items[0]?.id).toBe('mock-post-wave-plan');
        expect(result.widgets.items.map((card) => card.title)).toEqual(['Kudos Feed', 'Upcoming Events', 'Rankings', 'Birthdays']);
    });

    it('uses real adapters when demo mode is disabled', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'false');

        const result = await fetchHomeExperience();

        expect(result.feed.kind).toBe('success');
        expect(result.widgets.kind).toBe('success');
        if (result.feed.kind !== 'success' || result.widgets.kind !== 'success') {
            return;
        }

        expect(result.feed.adapter).toBe('real');
        expect(result.widgets.adapter).toBe('real');
        expect(result.feed.items[0]?.id).toBe('post-wave-plan');
        expect(result.widgets.items[0]?.id).toBe('widget-kudos');
    });

    it('returns deterministic feed ordering and timestamps across repeated loads', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');

        const first = await fetchHomeExperience();
        const second = await fetchHomeExperience();

        if (first.feed.kind !== 'success' || second.feed.kind !== 'success') {
            return;
        }

        expect(first.feed.items.map((item) => [item.id, item.timestamp])).toEqual(
            second.feed.items.map((item) => [item.id, item.timestamp]),
        );
    });

    it('documents intentional mock-backed home sections', () => {
        const notes = getHomeAdapterNotes();

        expect(notes.feed).toContain('Mock-backed');
        expect(notes.widgets).toContain('Mock-backed');
    });
});
