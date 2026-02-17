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

export type MyProfileResponse = {
    id: string;
    fullName: string;
    email: string | null;
    jobTitle: string | null;
    department: string | null;
    office: string | null;
    timeZone: string | null;
};

function hasAuthorizationHeader(headers: HeadersInit): boolean {
    const normalized = new Headers(headers);
    return Boolean(normalized.get('Authorization'));
}

export function getTemporaryEmployeeDirectory(
    headers: HeadersInit,
):
    | { kind: 'success'; data: EmployeeDirectoryResponse }
    | { kind: 'unauthorized' } {
    if (!hasAuthorizationHeader(headers)) {
        return { kind: 'unauthorized' };
    }

    return {
        kind: 'success',
        data: {
            pagedList: [
                {
                    id: 'user-101',
                    firstName: 'Ada',
                    lastName: 'Lovelace',
                    jobTitle: 'Engineering Manager',
                    email: 'ada.lovelace@example.com',
                },
                {
                    id: 'user-102',
                    firstName: 'Grace',
                    lastName: 'Hopper',
                    jobTitle: 'Principal Engineer',
                    email: 'grace.hopper@example.com',
                },
                {
                    id: 'user-103',
                    firstName: 'Katherine',
                    lastName: 'Johnson',
                    jobTitle: 'Data Analyst',
                    email: 'katherine.johnson@example.com',
                },
            ],
            pageCount: 1,
            itemCount: 3,
            pageSize: 10,
        },
    };
}

export function getTemporaryMyProfile(
    headers: HeadersInit,
):
    | { kind: 'success'; data: MyProfileResponse }
    | { kind: 'unauthorized' }
    | { kind: 'notFound' } {
    if (!hasAuthorizationHeader(headers)) {
        return { kind: 'unauthorized' };
    }

    return {
        kind: 'success',
        data: {
            id: 'user-1',
            fullName: 'Ada Lovelace',
            email: 'ada.lovelace@example.com',
            jobTitle: 'Engineering Manager',
            department: 'Platform',
            office: 'Vilnius',
            timeZone: 'Europe/Vilnius',
        },
    };
}
