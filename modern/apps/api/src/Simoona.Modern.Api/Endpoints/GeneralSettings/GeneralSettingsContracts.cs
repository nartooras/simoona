using System.Globalization;

namespace Simoona.Modern.Api.Endpoints.GeneralSettings;

public sealed record GeneralSettingsResponse(
    IReadOnlyList<GeneralSettingsLanguageOption> Languages,
    IReadOnlyList<GeneralSettingsTimeZoneOption> TimeZones);

public sealed record GeneralSettingsLanguageOption(
    string DisplayName,
    string Name,
    bool IsSelected);

public sealed record GeneralSettingsTimeZoneOption(
    string Id,
    string DisplayName,
    bool IsSelected);

public static class GeneralSettingsResponseFactory
{
    private static readonly IReadOnlyList<CultureInfo> SupportedLanguages = new[]
    {
        CultureInfo.GetCultureInfo("en-US"),
        CultureInfo.GetCultureInfo("lt-LT")
    };

    public static GeneralSettingsResponse Create(string? selectedCultureCode, string? selectedTimeZoneId)
    {
        var selectedCultureLcid = ResolveCultureLcid(selectedCultureCode);

        var languages = SupportedLanguages
            .Select(culture => new GeneralSettingsLanguageOption(
                DisplayName: culture.DisplayName,
                Name: culture.Name,
                IsSelected: selectedCultureLcid.HasValue && selectedCultureLcid.Value == culture.LCID))
            .OrderBy(language => language.DisplayName, StringComparer.Ordinal)
            .ToArray();

        var timeZones = TimeZoneInfo.GetSystemTimeZones()
            .Select(timeZone => new GeneralSettingsTimeZoneOption(
                Id: timeZone.Id,
                DisplayName: timeZone.DisplayName,
                IsSelected: string.Equals(timeZone.Id, selectedTimeZoneId, StringComparison.OrdinalIgnoreCase)))
            .ToArray();

        return new GeneralSettingsResponse(languages, timeZones);
    }

    private static int? ResolveCultureLcid(string? selectedCultureCode)
    {
        if (string.IsNullOrWhiteSpace(selectedCultureCode))
        {
            return null;
        }

        try
        {
            return CultureInfo.GetCultureInfo(selectedCultureCode).LCID;
        }
        catch (CultureNotFoundException)
        {
            return null;
        }
    }
}
