import assert from "node:assert/strict";
import test from "node:test";

import { collectViolationsInContent } from "./check-modern-boundaries.mjs";

const IMPORT_FROM_SRC = `${"import"} x ${"from"} "src/shared/x";`;
const DYNAMIC_IMPORT_SRC = `const mod = ${"import"}("src/shared/x");`;
const REQUIRE_SRC = `const mod = ${"require"}("src/shared/x");`;
const IMPORT_FROM_ALIAS_SRC = `${"import"} x ${"from"} "@/src/shared/x";`;
const IMPORT_FROM_RELATIVE_SRC = `${"import"} x ${"from"} "../src/shared/x";`;
const IMPORT_FROM_ABSOLUTE_SRC = `${"import"} x ${"from"} "/Users/me/repo/src/shared/x";`;

function getViolations(line) {
  return collectViolationsInContent("modern/example.ts", `${line}\n`);
}

test("flags import from src root path", () => {
  const violations = getViolations(IMPORT_FROM_SRC);
  assert.equal(violations.length, 1);
});

test("flags dynamic import from src root path", () => {
  const violations = getViolations(DYNAMIC_IMPORT_SRC);
  assert.equal(violations.length, 1);
});

test("flags require from src root path", () => {
  const violations = getViolations(REQUIRE_SRC);
  assert.equal(violations.length, 1);
});

test("flags alias import from @/src path", () => {
  const violations = getViolations(IMPORT_FROM_ALIAS_SRC);
  assert.equal(violations.length, 1);
});

test("flags relative ../src import", () => {
  const violations = getViolations(IMPORT_FROM_RELATIVE_SRC);
  assert.equal(violations.length, 1);
});

test("flags absolute /src import", () => {
  const violations = getViolations(IMPORT_FROM_ABSOLUTE_SRC);
  assert.equal(violations.length, 1);
});

test("does not flag plain text mentioning src path", () => {
  const violations = getViolations('Documentation: from "src/shared/x" example');
  assert.equal(violations.length, 0);
});

test("does not flag comments without import/require form", () => {
  const violations = getViolations('// legacy lives in src/shared/x');
  assert.equal(violations.length, 0);
});
