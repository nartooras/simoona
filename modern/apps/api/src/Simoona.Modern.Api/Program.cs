using Microsoft.AspNetCore.Authentication.JwtBearer;
using Simoona.Modern.Api.Auth;
using Simoona.Modern.Api.Endpoints.UserInfo;
using Simoona.Modern.Api.ReadDb;
using Simoona.Modern.Api.TenantContext;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddJsonConsole();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddJwtAuthentication(builder.Configuration, builder.Environment);

builder.Services.AddTenantContext();
builder.Services.AddReadOnlyDataAccess(builder.Configuration);
builder.Services.AddScoped<ICurrentUserResolver, HttpCurrentUserResolver>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();
app.UseTenantContext();

app.MapGet("/health", () => Results.Ok(new { status = "healthy" }))
    .WithName("Health");

var apiV1 = app.MapGroup("/api/v1");

apiV1.MapGet("/ping", () => Results.Ok(new { message = "pong" }))
    .WithName("Ping");

apiV1.MapGet("/tenant-context", (ITenantContextAccessor tenantContextAccessor) =>
    {
        var tenantContext = tenantContextAccessor.Current;
        return Results.Ok(new
        {
            tenantId = tenantContext.TenantId,
            organizationId = tenantContext.OrganizationId
        });
    })
    .WithName("GetTenantContext");

apiV1.MapUserInfoEndpoints();
apiV1.MapDevelopmentAuthEndpoints(app.Environment);

app.Run();

public partial class Program;
