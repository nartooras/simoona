import { readJsonFile, stableSortBy } from "./io.mjs";

function toInt(value) {
  const converted = Number.parseInt(String(value), 10);
  return Number.isFinite(converted) ? converted : null;
}

function normalizeUsers(input) {
  return stableSortBy(
    (input ?? []).map((user) => ({
      id: user.id ?? user.userId ?? null,
      organizationId: toInt(user.organizationId ?? user.orgId),
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      email: user.email ?? null,
      userName: user.userName ?? user.username ?? null,
      jobTitle: user.jobTitle ?? null,
      departmentName: user.departmentName ?? null,
      officeName: user.officeName ?? null,
      cultureCode: user.cultureCode ?? null,
      timeZone: user.timeZone ?? null,
      pictureId: user.pictureId ?? null,
      legacyRaw: user,
    })),
    (user) => `${user.organizationId ?? ""}:${user.id ?? ""}`,
  );
}

function normalizeOrganizations(input) {
  return stableSortBy(
    (input ?? []).map((org) => ({
      id: toInt(org.id ?? org.organizationId),
      name: org.name ?? org.organizationName ?? null,
      tenantId: org.tenantId ?? null,
      legacyRaw: org,
    })),
    (org) => `${org.id ?? ""}`,
  );
}

function normalizeEmployees(input) {
  return stableSortBy(
    (input ?? []).map((employee) => ({
      id: employee.id ?? employee.userId ?? null,
      organizationId: toInt(employee.organizationId ?? employee.orgId),
      firstName: employee.firstName ?? null,
      lastName: employee.lastName ?? null,
      jobTitle: employee.jobTitle ?? null,
      email: employee.email ?? null,
      legacyRaw: employee,
    })),
    (employee) => `${employee.organizationId ?? ""}:${employee.id ?? ""}`,
  );
}

function normalizeGeneralSettings(input) {
  return stableSortBy(
    (input ?? []).map((settings) => ({
      organizationId: toInt(settings.organizationId ?? settings.orgId),
      supportedLanguages: Array.isArray(settings.supportedLanguages)
        ? [...settings.supportedLanguages].sort((a, b) => String(a).localeCompare(String(b), "en"))
        : [],
      defaultLanguage: settings.defaultLanguage ?? null,
      supportedTimeZones: Array.isArray(settings.supportedTimeZones)
        ? [...settings.supportedTimeZones].sort((a, b) => String(a).localeCompare(String(b), "en"))
        : [],
      legacyRaw: settings,
    })),
    (settings) => `${settings.organizationId ?? ""}`,
  );
}

export function extractLegacySnapshot({ inputPath, source, runAtUtc }) {
  const raw = readJsonFile(inputPath);
  const users = normalizeUsers(raw.users ?? raw.AspNetUsers ?? []);
  const organizations = normalizeOrganizations(raw.organizations ?? raw.Organizations ?? []);
  const employeeDirectory = normalizeEmployees(raw.employeeDirectory ?? raw.Employees ?? []);
  const generalSettings = normalizeGeneralSettings(raw.generalSettings ?? raw.GeneralSettings ?? []);

  return {
    meta: {
      source,
      runAtUtc,
      extractMode: "read-only",
      deterministic: true,
    },
    legacy: {
      users,
      organizations,
      employeeDirectory,
      generalSettings,
    },
    counts: {
      users: users.length,
      organizations: organizations.length,
      employeeDirectory: employeeDirectory.length,
      generalSettings: generalSettings.length,
    },
  };
}
