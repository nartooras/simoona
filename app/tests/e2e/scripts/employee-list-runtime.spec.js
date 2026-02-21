const path = require("node:path");
const { test, expect } = require("@playwright/test");

const baseUrl = process.env.EMPLOYEE_LIST_BASE_URL ?? "http://127.0.0.1:5173";
const employeeListRoute = "/default/Employee/List";

const viewports = [
  { id: "desktop", width: 1440, height: 900 },
  { id: "tablet", width: 1024, height: 1366 },
  { id: "mobile", width: 390, height: 844 }
];

for (const viewport of viewports) {
  test(`employee list parity behavior and screenshot (${viewport.id})`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${baseUrl}${employeeListRoute}`, { waitUntil: "networkidle" });

    await expect(page.locator('[data-app="simoona-modern-web-runtime"]')).toBeVisible();
    await expect(page.locator('[data-ui="legacy-employee-list"]')).toBeVisible();
    await expect(page.getByRole("heading", { name: "Employee List" })).toBeVisible();

    const rows = page.locator("#employee-rows tr");
    await expect(rows).toHaveCount(10);

    const filterInput = page.locator("#employee-filter");
    await filterInput.fill("Full-Stack Developer");
    await expect(page.locator("#employee-rows tr")).toHaveCount(1);
    await expect(page.getByText("Full-Stack Developer")).toBeVisible();

    await filterInput.fill("");
    await expect(page.locator("#employee-rows tr")).toHaveCount(10);

    const pageTwoButton = page.locator('[data-page="2"]');
    await expect(pageTwoButton).toBeVisible();
    await pageTwoButton.click();
    await expect(pageTwoButton).toHaveClass(/is-current/);

    const sortByJobTitle = page.locator('.sort-link[data-sort-key="jobTitle"]');
    await sortByJobTitle.click();
    await expect(page.locator("#employee-rows tr")).toHaveCount(10);

    const screenshotPath = path.join(
      __dirname,
      "..",
      "visual",
      "baselines",
      viewport.id,
      "employee-list-runtime.png"
    );
    await page.screenshot({ path: screenshotPath, fullPage: true });
  });
}
