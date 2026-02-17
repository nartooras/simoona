namespace Simoona.Modern.Api.ReadDb;

public sealed class LegacyUserReadModel
{
    public string Id { get; set; } = string.Empty;
    public int OrganizationId { get; set; }
    public string? Email { get; set; }
    public string? UserName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public int? JobPositionId { get; set; }
    public string? CultureCode { get; set; }
    public string? TimeZone { get; set; }
    public string? PictureId { get; set; }
}
