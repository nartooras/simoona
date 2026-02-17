namespace Simoona.Modern.Api.Endpoints.Profiles;

public sealed record MyProfileResponse(
    string Id,
    string FullName,
    string? Email,
    string? JobTitle,
    string? Department,
    string? Office,
    string? TimeZone);
