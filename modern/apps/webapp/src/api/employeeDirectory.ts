import { buildApiAuthHeaders } from './authHeaders';
import { ApiHttpError, apiFetch } from './client';
import { resolveDataSource, withDataSource, type DataSourceResult } from './dataSource';

export type EmployeeDirectoryItem = {
    id: string;
    firstName: string;
    lastName: string;
    jobTitle: string | null;
    email: string | null;
};

export type EmployeeDirectoryResponse = {
    pagedList: EmployeeDirectoryItem[];
    pageCount: number;
    itemCount: number;
    pageSize: number;
};

export type EmployeeDirectoryResult = DataSourceResult<
    | { kind: 'success'; directory: EmployeeDirectoryResponse }
    | { kind: 'empty' }
    | { kind: 'unauthorized' }
    | { kind: 'forbidden' }
    | { kind: 'notFound' }
    | { kind: 'badRequest' }
    | { kind: 'serverError' }
    | { kind: 'unknownError' }
>;

export async function fetchEmployeeDirectory(): Promise<EmployeeDirectoryResult> {
    const dataSource = resolveDataSource('employees');
    const authHeadersResult = buildApiAuthHeaders();
    if (authHeadersResult.kind === 'missingOrganization') {
        return withDataSource({ kind: 'badRequest' }, dataSource);
    }

    try {
        const directory = await apiFetch<EmployeeDirectoryResponse>('/v1/employees', {
            headers: authHeadersResult.headers,
        });

        if (directory.pagedList.length === 0) {
            return withDataSource({ kind: 'empty' }, dataSource);
        }

        return withDataSource({ kind: 'success', directory }, dataSource);
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
