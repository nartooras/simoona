import { apiFetch } from './client';

type HealthResponse = {
    status: string;
};

export function fetchHealthStatus(): Promise<HealthResponse> {
    return apiFetch<HealthResponse>('/health');
}
