export type ApiAuthHeadersResult =
    | { kind: 'success'; headers: HeadersInit }
    | { kind: 'missingOrganization' };

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

export function buildApiAuthHeaders(): ApiAuthHeadersResult {
    const organizationId = getOrganizationIdHeaderValue();
    if (!organizationId) {
        return { kind: 'missingOrganization' };
    }

    const token = getBearerToken();
    const headers: HeadersInit = {
        'X-Org-Id': organizationId,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return { kind: 'success', headers };
}
