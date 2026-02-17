namespace Simoona.Modern.Api.Endpoints.UserInfo;

public sealed record UserInfoResponse(
    string? Email,
    bool HasRegistered,
    string LoginProvider,
    bool Impersonated,
    int OrganizationId,
    string UserId,
    string? UserName,
    string FullName,
    string? CultureCode,
    string? TimeZone,
    string? PictureId,
    IReadOnlyList<string> Permissions,
    IReadOnlyList<string> Roles);
