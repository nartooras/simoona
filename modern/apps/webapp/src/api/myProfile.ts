import { buildApiAuthHeaders } from './authHeaders';
import { ApiHttpError, apiFetch } from './client';

export type MyProfileResponse = {
    id: string;
    fullName: string;
    email: string | null;
    jobTitle: string | null;
    department: string | null;
    office: string | null;
    timeZone: string | null;
};

export type MyProfileResult =
    | { kind: 'success'; profile: MyProfileResponse }
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

        return { kind: 'success', profile };
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
                    return { kind: 'notFound' };
                default:
                    if (error.status >= 500) {
                        return { kind: 'serverError' };
                    }
            }
        }

        return { kind: 'unknownError' };
    }
}
