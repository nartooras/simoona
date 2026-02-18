import { buildApiAuthHeaders } from './authHeaders';
import { ApiHttpError, apiFetch } from './client';
import { resolveDataSource, withDataSource, type DataSourceResult } from './dataSource';

export type GeneralSettingsOption = {
    displayName: string;
    name: string;
    isSelected: boolean;
};

export type GeneralSettingsTimeZone = {
    id: string;
    displayName: string;
    isSelected: boolean;
};

export type GeneralSettingsResponse = {
    languages: GeneralSettingsOption[];
    timeZones: GeneralSettingsTimeZone[];
};

export type GeneralSettingsResult = DataSourceResult<
    | { kind: 'success'; settings: GeneralSettingsResponse }
    | { kind: 'empty' }
    | { kind: 'unauthorized' }
    | { kind: 'forbidden' }
    | { kind: 'badRequest' }
    | { kind: 'serverError' }
    | { kind: 'unknownError' }
>;

export async function fetchGeneralSettings(): Promise<GeneralSettingsResult> {
    const dataSource = resolveDataSource('generalSettings');
    const authHeadersResult = buildApiAuthHeaders();
    if (authHeadersResult.kind === 'missingOrganization') {
        return withDataSource({ kind: 'badRequest' }, dataSource);
    }

    try {
        const settings = await apiFetch<GeneralSettingsResponse>('/v1/user/general-settings', {
            headers: authHeadersResult.headers,
        });

        if (settings.languages.length === 0 && settings.timeZones.length === 0) {
            return withDataSource({ kind: 'empty' }, dataSource);
        }

        return withDataSource({ kind: 'success', settings }, dataSource);
    } catch (error) {
        if (error instanceof ApiHttpError) {
            switch (error.status) {
                case 400:
                    return withDataSource({ kind: 'badRequest' }, dataSource);
                case 401:
                    return withDataSource({ kind: 'unauthorized' }, dataSource);
                case 403:
                    return withDataSource({ kind: 'forbidden' }, dataSource);
                case 404:
                    return withDataSource({ kind: 'empty' }, dataSource);
                default:
                    if (error.status >= 500) {
                        return withDataSource({ kind: 'serverError' }, dataSource);
                    }
            }
        }

        return withDataSource({ kind: 'unknownError' }, dataSource);
    }
}
