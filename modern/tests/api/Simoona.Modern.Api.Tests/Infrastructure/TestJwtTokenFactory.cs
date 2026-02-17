using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Simoona.Modern.Api.Tests.Infrastructure;

public static class TestJwtTokenFactory
{
    public const string Issuer = "https://local.simoona.test";
    public const string Audience = "modern-api";
    public const string SigningKey = "dev-local-signing-key-change-me-000001";

    public static string CreateToken(
        string? userId = "user-1",
        string orgId = "7",
        string tenantId = "tenant-a",
        int expiresMinutes = 30)
    {
        var now = DateTimeOffset.UtcNow;
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SigningKey));
        var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new("org_id", orgId),
            new("tenant_id", tenantId),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N"))
        };

        if (!string.IsNullOrWhiteSpace(userId))
        {
            claims.Add(new Claim("sub", userId));
        }

        var token = new JwtSecurityToken(
            issuer: Issuer,
            audience: Audience,
            claims: claims,
            notBefore: now.UtcDateTime,
            expires: now.AddMinutes(expiresMinutes).UtcDateTime,
            signingCredentials: signingCredentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
