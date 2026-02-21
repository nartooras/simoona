const path = require("node:path");
const { test, expect } = require("@playwright/test");

const baseUrl = process.env.ADMIN_BASE_URL ?? "http://127.0.0.1:5173";

const viewports = [
  { id: "desktop", width: 1440, height: 900 },
  { id: "tablet", width: 1024, height: 1366 },
  { id: "mobile", width: 390, height: 844 }
];

for (const viewport of viewports) {
  test(`admin parity behavior and screenshot (${viewport.id})`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    await page.goto(`${baseUrl}/default/Admin/Users`, { waitUntil: "networkidle" });
    await expect(page.locator('[data-ui="legacy-admin-page"]')).toBeVisible();
    await expect(page.getByRole("heading", { name: "Application users" })).toBeVisible();

    const userRows = page.locator("#admin-list-rows tr");
    await expect(userRows).toHaveCount(8);

    const filterInput = page.locator("#admin-list-filter");
    await filterInput.fill("Support Specialist");
    await expect(page.locator("#admin-list-rows tr")).toHaveCount(1);
    await expect(page.getByText("Support Specialist")).toBeVisible();

    await filterInput.fill("");
    await expect(page.locator("#admin-list-rows tr")).toHaveCount(8);

    await page.locator('.admin-sort-link[data-admin-sort-key="jobTitle"]').click();
    await expect(page.locator("#admin-list-rows tr")).toHaveCount(8);

    await page.goto(`${baseUrl}/default/Admin/Roles`, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "Roles" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Create new" })).toBeVisible();

    await page.goto(`${baseUrl}/default/Admin/Roles/Create`, { waitUntil: "networkidle" });
    await expect(page.locator("#admin-form")).toBeVisible();
    const adminSaveButton = page.locator("#admin-form-save");
    await expect(adminSaveButton).toBeDisabled();
    await page.locator("#role-name").fill("QA Reviewer");
    await expect(adminSaveButton).toBeEnabled();
    await adminSaveButton.click();
    await expect(page.locator("#admin-form-feedback")).toBeVisible();

    await page.goto(`${baseUrl}/default/Admin/Customization`, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "Customization" })).toBeVisible();
    await expect(page.locator(".admin-card-link")).toHaveCount(7);

    await page.goto(`${baseUrl}/default/Admin/KudosBasket`, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "Kudos basket administration" })).toBeVisible();
    const kudosSaveButton = page.locator("#admin-form-save");
    await expect(kudosSaveButton).toBeDisabled();
    await page.locator("#kudos-basket-title").fill("Donation basket updated");
    await expect(kudosSaveButton).toBeEnabled();
    await kudosSaveButton.click();
    await expect(page.locator("#admin-form-feedback")).toBeVisible();

    await page.goto(`${baseUrl}/default/Admin/Lotteries/List`, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "Lotteries" })).toBeVisible();
    await expect(page.locator(".admin-table")).toBeVisible();

    await page.goto(`${baseUrl}/default/Admin/Lotteries/lottery-1/Refunding`, { waitUntil: "networkidle" });
    await expect(page.locator("#admin-refund-message")).toContainText("Refund completed");
    await page.locator("#admin-refund-action").click();
    await expect(page.locator("#admin-refund-message")).toContainText("Refund failed");

    await page.goto(`${baseUrl}/default/Admin/Users`, { waitUntil: "networkidle" });
    const screenshotPath = path.join(
      __dirname,
      "..",
      "visual",
      "baselines",
      viewport.id,
      "admin-runtime.png"
    );
    await page.screenshot({ path: screenshotPath, fullPage: true });
  });
}
