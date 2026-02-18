import { ApiHttpError, apiFetch } from './client';
import { buildApiAuthHeaders } from './authHeaders';
import { resolveDataSource, withDataSource, type DataSourceResult } from './dataSource';

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

export type UserInfoResult = DataSourceResult<
    | { kind: 'success'; userInfo: UserInfoResponse }
    | { kind: 'unauthorized' }
    | { kind: 'notFound' }
    | { kind: 'badRequest' }
    | { kind: 'serverError' }
    | { kind: 'unknownError' }
>;

export async function fetchUserInfo(): Promise<UserInfoResult> {
    const dataSource = resolveDataSource('userInfo');
    const authHeadersResult = buildApiAuthHeaders();
    if (authHeadersResult.kind === 'missingOrganization') {
        return withDataSource({ kind: 'badRequest' }, dataSource);
    }

    try {
        const userInfo = await apiFetch<UserInfoResponse>('/v1/account/user-info', {
            headers: authHeadersResult.headers,
        });

        return withDataSource({ kind: 'success', userInfo }, dataSource);
    } catch (error) {
        if (error instanceof ApiHttpError) {
            switch (error.status) {
                case 400:
                    return withDataSource({ kind: 'badRequest' }, dataSource);
                case 401:
                    return withDataSource({ kind: 'unauthorized' }, dataSource);
                case 404:
                    return withDataSource({ kind: 'notFound' }, dataSource);
                default:
                    if (error.status >= 500) {
                        return withDataSource({ kind: 'serverError' }, dataSource);
                    }
            }
        }

        return withDataSource({ kind: 'unknownError' }, dataSource);
    }
}
