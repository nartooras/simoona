import { buildApiAuthHeaders } from './authHeaders';
import { ApiHttpError, apiFetch } from './client';
import { fetchGeneralSettingsViaStub } from './generalSettingsStub';

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

export type GeneralSettingsResult =
    | { kind: 'success'; settings: GeneralSettingsResponse }
    | { kind: 'empty' }
    | { kind: 'unauthorized' }
    | { kind: 'forbidden' }
    | { kind: 'badRequest' }
    | { kind: 'apiGap' }
    | { kind: 'serverError' }
    | { kind: 'unknownError' };

export async function fetchGeneralSettings(): Promise<GeneralSettingsResult> {
    const authHeadersResult = buildApiAuthHeaders();
    if (authHeadersResult.kind === 'missingOrganization') {
        return { kind: 'badRequest' };
    }

    try {
        const settings = await apiFetch<GeneralSettingsResponse>('/v1/user/general-settings', {
            headers: authHeadersResult.headers,
        });

        if (settings.languages.length === 0 && settings.timeZones.length === 0) {
            return { kind: 'empty' };
        }

        return { kind: 'success', settings };
    } catch (error) {
        if (error instanceof ApiHttpError) {
            switch (error.status) {
                case 400:
                    return { kind: 'badRequest' };
                case 401:
                    return { kind: 'unauthorized' };
                case 403:
                    return { kind: 'forbidden' };
                case 404:
                    return fetchGeneralSettingsViaStub();
                default:
                    if (error.status >= 500) {
                        return { kind: 'serverError' };
                    }
            }
        }

        return { kind: 'unknownError' };
    }
}
