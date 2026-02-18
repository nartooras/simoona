import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
});

describe('data source selection', () => {
    it('uses hybrid real+mock matrix when demo mode is enabled', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'true');

        const dataSource = await import('./dataSource');

        expect(dataSource.isDemoModeEnabled()).toBe(true);
        expect(dataSource.resolveDataSource('userInfo')).toBe('real');
        expect(dataSource.resolveDataSource('generalSettings')).toBe('real');
        expect(dataSource.resolveDataSource('employees')).toBe('real');
        expect(dataSource.resolveDataSource('myProfile')).toBe('real');
        expect(dataSource.resolveDataSource('activitiesFeed')).toBe('mock');
        expect(dataSource.resolveDataSource('recognition')).toBe('mock');
        expect(dataSource.resolveDataSource('teams')).toBe('mock');
        expect(dataSource.resolveDataSource('integrations')).toBe('mock');
    });

    it('defaults to real adapters outside demo mode', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'false');

        const dataSource = await import('./dataSource');

        expect(dataSource.isDemoModeEnabled()).toBe(false);
        expect(dataSource.resolveDataSource('userInfo')).toBe('real');
        expect(dataSource.resolveDataSource('activitiesFeed')).toBe('real');
    });
});
