import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchWallExperience, getWallAdapterNotes, getWallCollections, getWallFeedPath, officialWallId } from './wallExperience';

afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
});

describe('wallExperience', () => {
    it('returns deterministic mock-backed official/all/subscribed wall collections in demo mode', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');

        const result = await fetchWallExperience({
            wallId: officialWallId,
            sort: 'latest',
            category: 'all',
        });

        expect(result.feed.kind).toBe('success');
        expect(result.widgets.kind).toBe('success');
        expect(result.officialWall.id).toBe(officialWallId);
        expect(result.allWalls.map((wall) => wall.id)).toEqual([
            'company-wall',
            'engineering-wall',
            'culture-wall',
            'newcomers-wall',
            'incident-wall',
        ]);
        expect(result.subscribedWalls.map((wall) => wall.id)).toEqual([
            'engineering-wall',
            'culture-wall',
            'newcomers-wall',
        ]);
        expect(result.availableWalls.map((wall) => wall.id)).toEqual(result.allWalls.map((wall) => wall.id));

        if (result.feed.kind !== 'success' || result.widgets.kind !== 'success') {
            return;
        }

        expect(result.feed.adapter).toBe('mock');
        expect(result.widgets.adapter).toBe('mock');
        expect(result.feed.items[0]?.id).toBe('mock-company-demo-window');
        expect(result.widgets.items[0]?.id).toBe('mock-company-widget-kudos');
    });

    it('switches across distinct wall datasets deterministically', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');

        const company = await fetchWallExperience({
            wallId: 'company-wall',
            sort: 'latest',
            category: 'all',
        });
        const engineering = await fetchWallExperience({
            wallId: 'engineering-wall',
            sort: 'latest',
            category: 'all',
        });
        const people = await fetchWallExperience({
            wallId: 'culture-wall',
            sort: 'latest',
            category: 'all',
        });

        if (company.feed.kind !== 'success' || engineering.feed.kind !== 'success' || people.feed.kind !== 'success') {
            return;
        }

        expect(company.feed.items[0]?.wallLabel).toBe('Company Wall');
        expect(engineering.feed.items[0]?.wallLabel).toBe('Engineering Wall');
        expect(people.feed.items[0]?.wallLabel).toBe('People Wall');
        expect(company.feed.items[0]?.id).not.toBe(engineering.feed.items[0]?.id);
        expect(engineering.feed.items[0]?.id).not.toBe(people.feed.items[0]?.id);
    });

    it('applies deterministic filter and top sort transforms', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'false');

        const announcements = await fetchWallExperience({
            wallId: 'company-wall',
            sort: 'top',
            category: 'announcements',
        });

        expect(announcements.feed.kind).toBe('success');
        if (announcements.feed.kind !== 'success') {
            return;
        }

        expect(announcements.feed.items).toHaveLength(1);
        expect(announcements.feed.items[0]?.id).toBe('company-policy-window');

        const top = await fetchWallExperience({
            wallId: 'engineering-wall',
            sort: 'top',
            category: 'all',
        });

        if (top.feed.kind !== 'success') {
            return;
        }

        expect(top.feed.items.map((post) => post.id)).toEqual([
            'eng-refactor-note',
            'eng-regression-bundle',
            'eng-api-stability',
        ]);
    });

    it('returns explicit empty state for subscribed walls without posts', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');

        const result = await fetchWallExperience({
            wallId: 'newcomers-wall',
            sort: 'latest',
            category: 'all',
        });

        expect(result.selectedWall.status).toBe('empty');
        expect(result.selectedWall.subscription).toBe('subscribed');
        expect(result.feed.kind).toBe('empty');
        expect(result.widgets.kind).toBe('success');
    });

    it('returns explicit unavailable state for unsubscribed restricted wall contexts', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');

        const result = await fetchWallExperience({
            wallId: 'incident-wall',
            sort: 'latest',
            category: 'all',
        });

        expect(result.selectedWall.status).toBe('unavailable');
        expect(result.selectedWall.subscription).toBe('unsubscribed');
        expect(result.feed.kind).toBe('unavailable');
        expect(result.widgets.kind).toBe('unavailable');
        if (result.feed.kind === 'unavailable') {
            expect(result.feed.reason).toContain('unavailable');
        }
    });

    it('returns deterministic wall routes for official and subscribed contexts', () => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');

        const collections = getWallCollections();

        expect(getWallFeedPath(collections.officialWall.id)).toBe('/');
        expect(collections.subscribedWalls.map((wall) => getWallFeedPath(wall.id))).toEqual([
            '/walls/engineering-wall',
            '/walls/culture-wall',
            '/walls/newcomers-wall',
        ]);
    });

    it('documents wall adapter data boundaries', () => {
        const notes = getWallAdapterNotes();

        expect(notes.feed).toContain('activitiesFeed');
        expect(notes.widgets).toContain('kudos');
        expect(notes.contexts).toContain('official context');
    });
});
