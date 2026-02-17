import { buildApiAuthHeaders } from './authHeaders';
import { ApiHttpError, apiFetch } from './client';

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

export type EmployeeDirectoryResult =
    | { kind: 'success'; directory: EmployeeDirectoryResponse }
    | { kind: 'empty' }
    | { kind: 'unauthorized' }
    | { kind: 'forbidden' }
    | { kind: 'notFound' }
    | { kind: 'badRequest' }
    | { kind: 'serverError' }
    | { kind: 'unknownError' };

export async function fetchEmployeeDirectory(): Promise<EmployeeDirectoryResult> {
    const authHeadersResult = buildApiAuthHeaders();
    if (authHeadersResult.kind === 'missingOrganization') {
        return { kind: 'badRequest' };
    }

    try {
        const directory = await apiFetch<EmployeeDirectoryResponse>('/v1/employees', {
            headers: authHeadersResult.headers,
        });

        if (directory.pagedList.length === 0) {
            return { kind: 'empty' };
        }

        return { kind: 'success', directory };
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
