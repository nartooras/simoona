import { ApiHttpError, apiFetch } from './client';

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

function getOrganizationIdHeaderValue(): string | null {
    const rawValue = import.meta.env.VITE_API_ORGANIZATION_ID?.trim();

    if (!rawValue) {
        return null;
    }

    if (!/^\d+$/.test(rawValue)) {
        return null;
    }

    return rawValue;
}

function getBearerToken(): string | null {
    const token = import.meta.env.VITE_API_BEARER_TOKEN?.trim();
    return token ? token : null;
}

export async function fetchUserInfo(): Promise<UserInfoResult> {
    const organizationId = getOrganizationIdHeaderValue();
    if (!organizationId) {
        return { kind: 'badRequest' };
    }

    const token = getBearerToken();
    const headers: HeadersInit = {
        'X-Org-Id': organizationId,
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        const userInfo = await apiFetch<UserInfoResponse>('/v1/account/user-info', {
            headers,
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
