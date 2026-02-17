import assert from "node:assert/strict";
import test from "node:test";

import { transformToModernContracts } from "../lib/transform.mjs";

test("transform maps v1 entities and tracks unmapped fields", () => {
  const extracted = {
    legacy: {
      users: [
        {
          id: "user-1",
          organizationId: 7,
          firstName: "A",
          lastName: "B",
          email: "a@example.com",
          userName: "ab",
          jobTitle: "Eng",
          departmentName: "R&D",
          officeName: "HQ",
          cultureCode: "en-US",
          timeZone: "UTC",
          pictureId: "pic-1",
          legacyRaw: {
            id: "user-1",
            organizationId: 7,
            firstName: "A",
            lastName: "B",
            email: "a@example.com",
            userName: "ab",
            legacyExtra: "x"
          }
        }
      ],
      organizations: [
        {
          id: 7,
          name: "Org",
          tenantId: "tenant-a",
          legacyRaw: {
            id: 7,
            name: "Org",
            tenantId: "tenant-a",
            legacyRegion: "LT"
          }
        }
      ],
      employeeDirectory: [],
      generalSettings: []
    },
    counts: {
      users: 1,
      organizations: 1,
      employeeDirectory: 0,
      generalSettings: 0
    }
  };

  const transformed = transformToModernContracts(extracted);

  assert.equal(transformed.counts.usersProfileBasics, 1);
  assert.equal(transformed.counts.organizationReferences, 1);
  assert.equal(transformed.counts.employeeDirectory, 1);
  assert.equal(transformed.counts.generalSettingsEssentials, 1);

  assert.equal(transformed.modern.usersProfileBasics[0].fullName, "A B");
  assert.deepEqual(transformed.unmappedFields.users, ["legacyExtra"]);
  assert.deepEqual(transformed.unmappedFields.organizations, ["legacyRegion"]);
});
