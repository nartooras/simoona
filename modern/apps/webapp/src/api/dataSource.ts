export type DataSource = 'real' | 'mock';

export type ApiSlice =
    | 'health'
    | 'userInfo'
    | 'generalSettings'
    | 'employees'
    | 'myProfile'
    | 'activitiesFeed'
    | 'recognition'
    | 'teams'
    | 'integrations';

const demoRealSlices = new Set<ApiSlice>(['health', 'userInfo', 'generalSettings', 'employees', 'myProfile']);
const demoMockSlices = new Set<ApiSlice>(['activitiesFeed', 'recognition', 'teams', 'integrations']);

export function isDemoModeEnabled(): boolean {
    return import.meta.env.VITE_DEMO_MODE?.trim().toLowerCase() === 'true';
}

export function resolveDataSource(slice: ApiSlice): DataSource {
    if (!isDemoModeEnabled()) {
        return 'real';
    }

    if (demoMockSlices.has(slice)) {
        return 'mock';
    }

    if (demoRealSlices.has(slice)) {
        return 'real';
    }

    return 'real';
}

export type DataSourceResult<T extends { kind: string }> = T & { dataSource: DataSource };

export function withDataSource<const T extends { kind: string }>(
    result: T,
    dataSource: DataSource,
): DataSourceResult<T> {
    return { ...result, dataSource };
}
