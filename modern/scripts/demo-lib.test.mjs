import assert from "node:assert/strict";
import test from "node:test";

import { assertApiHealthAndAuthBaseline, assertDemoEnvironmentConsistency, formatDemoFailure } from "./demo-lib.mjs";

const baseConfig = {
  apiOrigin: "http://127.0.0.1:5187",
  apiBaseUrl: "http://127.0.0.1:5187/api",
  devTokenEnabled: "true",
  organizationId: "7",
};

test("accepts deterministic demo env configuration", () => {
  assert.doesNotThrow(() => assertDemoEnvironmentConsistency(baseConfig));
});

test("rejects api base url outside configured api origin", () => {
  assert.throws(
    () =>
      assertDemoEnvironmentConsistency({
        ...baseConfig,
        apiBaseUrl: "http://127.0.0.1:6000/api",
      }),
    /must target http:\/\/127\.0\.0\.1:5187/,
  );
});

test("rejects when dev token bootstrap is disabled", () => {
  assert.throws(
    () =>
      assertDemoEnvironmentConsistency({
        ...baseConfig,
        devTokenEnabled: "false",
      }),
    /Auth__DevToken__Enabled must be 'true'/,
  );
});

test("validates api health and auth baseline", async () => {
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url, options });
    const headers = normalizeHeaders(options.headers);

    if (url.endsWith("/health")) {
      return jsonResponse(200, { status: "healthy" });
    }

    if (url.includes("/api/v1/account/user-info") && headers["x-org-id"] === "invalid-org") {
      return jsonResponse(400, { title: "Bad Request" });
    }

    const hasToken = typeof headers.authorization === "string" && headers.authorization.startsWith("Bearer ");
    if (!hasToken) {
      return jsonResponse(401, { title: "Unauthorized" });
    }

    if (url.includes("/account/user-info")) {
      return jsonResponse(200, { userId: "user-1" });
    }

    if (url.includes("/user/general-settings")) {
      return jsonResponse(200, { languages: [] });
    }

    if (url.includes("/employees")) {
      return jsonResponse(200, { pagedList: { items: [] } });
    }

    if (url.includes("/profiles/me")) {
      return jsonResponse(200, { id: "user-1" });
    }

    return jsonResponse(404, { title: "Not Found" });
  };

  await assertApiHealthAndAuthBaseline(baseConfig, "token-value", fetchImpl);
  assert.equal(calls.length, 10);
});

test("fails baseline when protected endpoint does not return unauthorized without token", async () => {
  const fetchImpl = async (url) => {
    if (url.endsWith("/health")) {
      return jsonResponse(200, { status: "healthy" });
    }

    return jsonResponse(500, { title: "Unexpected" });
  };

  await assert.rejects(
    () => assertApiHealthAndAuthBaseline(baseConfig, "token-value", fetchImpl),
    /must return 401 without token/,
  );
});

test("formats actionable failure hints for common demo command issues", () => {
  const message = formatDemoFailure(
    new Error("API port 5187 is already in use on 127.0.0.1. VITE_API_BASE_URL must target http://127.0.0.1:5187."),
    "demo:check",
  );

  assert.match(message, /\[demo:check\] hint 1: Port collision:/);
  assert.match(message, /\[demo:check\] hint 2: Environment mismatch:/);
});

test("formats db availability hints for startup failures", () => {
  const message = formatDemoFailure(
    new Error("SqlException: Login failed for user. ConnectionStrings__LegacyReadOnly was not accepted."),
    "demo:start",
  );

  assert.match(message, /Read DB unavailable:/);
});

function jsonResponse(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

function normalizeHeaders(headers) {
  if (!headers) {
    return {};
  }

  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers.map(([key, value]) => [String(key).toLowerCase(), String(value)]));
  }

  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [String(key).toLowerCase(), String(value)]),
  );
}
