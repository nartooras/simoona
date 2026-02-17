namespace Simoona.Modern.Api.Endpoints.Employees;

public sealed record EmployeeDirectoryResponse(
    IReadOnlyList<EmployeeDirectoryItemResponse> PagedList,
    int PageCount,
    int ItemCount,
    int PageSize);

public sealed record EmployeeDirectoryItemResponse(
    string Id,
    string FirstName,
    string LastName,
    string? JobTitle,
    string? Email);

public sealed record EmployeeDirectoryQuery(
    string? Search,
    int? Page,
    int? PageSize);
