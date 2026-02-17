using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Simoona.Modern.Api.Auth;

public static class JwtAuthServiceCollectionExtensions
{
    public static IServiceCollection AddJwtAuthentication(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostEnvironment hostEnvironment)
    {
        var authOptions = BindJwtOptions(configuration);
        ValidateJwtOptions(authOptions, hostEnvironment);

        services.AddSingleton(authOptions);
        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => ConfigureJwtBearerOptions(options, authOptions));

        services
            .AddAuthorizationBuilder()
            .AddPolicy(
                AuthorizationPolicies.AuthenticatedUser,
                policy => policy.RequireAuthenticatedUser());

        return services;
    }

    private static JwtAuthOptions BindJwtOptions(IConfiguration configuration)
    {
        var configured = configuration.GetSection(JwtAuthOptions.SectionName).Get<JwtAuthOptions>() ?? new JwtAuthOptions();
        return new JwtAuthOptions
        {
            Issuer = Normalize(configured.Issuer),
            Audience = Normalize(configured.Audience),
            Authority = Normalize(configured.Authority),
            SigningKey = Normalize(configured.SigningKey),
            RequireHttpsMetadata = configured.RequireHttpsMetadata
        };
    }

    private static void ConfigureJwtBearerOptions(JwtBearerOptions options, JwtAuthOptions authOptions)
    {
        options.MapInboundClaims = false;
        options.RequireHttpsMetadata = authOptions.RequireHttpsMetadata;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = authOptions.Issuer,
            ValidateAudience = true,
            ValidAudience = authOptions.Audience,
            ValidateLifetime = true,
            RequireExpirationTime = true,
            ValidateIssuerSigningKey = true,
            NameClaimType = "sub",
            ClockSkew = TimeSpan.FromMinutes(1)
        };

        if (!string.IsNullOrWhiteSpace(authOptions.Authority))
        {
            options.Authority = authOptions.Authority;
            return;
        }

        var signingKeyBytes = Encoding.UTF8.GetBytes(authOptions.SigningKey!);
        options.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(signingKeyBytes);
    }

    private static void ValidateJwtOptions(JwtAuthOptions authOptions, IHostEnvironment hostEnvironment)
    {
        if (string.IsNullOrWhiteSpace(authOptions.Issuer))
        {
            throw new InvalidOperationException($"Missing required configuration '{JwtAuthOptions.SectionName}:Issuer'.");
        }

        if (string.IsNullOrWhiteSpace(authOptions.Audience))
        {
            throw new InvalidOperationException($"Missing required configuration '{JwtAuthOptions.SectionName}:Audience'.");
        }

        var hasAuthority = !string.IsNullOrWhiteSpace(authOptions.Authority);
        var hasSigningKey = !string.IsNullOrWhiteSpace(authOptions.SigningKey);
        if (hasAuthority == hasSigningKey)
        {
            throw new InvalidOperationException(
                $"Configure exactly one of '{JwtAuthOptions.SectionName}:Authority' or '{JwtAuthOptions.SectionName}:SigningKey'.");
        }

        if (hasSigningKey && !IsDevOrTesting(hostEnvironment))
        {
            throw new InvalidOperationException(
                $"'{JwtAuthOptions.SectionName}:SigningKey' is only allowed in Development/Testing. Use '{JwtAuthOptions.SectionName}:Authority' for non-dev environments.");
        }

        if (hasSigningKey && authOptions.SigningKey!.Length < 32)
        {
            throw new InvalidOperationException(
                $"'{JwtAuthOptions.SectionName}:SigningKey' must be at least 32 characters.");
        }
    }

    private static bool IsDevOrTesting(IHostEnvironment hostEnvironment) =>
        hostEnvironment.IsDevelopment() || hostEnvironment.IsEnvironment("Testing");

    private static string? Normalize(string? rawValue)
    {
        if (string.IsNullOrWhiteSpace(rawValue))
        {
            return null;
        }

        var trimmed = rawValue.Trim();
        if (trimmed.StartsWith("__", StringComparison.Ordinal) && trimmed.EndsWith("__", StringComparison.Ordinal))
        {
            return null;
        }

        return trimmed;
    }
}
