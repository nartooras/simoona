import { apiFetch } from './client';
import { resolveDataSource, type DataSource } from './dataSource';

export type HealthResponse = {
    status: string;
};

export type HealthResult = {
    dataSource: DataSource;
    health: HealthResponse;
};

export async function fetchHealthStatus(): Promise<HealthResult> {
    const health = await apiFetch<HealthResponse>('/health');
    return {
        dataSource: resolveDataSource('health'),
        health,
    };
}
