import { buildApiAuthHeaders } from './authHeaders';
import { ApiHttpError, apiFetch } from './client';
import { resolveDataSource, withDataSource, type DataSourceResult } from './dataSource';

export type MyProfileResponse = {
    id: string;
    fullName: string;
    email: string | null;
    jobTitle: string | null;
    department: string | null;
    office: string | null;
    timeZone: string | null;
};

export type MyProfileResult = DataSourceResult<
    | { kind: 'success'; profile: MyProfileResponse }
    | { kind: 'unauthorized' }
    | { kind: 'forbidden' }
    | { kind: 'notFound' }
    | { kind: 'badRequest' }
    | { kind: 'serverError' }
    | { kind: 'unknownError' }
>;

export async function fetchMyProfile(): Promise<MyProfileResult> {
    const dataSource = resolveDataSource('myProfile');
    const authHeadersResult = buildApiAuthHeaders();
    if (authHeadersResult.kind === 'missingOrganization') {
        return withDataSource({ kind: 'badRequest' }, dataSource);
    }

    try {
        const profile = await apiFetch<MyProfileResponse>('/v1/profiles/me', {
            headers: authHeadersResult.headers,
        });

        return withDataSource({ kind: 'success', profile }, dataSource);
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
