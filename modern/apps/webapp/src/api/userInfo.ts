import { ApiHttpError, apiFetch } from './client';
import { buildApiAuthHeaders } from './authHeaders';

export type UserInfoResponse = {
    email: string | null;
    hasRegistered: boolean;
    loginProvider: string;
    impersonated: boolean;
    organizationId: number;
    userId: string;
    userName: string | null;
    fullName: string;
    cultureCode: string | null;
    timeZone: string | null;
    pictureId: string | null;
    permissions: string[];
    roles: string[];
};

export type UserInfoResult =
    | { kind: 'success'; userInfo: UserInfoResponse }
    | { kind: 'unauthorized' }
    | { kind: 'notFound' }
    | { kind: 'badRequest' }
    | { kind: 'serverError' }
    | { kind: 'unknownError' };

export async function fetchUserInfo(): Promise<UserInfoResult> {
    const authHeadersResult = buildApiAuthHeaders();
    if (authHeadersResult.kind === 'missingOrganization') {
        return { kind: 'badRequest' };
    }

    try {
        const userInfo = await apiFetch<UserInfoResponse>('/v1/account/user-info', {
            headers: authHeadersResult.headers,
        });

        return { kind: 'success', userInfo };
    } catch (error) {
        if (error instanceof ApiHttpError) {
            switch (error.status) {
                case 400:
                    return { kind: 'badRequest' };
                case 401:
                    return { kind: 'unauthorized' };
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
