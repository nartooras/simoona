function error(code, entity, message) {
  return { code, entity, message };
}

function warning(code, entity, message) {
  return { code, entity, message };
}

function validateRequiredString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateDryRunResult(extracted, transformed) {
  const errors = [];
  const warnings = [];

  const organizations = new Set(
    transformed.modern.organizationReferences
      .map((org) => org.organizationId)
      .filter((orgId) => Number.isInteger(orgId)),
  );

  const seenProfileKeys = new Set();
  for (const profile of transformed.modern.usersProfileBasics) {
    const key = `${profile.organizationId}:${profile.userId}`;
    if (seenProfileKeys.has(key)) {
      errors.push(error("DUPLICATE_PROFILE", "usersProfileBasics", `Duplicate profile key ${key}.`));
    }
    seenProfileKeys.add(key);

    if (!validateRequiredString(profile.userId)) {
      errors.push(error("PROFILE_USER_ID_REQUIRED", "usersProfileBasics", "Profile userId is required."));
    }

    if (!Number.isInteger(profile.organizationId)) {
      errors.push(error("PROFILE_ORG_ID_REQUIRED", "usersProfileBasics", "Profile organizationId must be integer."));
    } else if (!organizations.has(profile.organizationId)) {
      errors.push(
        error(
          "PROFILE_ORG_REFERENCE_MISSING",
          "usersProfileBasics",
          `Profile org ${profile.organizationId} not found in organizationReferences.`,
        ),
      );
    }
  }

  const profileKeySet = new Set(
    transformed.modern.usersProfileBasics.map((profile) => `${profile.organizationId}:${profile.userId}`),
  );

  for (const employee of transformed.modern.employeeDirectory) {
    if (!validateRequiredString(employee.id)) {
      errors.push(error("EMPLOYEE_ID_REQUIRED", "employeeDirectory", "Employee id is required."));
    }

    if (!Number.isInteger(employee.organizationId)) {
      errors.push(error("EMPLOYEE_ORG_ID_REQUIRED", "employeeDirectory", "Employee organizationId must be integer."));
      continue;
    }

    if (!organizations.has(employee.organizationId)) {
      errors.push(
        error(
          "EMPLOYEE_ORG_REFERENCE_MISSING",
          "employeeDirectory",
          `Employee org ${employee.organizationId} not found in organizationReferences.`,
        ),
      );
    }

    const key = `${employee.organizationId}:${employee.id}`;
    if (!profileKeySet.has(key)) {
      warnings.push(
        warning(
          "EMPLOYEE_PROFILE_MISSING",
          "employeeDirectory",
          `Employee ${key} does not have a matching usersProfileBasics record.`,
        ),
      );
    }
  }

  for (const settings of transformed.modern.generalSettingsEssentials) {
    if (!Number.isInteger(settings.organizationId)) {
      errors.push(
        error(
          "GENERAL_SETTINGS_ORG_ID_REQUIRED",
          "generalSettingsEssentials",
          "General settings organizationId must be integer.",
        ),
      );
      continue;
    }

    if (!organizations.has(settings.organizationId)) {
      errors.push(
        error(
          "GENERAL_SETTINGS_ORG_REFERENCE_MISSING",
          "generalSettingsEssentials",
          `General settings org ${settings.organizationId} not found in organizationReferences.`,
        ),
      );
    }
  }

  if (extracted.counts.users !== transformed.counts.usersProfileBasics) {
    warnings.push(
      warning(
        "COUNT_USERS_MISMATCH",
        "counts",
        `Extracted users (${extracted.counts.users}) differ from transformed usersProfileBasics (${transformed.counts.usersProfileBasics}).`,
      ),
    );
  }

  if (extracted.counts.organizations > 0 && extracted.counts.organizations !== transformed.counts.organizationReferences) {
    warnings.push(
      warning(
        "COUNT_ORGANIZATIONS_MISMATCH",
        "counts",
        `Extracted organizations (${extracted.counts.organizations}) differ from transformed organizationReferences (${transformed.counts.organizationReferences}).`,
      ),
    );
  }

  for (const [entity, fields] of Object.entries(transformed.unmappedFields)) {
    if (fields.length > 0) {
      warnings.push(
        warning(
          "UNMAPPED_FIELDS",
          entity,
          `Unmapped fields in ${entity}: ${fields.join(", ")}.`,
        ),
      );
    }
  }

  return {
    errors,
    warnings,
    isValid: errors.length === 0,
  };
}
