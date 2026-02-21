const path = require("node:path");
const { test, expect } = require("@playwright/test");

const baseUrl = process.env.PROFILE_SETTINGS_BASE_URL ?? "http://127.0.0.1:5173";

const viewports = [
  { id: "desktop", width: 1440, height: 900 },
  { id: "tablet", width: 1024, height: 1366 },
  { id: "mobile", width: 390, height: 844 }
];

for (const viewport of viewports) {
  test(`profile/settings parity behavior and screenshot (${viewport.id})`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    await page.goto(`${baseUrl}/default/Profiles/1`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-ui="legacy-profile-details"]')).toBeVisible();
    await expect(page.locator(".profile-display-name")).toHaveText("Arturas Nikoncukas");

    await page.goto(`${baseUrl}/default/Profiles/1/Edit/personal`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-ui="legacy-profile-edit"]')).toBeVisible();
    await page.locator('[data-profile-tab="job"]').click();
    await expect(page.locator('[data-profile-tab-content="job"]')).toBeVisible();
    await page.locator('[data-profile-tab="personal"]').click();
    await expect(page.locator('[data-profile-tab-content="personal"]')).toBeVisible();

    const profileSaveButton = page.locator("#profile-edit-save");
    await expect(profileSaveButton).toBeDisabled();
    await page.locator("#profile-personal-firstname").fill("Arturas Updated");
    await expect(profileSaveButton).toBeEnabled();
    await profileSaveButton.click();
    await expect(page.locator("#profile-edit-feedback")).toBeVisible();

    await page.goto(`${baseUrl}/default/Settings`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-ui="legacy-settings"]')).toBeVisible();
    await expect(page.locator('[data-settings-content="general"]')).toBeVisible();

    const settingsSaveButton = page.locator("#settings-general-save");
    await expect(settingsSaveButton).toBeDisabled();
    await page.locator("#settings-language").selectOption("lt");
    await expect(settingsSaveButton).toBeEnabled();
    await settingsSaveButton.click();
    await expect(page.locator("#settings-general-feedback")).toBeVisible();

    await page.locator('[data-settings-tab="notifications"]').click();
    await expect(page.locator('[data-settings-content="notifications"]')).toBeVisible();
    const firstNotificationCheckbox = page
      .locator('[data-settings-content="notifications"] [data-settings-checkbox]:not([disabled])')
      .first();
    await firstNotificationCheckbox.click();
    await expect(page.locator("#settings-notifications-save")).toBeEnabled();

    await page.locator('[data-settings-tab="providers"]').click();
    await expect(page.locator('[data-settings-content="providers"]')).toBeVisible();
    const unlinkButton = page.locator("[data-provider-unlink]").first();
    if (await unlinkButton.isVisible()) {
      const providerName = (await unlinkButton.getAttribute("data-provider-unlink")) || "";
      await unlinkButton.click();
      await expect(
        page.locator(`tr[data-provider-name='${providerName}'] [data-provider-link='${providerName}']`)
      ).toBeVisible();
    }

    const screenshotPath = path.join(
      __dirname,
      "..",
      "visual",
      "baselines",
      viewport.id,
      "profile-settings-runtime.png"
    );
    await page.screenshot({ path: screenshotPath, fullPage: true });
  });
}
