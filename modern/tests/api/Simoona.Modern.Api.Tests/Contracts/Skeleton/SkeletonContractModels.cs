namespace Simoona.Modern.Api.Tests.Contracts.Skeleton;

internal sealed record HealthResponse(string Status);
internal sealed record PingResponse(string Message);
internal sealed record TenantContextResponse(string? TenantId, string? OrganizationId);
