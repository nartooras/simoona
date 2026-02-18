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
        expect(dataSource.resolveDataSource('events')).toBe('mock');
        expect(dataSource.resolveDataSource('vacations')).toBe('mock');
        expect(dataSource.resolveDataSource('kudos')).toBe('mock');
        expect(dataSource.resolveDataSource('books')).toBe('mock');
        expect(dataSource.resolveDataSource('teams')).toBe('mock');
        expect(dataSource.resolveDataSource('projects')).toBe('mock');
        expect(dataSource.resolveDataSource('officeMap')).toBe('mock');
        expect(dataSource.resolveDataSource('organizationalStructure')).toBe('mock');
        expect(dataSource.resolveDataSource('committees')).toBe('mock');
        expect(dataSource.resolveDataSource('serviceRequests')).toBe('disabled');
        expect(dataSource.resolveDataSource('integrations')).toBe('disabled');
    });

    it('defaults to real adapters outside demo mode', async () => {
        vi.stubEnv('VITE_DEMO_MODE', 'false');

        const dataSource = await import('./dataSource');

        expect(dataSource.isDemoModeEnabled()).toBe(false);
        expect(dataSource.resolveDataSource('userInfo')).toBe('real');
        expect(dataSource.resolveDataSource('activitiesFeed')).toBe('real');
    });
});
