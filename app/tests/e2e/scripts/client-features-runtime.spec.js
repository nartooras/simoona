const path = require("node:path");
const { test, expect } = require("@playwright/test");

const baseUrl = process.env.CLIENT_FEATURES_BASE_URL ?? "http://127.0.0.1:5173";

const viewports = [
  { id: "desktop", width: 1440, height: 900 },
  { id: "tablet", width: 1024, height: 1366 },
  { id: "mobile", width: 390, height: 844 }
];

const routeChecks = [
  { path: "/default/Wall/List", view: "wall-list", heading: "Discover walls" },
  { path: "/default/Wall/Create", view: "wall-manage", heading: "Discover walls" },
  { path: "/default/Wall/Edit/wall-1", view: "wall-manage", heading: "Discover walls" },
  { path: "/default/Wall/Members?wall=wall-1", view: "wall-members", heading: "Wall members" },
  { path: "/default/Events", view: "events-list", heading: "Events" },
  { path: "/default/Events/List/Leisure/office/Vilnius", view: "events-list-filtered", heading: "Events" },
  { path: "/default/Events/AddEvent", view: "events-manage", heading: "Events" },
  { path: "/default/Events/Edit/event-1", view: "events-manage", heading: "Events" },
  { path: "/default/Events/EventContent/event-1", view: "events-content", heading: "Event details" },
  { path: "/default/Events/Report", view: "events-report-list", heading: "Event reports" },
  { path: "/default/Events/Report/Report/Event/event-1", view: "events-report-details", heading: "Event report" },
  { path: "/default/Kudos", view: "kudos-dashboard", heading: "Kudos" },
  { path: "/default/Kudos/KudosAchievementBoard", view: "kudos-achievement-board", heading: "Kudos achievement board" },
  { path: "/default/Kudos/KudosLogList/1", view: "kudos-log-list", heading: "Kudos log" },
  { path: "/default/Kudos/KudosUserInformation/1", view: "kudos-user-information", heading: "Kudos user information" },
  { path: "/default/Books", view: "books-list", heading: "Books" },
  { path: "/default/Books/Add", view: "books-manage", heading: "Books" },
  { path: "/default/Books/Edit/book-1/office-1", view: "books-manage", heading: "Books" },
  { path: "/default/Projects", view: "projects-list", heading: "Projects" },
  { path: "/default/Projects/Create", view: "projects-manage", heading: "Projects" },
  { path: "/default/Projects/Edit/project-1", view: "projects-manage", heading: "Projects" },
  { path: "/default/Projects/Details/project-1", view: "projects-details", heading: "Project details" },
  { path: "/default/ServiceRequests/List?Id=sr-1001", view: "service-requests-list", heading: "Service requests" },
  { path: "/default/Vacation/List", view: "vacation-list", heading: "Vacation requests" },
  { path: "/default/Committees/List", view: "committees-list", heading: "Committees" },
  { path: "/default/Office?floorId=2&roomId=214&coords=143,212&user=anikoncukas", view: "office-map", heading: "Office map" },
  { path: "/default/OrganizationalStructure", view: "organizational-structure", heading: "Organizational structure" },
  { path: "/default/SubmitTicket", view: "submit-ticket", heading: "Submit ticket" }
];

for (const viewport of viewports) {
  test(`client feature parity behavior and screenshot (${viewport.id})`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const check of routeChecks) {
      await page.goto(`${baseUrl}${check.path}`, { waitUntil: "networkidle" });
      await expect(
        page.locator(`[data-ui="legacy-client-feature"][data-client-view="${check.view}"]`)
      ).toBeVisible();
      await expect(page.getByRole("heading", { name: check.heading })).toBeVisible();
    }

    await page.goto(`${baseUrl}/default/Wall/List`, { waitUntil: "networkidle" });
    const wallRows = page.locator("#client-list-rows tr");
    await expect(wallRows).toHaveCount(5);
    await page.locator("#client-list-filter").fill("Techies");
    await expect(page.locator("#client-list-rows tr")).toHaveCount(1);

    await page.goto(`${baseUrl}/default/Wall/Create`, { waitUntil: "networkidle" });
    const wallSave = page.locator("#client-wall-form-save");
    await expect(wallSave).toBeDisabled();
    await page.locator("#wall-name").fill("New wall");
    await expect(wallSave).toBeEnabled();
    await wallSave.click();
    await expect(page.locator("#client-wall-form-feedback")).toBeVisible();

    await page.goto(`${baseUrl}/default/Events/AddEvent`, { waitUntil: "networkidle" });
    const eventSave = page.locator("#client-events-form-save");
    await expect(eventSave).toBeDisabled();
    await page.locator("#event-title").fill("Parity event");
    await expect(eventSave).toBeEnabled();
    await eventSave.click();
    await expect(page.locator("#client-events-form-feedback")).toBeVisible();

    await page.goto(`${baseUrl}/default/SubmitTicket`, { waitUntil: "networkidle" });
    const ticketSave = page.locator("#client-submit-ticket-form-save");
    await expect(ticketSave).toBeDisabled();
    await page.locator("#ticket-subject").fill("Laptop issue");
    await page.locator("#ticket-description").fill("Cannot connect to VPN.");
    await expect(ticketSave).toBeEnabled();
    await ticketSave.click();
    await expect(page.locator("#client-submit-ticket-form-feedback")).toBeVisible();

    await page.goto(`${baseUrl}/default/Events/List`, { waitUntil: "networkidle" });
    const screenshotPath = path.join(
      __dirname,
      "..",
      "visual",
      "baselines",
      viewport.id,
      "client-features-runtime.png"
    );
    await page.screenshot({ path: screenshotPath, fullPage: true });
  });
}
