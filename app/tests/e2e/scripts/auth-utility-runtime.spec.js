const path = require("node:path");
const { test, expect } = require("@playwright/test");

const baseUrl = process.env.AUTH_UTILITY_BASE_URL ?? "http://127.0.0.1:5173";

const viewports = [
  { id: "desktop", width: 1440, height: 900 },
  { id: "tablet", width: 1024, height: 1366 },
  { id: "mobile", width: 390, height: 844 }
];

for (const viewport of viewports) {
  test(`auth/public/utility parity behavior and screenshot (${viewport.id})`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-ui="legacy-auth-view"][data-auth-view="public-login"]')).toBeVisible();

    await page.goto(`${baseUrl}/Login`, { waitUntil: "networkidle" });
    const publicAuth = page.locator('[data-ui="legacy-auth-view"][data-auth-view="public-login"]');
    await expect(publicAuth).toBeVisible();
    await page.locator("#auth-input-organizationName").fill("default");
    await page.locator("#auth-public-login-form-submit").click();
    await expect(page.locator("#auth-public-login-form-feedback")).toContainText("Organization found");

    await page.goto(`${baseUrl}/redirectTo/Wall.Feed`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-auth-view="redirect"]')).toBeVisible();

    await page.goto(`${baseUrl}/default`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-ui="legacy-auth-view"][data-auth-view="tenant-login"]')).toBeVisible();

    await page.goto(`${baseUrl}/default/Login`, { waitUntil: "networkidle" });
    const tenantAuth = page.locator('[data-ui="legacy-auth-view"][data-auth-view="tenant-login"]');
    await expect(tenantAuth).toBeVisible();
    await page.locator("#auth-input-email").fill("demo@simoona.com");
    await page.locator("#auth-input-password").fill("Password123");
    await page.locator("#auth-tenant-login-form-submit").click();
    await expect(page.locator("#auth-tenant-login-form-feedback")).toContainText("Login validated");
    await page.locator('[data-auth-provider="google"]').click();
    await expect(page.locator("#auth-provider-feedback")).toContainText("google sign-in flow started");

    await page.goto(`${baseUrl}/default/Register`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-auth-view="register"]')).toBeVisible();
    await page.locator("#auth-input-firstName").fill("Arturas");
    await page.locator("#auth-input-lastName").fill("Nikoncukas");
    await page.locator("#auth-input-email").fill("arturas@example.com");
    await page.locator("#auth-input-password").fill("Password123");
    await page.locator("#auth-input-repeatedPassword").fill("Password123");
    await page.locator("#auth-register-form-submit").click();
    await expect(page.locator("#auth-register-form-feedback")).toContainText("Registration request submitted");

    await page.goto(`${baseUrl}/default/Forgot`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-auth-view="forgot"]')).toBeVisible();
    await page.locator("#auth-input-email").fill("arturas@example.com");
    await page.locator("#auth-forgot-form-submit").click();
    await expect(page.locator("#auth-forgot-form-feedback")).toContainText("Password reset email sent");

    await page.goto(`${baseUrl}/default/Reset`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-auth-view="reset"]')).toBeVisible();
    await page.locator("#auth-input-password").fill("NewPassword123");
    await page.locator("#auth-input-confirmPassword").fill("NewPassword123");
    await page.locator("#auth-reset-form-submit").click();
    await expect(page.locator("#auth-reset-form-feedback")).toContainText("Password changed successfully");

    await page.goto(`${baseUrl}/default/Verify`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-auth-view="verify"] .auth-alert')).toContainText("Email verified successfully");

    await page.goto(`${baseUrl}/default/LogOff`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-auth-view="logoff"] .auth-alert')).toContainText("logged off");

    await page.goto(`${baseUrl}/default/AccessDenied`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-auth-view="access-denied"]')).toBeVisible();
    await expect(page.getByRole("heading", { name: "Access denied" })).toBeVisible();

    await page.goto(`${baseUrl}/default/PageNotFound`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-auth-view="page-not-found"]')).toBeVisible();
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();

    await page.goto(`${baseUrl}/default/Error/500`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-auth-view="error"]')).toBeVisible();
    await expect(page.getByRole("heading", { name: "Unexpected error" })).toBeVisible();

    await page.goto(`${baseUrl}/default/Login`, { waitUntil: "networkidle" });
    const screenshotPath = path.join(
      __dirname,
      "..",
      "visual",
      "baselines",
      viewport.id,
      "auth-utility-runtime.png"
    );
    await page.screenshot({ path: screenshotPath, fullPage: true });
  });
}
