import { buildApiAuthHeaders } from './authHeaders';
import { ApiHttpError, apiFetch } from './client';
import { getTemporaryMyProfile, type MyProfileResponse } from './wave2TemporaryAdapters';

export type MyProfileResult =
    | { kind: 'success'; source: 'api' | 'temporary-stub'; profile: MyProfileResponse }
    | { kind: 'unauthorized' }
    | { kind: 'forbidden' }
    | { kind: 'notFound' }
    | { kind: 'badRequest' }
    | { kind: 'serverError' }
    | { kind: 'unknownError' };

export async function fetchMyProfile(): Promise<MyProfileResult> {
    const authHeadersResult = buildApiAuthHeaders();
    if (authHeadersResult.kind === 'missingOrganization') {
        return { kind: 'badRequest' };
    }

    try {
        const profile = await apiFetch<MyProfileResponse>('/v1/profiles/me', {
            headers: authHeadersResult.headers,
        });

        return { kind: 'success', source: 'api', profile };
    } catch (error) {
        if (error instanceof ApiHttpError) {
            switch (error.status) {
                case 400:
                    return { kind: 'badRequest' };
                case 401:
                    return { kind: 'unauthorized' };
                case 403:
                    return { kind: 'forbidden' };
                case 404: {
                    const temporaryAdapterResult = getTemporaryMyProfile(authHeadersResult.headers);

                    if (temporaryAdapterResult.kind === 'unauthorized') {
                        return { kind: 'unauthorized' };
                    }

                    if (temporaryAdapterResult.kind === 'notFound') {
                        return { kind: 'notFound' };
                    }

                    return {
                        kind: 'success',
                        source: 'temporary-stub',
                        profile: temporaryAdapterResult.data,
                    };
                }
                default:
                    if (error.status >= 500) {
                        return { kind: 'serverError' };
                    }
            }
        }

        return { kind: 'unknownError' };
    }
}
