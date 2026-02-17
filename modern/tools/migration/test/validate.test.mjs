import assert from "node:assert/strict";
import test from "node:test";

import { validateDryRunResult } from "../lib/validate.mjs";

test("validate returns error for missing organization reference", () => {
  const extracted = {
    counts: {
      users: 1,
      organizations: 0,
      employeeDirectory: 1,
      generalSettings: 0,
    },
  };

  const transformed = {
    modern: {
      usersProfileBasics: [
        {
          userId: "user-1",
          organizationId: 7,
        },
      ],
      organizationReferences: [],
      employeeDirectory: [
        {
          id: "user-1",
          organizationId: 7,
        },
      ],
      generalSettingsEssentials: [],
    },
    counts: {
      usersProfileBasics: 1,
      organizationReferences: 0,
      employeeDirectory: 1,
      generalSettingsEssentials: 0,
    },
    unmappedFields: {
      users: [],
      organizations: [],
      employeeDirectory: [],
      generalSettings: [],
    },
  };

  const result = validateDryRunResult(extracted, transformed);

  assert.equal(result.isValid, false);
  assert.ok(result.errors.some((entry) => entry.code === "PROFILE_ORG_REFERENCE_MISSING"));
  assert.ok(result.errors.some((entry) => entry.code === "EMPLOYEE_ORG_REFERENCE_MISSING"));
});
