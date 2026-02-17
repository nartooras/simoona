import { stableSortBy } from "./io.mjs";

const USER_MAPPED_FIELDS = new Set([
  "id",
  "userId",
  "organizationId",
  "orgId",
  "firstName",
  "lastName",
  "email",
  "userName",
  "username",
  "jobTitle",
  "departmentName",
  "officeName",
  "cultureCode",
  "timeZone",
  "pictureId",
]);

const ORG_MAPPED_FIELDS = new Set(["id", "organizationId", "name", "organizationName", "tenantId"]);
const EMPLOYEE_MAPPED_FIELDS = new Set([
  "id",
  "userId",
  "organizationId",
  "orgId",
  "firstName",
  "lastName",
  "jobTitle",
  "email",
]);
const SETTINGS_MAPPED_FIELDS = new Set([
  "organizationId",
  "orgId",
  "supportedLanguages",
  "defaultLanguage",
  "supportedTimeZones",
]);

function fullName(firstName, lastName) {
  return `${firstName ?? ""} ${lastName ?? ""}`.trim();
}

function collectUnmappedFields(records, mappedFields) {
  const result = new Set();
  for (const record of records) {
    const raw = record.legacyRaw ?? {};
    for (const key of Object.keys(raw)) {
      if (!mappedFields.has(key)) {
        result.add(key);
      }
    }
  }

  return stableSortBy([...result], (key) => key);
}

function deriveOrgRecordsFromUsers(users) {
  const map = new Map();

  for (const user of users) {
    if (user.organizationId == null) {
      continue;
    }

    if (!map.has(user.organizationId)) {
      map.set(user.organizationId, {
        organizationId: user.organizationId,
        name: `ORG-${user.organizationId}`,
        tenantId: null,
      });
    }
  }

  return stableSortBy([...map.values()], (org) => `${org.organizationId}`);
}

function deriveGeneralSettingsFromUsers(users) {
  const grouped = new Map();

  for (const user of users) {
    if (user.organizationId == null) {
      continue;
    }

    const current = grouped.get(user.organizationId) ?? {
      organizationId: user.organizationId,
      supportedLanguages: new Set(),
      supportedTimeZones: new Set(),
      defaultLanguage: null,
    };

    if (user.cultureCode) {
      current.supportedLanguages.add(user.cultureCode);
      current.defaultLanguage ??= user.cultureCode;
    }

    if (user.timeZone) {
      current.supportedTimeZones.add(user.timeZone);
    }

    grouped.set(user.organizationId, current);
  }

  return stableSortBy(
    [...grouped.values()].map((record) => ({
      organizationId: record.organizationId,
      supportedLanguages: stableSortBy([...record.supportedLanguages], (value) => value),
      defaultLanguage: record.defaultLanguage,
      supportedTimeZones: stableSortBy([...record.supportedTimeZones], (value) => value),
    })),
    (record) => `${record.organizationId}`,
  );
}

export function transformToModernContracts(extracted) {
  const users = extracted.legacy.users;
  const organizations = extracted.legacy.organizations;
  const employeeDirectory = extracted.legacy.employeeDirectory;
  const generalSettings = extracted.legacy.generalSettings;

  const usersProfileBasics = stableSortBy(
    users.map((user) => ({
      userId: user.id,
      organizationId: user.organizationId,
      fullName: fullName(user.firstName, user.lastName),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      jobTitle: user.jobTitle,
      department: user.departmentName,
      office: user.officeName,
      cultureCode: user.cultureCode,
      timeZone: user.timeZone,
      pictureId: user.pictureId,
    })),
    (user) => `${user.organizationId ?? ""}:${user.userId ?? ""}`,
  );

  const organizationReferences = stableSortBy(
    (
      organizations.length > 0
        ? organizations.map((org) => ({
            organizationId: org.id,
            name: org.name,
            tenantId: org.tenantId,
          }))
        : deriveOrgRecordsFromUsers(users)
    ),
    (org) => `${org.organizationId ?? ""}`,
  );

  const employeesSource = employeeDirectory.length > 0
    ? employeeDirectory
    : users.map((user) => ({
        id: user.id,
        organizationId: user.organizationId,
        firstName: user.firstName,
        lastName: user.lastName,
        jobTitle: user.jobTitle,
        email: user.email,
        legacyRaw: user.legacyRaw,
      }));

  const employeeDirectoryContracts = stableSortBy(
    employeesSource.map((employee) => ({
      id: employee.id,
      organizationId: employee.organizationId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      jobTitle: employee.jobTitle,
      email: employee.email,
    })),
    (employee) => `${employee.organizationId ?? ""}:${employee.id ?? ""}`,
  );

  const generalSettingsEssentials = stableSortBy(
    (
      generalSettings.length > 0
        ? generalSettings.map((settings) => ({
            organizationId: settings.organizationId,
            supportedLanguages: settings.supportedLanguages,
            defaultLanguage: settings.defaultLanguage,
            supportedTimeZones: settings.supportedTimeZones,
          }))
        : deriveGeneralSettingsFromUsers(users)
    ),
    (settings) => `${settings.organizationId ?? ""}`,
  );

  return {
    meta: {
      transformVersion: "dryrun-v1",
      deterministic: true,
    },
    modern: {
      usersProfileBasics,
      organizationReferences,
      employeeDirectory: employeeDirectoryContracts,
      generalSettingsEssentials,
    },
    counts: {
      usersProfileBasics: usersProfileBasics.length,
      organizationReferences: organizationReferences.length,
      employeeDirectory: employeeDirectoryContracts.length,
      generalSettingsEssentials: generalSettingsEssentials.length,
    },
    unmappedFields: {
      users: collectUnmappedFields(users, USER_MAPPED_FIELDS),
      organizations: collectUnmappedFields(organizations, ORG_MAPPED_FIELDS),
      employeeDirectory: collectUnmappedFields(employeeDirectory, EMPLOYEE_MAPPED_FIELDS),
      generalSettings: collectUnmappedFields(generalSettings, SETTINGS_MAPPED_FIELDS),
    },
    assumptions: [
      "When legacy organizations are missing, organization references are derived from users using ORG-{organizationId} placeholders.",
      "When legacy employee directory rows are missing, employee directory is derived from users/profile basics.",
      "When legacy general settings rows are missing, general settings are derived from users culture/timezone values.",
    ],
    todos: [
      "TODO: Replace organization placeholder names with authoritative organization lookup from legacy source.",
      "TODO: Confirm final legacy source for department and office mappings for profile response parity.",
      "TODO: Replace derived general settings fallback with dedicated legacy settings source once available.",
    ],
  };
}
