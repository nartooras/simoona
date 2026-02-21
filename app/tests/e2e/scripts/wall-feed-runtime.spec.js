const path = require("node:path");
const { test, expect } = require("@playwright/test");

const baseUrl = process.env.WALL_FEED_BASE_URL ?? "http://127.0.0.1:5173";
const wallFeedRoute = "/default/Wall/Feed";

const viewports = [
  { id: "desktop", width: 1440, height: 900 },
  { id: "tablet", width: 1024, height: 1366 },
  { id: "mobile", width: 390, height: 844 }
];

for (const viewport of viewports) {
  test(`wall feed parity behavior and screenshot (${viewport.id})`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${baseUrl}${wallFeedRoute}`, { waitUntil: "networkidle" });

    await expect(page.locator('[data-app="simoona-modern-web-runtime"]')).toBeVisible();
    await expect(page.locator('[data-ui="legacy-feed-column"]')).toBeVisible();
    await expect(page.getByText("SIMOONA")).toBeVisible();
    await expect(page.locator(".menu-group h3", { hasText: "Walls" }).first()).toBeVisible();

    const likeCount = page.locator('[data-like-count="post-1"]');
    const before = Number.parseInt((await likeCount.textContent()) ?? "0", 10);
    await page.locator('[data-like-for="post-1"]').click();
    await expect(likeCount).toHaveText(String(before + 1));

    const replyForm = page.locator('[data-reply-form="post-1"]');
    await expect(replyForm).toBeHidden();
    await page.locator('[data-reply-for="post-1"]').click();
    await expect(replyForm).toBeVisible();

    const screenshotPath = path.join(
      __dirname,
      "..",
      "visual",
      "baselines",
      viewport.id,
      "wall-feed-runtime.png"
    );
    await page.screenshot({ path: screenshotPath, fullPage: true });
  });
}
