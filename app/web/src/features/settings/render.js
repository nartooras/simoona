import { escapeHtml } from "../../runtime/runtime-shared.js";

export function renderSettingsPage(runtimeData) {
  const settingsPage = runtimeData.settingsPage;
  if (!settingsPage) {
    return "";
  }

  const tabsMarkup = Array.isArray(settingsPage.tabs)
    ? settingsPage.tabs
        .map(
          (tab) => `
      <button
        type="button"
        class="settings-tab-btn${tab.id === settingsPage.activeTab ? " is-active" : ""}"
        data-settings-tab="${escapeHtml(tab.id)}"
      >
        ${escapeHtml(tab.label)}
      </button>
    `
        )
        .join("")
    : "";

  const notificationRows = Array.isArray(settingsPage.notifications?.walls)
    ? settingsPage.notifications.walls
        .map(
          (wall) => `
      <tr>
        <td>${escapeHtml(wall.name)}${wall.isMainWall ? " ⚠" : ""}</td>
        <td><input type="checkbox" data-settings-checkbox ${wall.app ? "checked" : ""} ${wall.isMainWall ? "disabled" : ""} /></td>
        <td><input type="checkbox" data-settings-checkbox ${wall.email ? "checked" : ""} ${wall.isMainWall ? "disabled" : ""} /></td>
      </tr>
    `
        )
        .join("")
    : "";

  const providerRows = Array.isArray(settingsPage.providers?.items)
    ? settingsPage.providers.items
        .map(
          (provider) => `
      <tr data-provider-name="${escapeHtml(provider.name)}">
        <td>${escapeHtml(provider.name)}</td>
        <td>
          ${provider.linked ? escapeHtml(provider.email || "Linked") : `<button type="button" class="provider-link-btn" data-provider-link="${escapeHtml(provider.name)}">Sign in</button>`}
        </td>
        <td>
          ${provider.linked && provider.canUnlink ? `<button type="button" class="provider-unlink-btn" data-provider-unlink="${escapeHtml(provider.name)}">Remove</button>` : ""}
        </td>
      </tr>
    `
        )
        .join("")
    : "";

  return `
    <section class="settings-panel" data-ui="legacy-settings">
      <article class="settings-card">
        <header class="settings-title">Settings</header>
        <nav class="settings-tabs">${tabsMarkup}</nav>
        <section class="settings-content">
          <div data-settings-content="general">
            <form class="settings-form" id="settings-general-form">
              <label>Language
                <select id="settings-language">
                  ${(settingsPage.general?.languages || [])
                    .map(
                      (language) =>
                        `<option value="${escapeHtml(language.code)}"${language.code === settingsPage.general?.languageCode ? " selected" : ""}>${escapeHtml(language.label)}</option>`
                    )
                    .join("")}
                </select>
              </label>
              <label>Time zone
                <select id="settings-timezone">
                  ${(settingsPage.general?.timeZones || [])
                    .map(
                      (timeZone) =>
                        `<option value="${escapeHtml(timeZone.id)}"${timeZone.id === settingsPage.general?.timeZoneId ? " selected" : ""}>${escapeHtml(timeZone.label)}</option>`
                    )
                    .join("")}
                </select>
              </label>
              <div class="settings-actions">
                <button id="settings-general-save" type="submit" class="btn-primary" disabled>Save</button>
                <a class="btn-secondary" href="/default/Wall/Feed">Cancel</a>
              </div>
              <div id="settings-general-feedback" class="profile-feedback" hidden>Information saved.</div>
            </form>
          </div>
          <div data-settings-content="notifications" hidden>
            <form id="settings-notifications-form">
              <table class="settings-table">
                <thead>
                  <tr><th>Wall</th><th>App</th><th>Email</th></tr>
                </thead>
                <tbody>
                  ${notificationRows}
                  <tr><td>Events</td><td><input type="checkbox" data-settings-checkbox ${settingsPage.notifications?.eventsApp ? "checked" : ""} /></td><td><input type="checkbox" data-settings-checkbox ${settingsPage.notifications?.eventsEmail ? "checked" : ""} /></td></tr>
                  <tr><td>Projects</td><td><input type="checkbox" data-settings-checkbox ${settingsPage.notifications?.projectsApp ? "checked" : ""} /></td><td><input type="checkbox" data-settings-checkbox ${settingsPage.notifications?.projectsEmail ? "checked" : ""} /></td></tr>
                </tbody>
              </table>
              <div class="settings-actions">
                <button id="settings-notifications-save" type="submit" class="btn-primary" disabled>Save</button>
                <a class="btn-secondary" href="/default/Wall/Feed">Cancel</a>
              </div>
            </form>
          </div>
          <div data-settings-content="providers" hidden>
            <table class="settings-table" id="settings-providers-table">
              <thead>
                <tr><th>Provider</th><th>Email</th><th></th></tr>
              </thead>
              <tbody>${providerRows}</tbody>
            </table>
          </div>
        </section>
      </article>
    </section>
  `;
}

