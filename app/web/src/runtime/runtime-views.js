import { escapeHtml, isPathActive } from "./runtime-shared.js";
import { renderWallFeed } from "../features/wall-feed/render.js";
import { renderEmployeeList } from "../features/employee-list/render.js";
import { renderProfilePage } from "../features/profile/render.js";
import { renderSettingsPage } from "../features/settings/render.js";
import { renderAdminActionButtons, renderAdminPage } from "../features/admin/render.js";
import { renderClientFeaturePage } from "../features/client-feature/render.js";
import { renderAuthUtilityPage } from "../features/auth-utility/render.js";
import { renderFallback } from "../features/fallback/render.js";

export { renderAdminActionButtons };

export function renderRuntimeShell(context) {
  const runtimeData = context.runtimeData;
  const leftMenuGroups = context.leftMenuGroups;

  const topLinks = Array.isArray(runtimeData.navItems)
    ? runtimeData.navItems
        .map(
          (item) =>
            `<a href="${escapeHtml(item.path)}" class="top-nav-link" data-nav="${escapeHtml(item.id)}">${escapeHtml(item.title)}</a>`
        )
        .join("")
    : "";

  const leftMenuMarkup = leftMenuGroups
    .map((group) => {
      const itemsMarkup = Array.isArray(group.items)
        ? group.items
            .map((item) => {
              const activeClass = isPathActive(item.path, runtimeData.route) ? " is-active" : "";
              const linkAttrs = item.external ? 'target="_blank" rel="noopener noreferrer"' : "";
              return `<li><a class="left-menu-link${activeClass}" href="${escapeHtml(item.path)}" ${linkAttrs}>${escapeHtml(item.label)}</a></li>`;
            })
            .join("")
        : "";

      return `
      <section class="left-menu-group menu-group" data-group="${escapeHtml(group.id)}">
        <h3 class="left-menu-group-title">${escapeHtml(group.title)}</h3>
        <ul>${itemsMarkup}</ul>
      </section>
    `;
    })
    .join("");

  const hasWallFeed = runtimeData.wallFeed && Array.isArray(runtimeData.wallFeed.posts);
  const hasEmployeeList = runtimeData.employeeList && Array.isArray(runtimeData.employeeList.rows);
  const hasProfilePage = runtimeData.profilePage && typeof runtimeData.profilePage.mode === "string";
  const hasSettingsPage = runtimeData.settingsPage && typeof runtimeData.settingsPage.activeTab === "string";
  const hasClientFeaturePage =
    runtimeData.clientFeaturePage && typeof runtimeData.clientFeaturePage.view === "string";
  const hasAdminPage = runtimeData.adminPage && typeof runtimeData.adminPage.view === "string";
  const hasAuthUtilityPage =
    runtimeData.authUtilityPage && typeof runtimeData.authUtilityPage.view === "string";
  const isAuthShell = runtimeData.shellMode === "auth";

  let mainContentMarkup = renderFallback(runtimeData);
  if (hasAuthUtilityPage) {
    mainContentMarkup = renderAuthUtilityPage(runtimeData);
  } else if (hasClientFeaturePage) {
    mainContentMarkup = renderClientFeaturePage(runtimeData);
  } else if (hasEmployeeList) {
    mainContentMarkup = renderEmployeeList(runtimeData);
  } else if (hasAdminPage) {
    mainContentMarkup = renderAdminPage(runtimeData);
  } else if (hasProfilePage) {
    mainContentMarkup = renderProfilePage(runtimeData);
  } else if (hasSettingsPage) {
    mainContentMarkup = renderSettingsPage(runtimeData);
  } else if (hasWallFeed) {
    mainContentMarkup = renderWallFeed(runtimeData);
  }

  const headerMarkup = isAuthShell
    ? `
    <header class="topbar topbar--auth">
      <div class="brand">SIMOONA</div>
      <div class="topbar-auth-spacer"></div>
      <div class="topbar-right topbar-right--auth">${topLinks}</div>
    </header>
  `
    : `
    <header class="topbar">
      <div class="brand">SIMOONA</div>
      <div class="topbar-search-wrap">
        <input class="topbar-search" type="search" placeholder="Search in walls..." aria-label="Search in walls" />
      </div>
      <div class="topbar-right">
        ${topLinks}
        <span class="profile-name">${escapeHtml(runtimeData.shell?.userName || "User")}</span>
        <span aria-hidden="true">⌄</span>
        <span aria-hidden="true">✉</span>
        <span class="counter-badge">${escapeHtml(runtimeData.shell?.notificationCount || 0)}</span>
      </div>
    </header>
  `;

  const shellMainClass = isAuthShell ? "shell-main shell-main--auth" : "shell-main";
  const shellContentClass = isAuthShell ? "shell-content shell-content--auth" : "shell-content";
  const leftRailMarkup = isAuthShell
    ? ""
    : `<aside class="left-rail" data-ui="legacy-left-rail">${leftMenuMarkup}</aside>`;

  return `
  <main class="app-shell" data-app="simoona-modern-web-runtime" data-route-key="${escapeHtml(runtimeData.routeMatch?.routeKey || "unknown")}">
    ${headerMarkup}
    <section class="${shellMainClass}">
      ${leftRailMarkup}
      <section class="${shellContentClass}">${mainContentMarkup}</section>
    </section>
  </main>
`;
}
