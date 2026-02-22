import { escapeHtml, isPathActive } from "./runtime-shared.js";

let runtimeData = null;

function renderWallFeed() {
  const wallFeed = runtimeData.wallFeed;
  if (!wallFeed) {
    return "";
  }

  const postsMarkup = Array.isArray(wallFeed.posts)
    ? wallFeed.posts
        .map(
          (post) => `
        <article class="feed-card" data-post-id="${escapeHtml(post.id)}">
          <header class="feed-card-topline">
            <span class="feed-wall-name">${escapeHtml(post.wallName)}</span>
            <span class="feed-header-icons">☆ ⌁</span>
          </header>
          <header class="feed-card-header">
            <div class="avatar" aria-hidden="true"></div>
            <div>
              <p class="author">${escapeHtml(post.author)}</p>
              <p class="meta">${escapeHtml(post.timestamp)}</p>
            </div>
          </header>
          <p class="content">${escapeHtml(post.content)}</p>
          ${post.hasImage ? '<div class="post-image" aria-hidden="true"></div>' : ""}
          <p class="hashtags">${escapeHtml(post.hashtags || "")}</p>
          <div class="likes-summary">${escapeHtml(post.likeSummary || "")}</div>
          <footer class="actions">
            <button type="button" class="action-link action-like" data-like-for="${escapeHtml(post.id)}">Unlike</button>
            <button type="button" class="action-link action-reply" data-reply-for="${escapeHtml(post.id)}">Reply</button>
          </footer>
          <form class="reply-form" data-reply-form="${escapeHtml(post.id)}" hidden>
            <input type="text" placeholder="Add comment" aria-label="Comment for ${escapeHtml(post.id)}" />
          </form>
          <div class="reply-toggle">${escapeHtml(post.replyCountLabel || "")}</div>
          <div class="feed-counter-row">
            <span data-like-count="${escapeHtml(post.id)}">${escapeHtml(post.likeCount)}</span> likes
            <span class="separator-dot">•</span>
            <span>${escapeHtml(post.commentCount)}</span> replies
          </div>
        </article>
      `
        )
        .join("")
    : "";

  const quickActionsMarkup = Array.isArray(wallFeed.rightSidebar?.quickActions)
    ? wallFeed.rightSidebar.quickActions
        .map(
          (action) => `
      <button type="button" class="quick-action" title="${escapeHtml(action.title)}">${escapeHtml(action.symbol)}</button>
    `
        )
        .join("")
    : "";

  const kudosFeedMarkup = Array.isArray(wallFeed.rightSidebar?.kudosFeed)
    ? wallFeed.rightSidebar.kudosFeed
        .map(
          (entry) => `
      <li class="kudos-item">
        <div class="kudos-score">${escapeHtml(entry.score)}</div>
        <div class="kudos-text">
          <strong>${escapeHtml(entry.fullName)}</strong>
          <p>${escapeHtml(entry.reason)}</p>
          <span>${escapeHtml(entry.date)}</span>
        </div>
      </li>
    `
        )
        .join("")
    : "";

  const widgetsMarkup = Array.isArray(wallFeed.rightSidebar?.widgets)
    ? wallFeed.rightSidebar.widgets
        .map(
          (widget) => `
      <section class="widget-card">
        <h3>${escapeHtml(widget.title)}</h3>
        <ul>
          ${(widget.items || [])
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("")}
        </ul>
      </section>
    `
        )
        .join("")
    : "";

  return `
    <div class="content-grid content-grid--wall">
      <section class="feed-column" data-ui="legacy-feed-column">
        ${postsMarkup}
      </section>
      <aside class="right-rail" data-ui="legacy-right-rail">
        <section class="quick-actions">${quickActionsMarkup}</section>
        <section class="kudos-stream"><ul>${kudosFeedMarkup}</ul></section>
        ${widgetsMarkup}
      </aside>
    </div>
  `;
}

function renderEmployeeList() {
  const employeeList = runtimeData.employeeList;
  if (!employeeList) {
    return "";
  }

  return `
    <section class="employee-panel" data-ui="legacy-employee-list">
      <h1>${escapeHtml(employeeList.title || "Employee List")}</h1>
      <div class="employee-toolbar">
        <input
          id="employee-filter"
          type="search"
          placeholder="Type to filter list..."
          aria-label="Filter employees"
        />
      </div>
      <table class="employee-table">
        <thead>
          <tr>
            <th><button class="sort-link" data-sort-key="fullName" type="button">First name Last name</button></th>
            <th><button class="sort-link" data-sort-key="birthDate" type="button">Birth date</button></th>
            <th><button class="sort-link" data-sort-key="jobTitle" type="button">Job title</button></th>
            <th><button class="sort-link" data-sort-key="workingHours" type="button">Working hours</button></th>
          </tr>
        </thead>
        <tbody id="employee-rows"></tbody>
      </table>
      <nav class="employee-pagination" id="employee-pagination" aria-label="Employee list pages"></nav>
    </section>
  `;
}

function renderProfilePage() {
  const profilePage = runtimeData.profilePage;
  if (!profilePage) {
    return "";
  }

  const details = profilePage.details || {};
  const edit = profilePage.edit || {};
  const profileId = escapeHtml(profilePage.profileId || "1");
  const profileRouteBase = `/default/Profiles/${profileId}`;

  if (profilePage.mode === "edit") {
    const tabsMarkup = Array.isArray(edit.tabs)
      ? edit.tabs
          .map(
            (tab) => `
        <button
          type="button"
          class="profile-tab-btn${tab.id === edit.activeTab ? " is-active" : ""}"
          data-profile-tab="${escapeHtml(tab.id)}"
        >
          ${escapeHtml(tab.label)}
        </button>
      `
          )
          .join("")
      : "";

    return `
      <section class="profile-edit-panel" data-ui="legacy-profile-edit">
        <h1>Profiles</h1>
        <h4 class="profile-warning">User waiting for confirmation</h4>
        <div class="profile-tabs">${tabsMarkup}</div>
        <form id="profile-edit-form" class="profile-form">
          <div data-profile-tab-content="personal" class="profile-tab-content">
            <div class="profile-grid">
              <label>First name<input id="profile-personal-firstname" type="text" value="${escapeHtml(edit.personal?.firstName || "")}" /></label>
              <label>Last name<input id="profile-personal-lastname" type="text" value="${escapeHtml(edit.personal?.lastName || "")}" /></label>
              <label>Email<input id="profile-personal-email" type="email" value="${escapeHtml(edit.personal?.email || "")}" /></label>
              <label>Phone number<input id="profile-personal-phone" type="text" value="${escapeHtml(edit.personal?.phoneNumber || "")}" /></label>
              <label>Birthday<input id="profile-personal-birthday" type="date" value="${escapeHtml(edit.personal?.birthday || "")}" /></label>
              <label>Bio<textarea id="profile-personal-bio">${escapeHtml(edit.personal?.bio || "")}</textarea></label>
            </div>
          </div>
          <div data-profile-tab-content="job" class="profile-tab-content" hidden>
            <div class="profile-grid">
              <label>Manager<input type="text" value="${escapeHtml(edit.job?.manager || "")}" /></label>
              <label>Projects<input type="text" value="${escapeHtml((edit.job?.projects || []).join(", "))}" /></label>
              <label>Job title<input type="text" value="${escapeHtml(edit.job?.jobTitle || "")}" /></label>
              <label>Qualification<input type="text" value="${escapeHtml(edit.job?.qualification || "")}" /></label>
              <label>Working hours from<input type="time" value="${escapeHtml(edit.job?.workingHoursFrom || "")}" /></label>
              <label>Working hours to<input type="time" value="${escapeHtml(edit.job?.workingHoursTo || "")}" /></label>
              <label>Lunch from<input type="time" value="${escapeHtml(edit.job?.lunchFrom || "")}" /></label>
              <label>Lunch to<input type="time" value="${escapeHtml(edit.job?.lunchTo || "")}" /></label>
            </div>
          </div>
          <div data-profile-tab-content="office" class="profile-tab-content" hidden>
            <div class="profile-grid">
              <label>Office<select><option>${escapeHtml(edit.office?.office || "Vilnius Office")}</option></select></label>
              <label>Floor<select><option>${escapeHtml(edit.office?.floor || "2")}</option></select></label>
              <label>Room<select><option>${escapeHtml(edit.office?.room || "214")}</option></select></label>
            </div>
          </div>
          <div data-profile-tab-content="blacklist" class="profile-tab-content" hidden>
            <div class="profile-grid">
              <label>Blacklist end date<input type="date" value="${escapeHtml(edit.blacklist?.endDate || "")}" /></label>
              <label>Reason<textarea>${escapeHtml(edit.blacklist?.reason || "")}</textarea></label>
              <div class="profile-meta-note">Created by ${escapeHtml(edit.blacklist?.createdBy || "-")}</div>
              <div class="profile-meta-note">Modified by ${escapeHtml(edit.blacklist?.modifiedBy || "-")}</div>
            </div>
          </div>
          <div class="profile-actions">
            <button id="profile-edit-save" type="submit" class="btn-primary" disabled>Save</button>
            <a class="btn-secondary" href="${profileRouteBase}">Back to profile</a>
          </div>
          <div id="profile-edit-feedback" class="profile-feedback" hidden>Information saved.</div>
        </form>
      </section>
    `;
  }

  return `
    <section class="profile-details-panel" data-ui="legacy-profile-details">
      <h1>Profiles</h1>
      <article class="profile-card">
        <header class="profile-card-header">
          <div class="profile-avatar" aria-hidden="true"></div>
          <div>
            <a class="profile-display-name" href="/default/Office?user=${escapeHtml(details.username || "user")}">${escapeHtml(details.displayName || "User")}</a>
            <p class="profile-job-line">${escapeHtml(details.jobTitle || "")}${details.qualificationLevel ? ` (${escapeHtml(details.qualificationLevel)})` : ""}</p>
          </div>
        </header>
        <div class="profile-main-grid">
          <div class="profile-row"><span>Email</span><a href="mailto:${escapeHtml(details.email || "")}">${escapeHtml(details.email || "")}</a></div>
          <div class="profile-row"><span>Phone number</span><strong>${escapeHtml(details.phoneNumber || "")}</strong></div>
          <div class="profile-row"><span>Birthday</span><strong>${escapeHtml(details.birthdayAdmin || details.birthdayPublic || "")}</strong></div>
          <div class="profile-row"><span>Employment date</span><strong>${escapeHtml(details.employmentDate || "")}</strong></div>
          <div class="profile-row"><span>Full time</span><strong>${escapeHtml(details.fullTime || "")}</strong></div>
          <div class="profile-row"><span>Working hours</span><strong>${escapeHtml(details.workingHours || "")} (${escapeHtml(details.lunch || "")})</strong></div>
          <div class="profile-row"><span>Manager</span><strong>${escapeHtml(details.manager || "")}</strong></div>
          <div class="profile-row"><span>Projects</span><strong>${escapeHtml((details.projects || []).join(", "))}</strong></div>
          <div class="profile-row"><span>Location</span><strong>${escapeHtml(details.location || "")}</strong></div>
          <div class="profile-row"><span>Skills</span><strong>${escapeHtml((details.skills || []).join(", "))}</strong></div>
          <div class="profile-row"><span>Bio</span><p>${escapeHtml(details.bio || "")}</p></div>
          <div class="profile-row"><span>Certificates</span><strong>${escapeHtml((details.certificates || []).join(", "))}</strong></div>
          <div class="profile-row"><span>Exams</span><strong>${escapeHtml((details.exams || []).join(", "))}</strong></div>
          <div class="profile-row"><span>Roles</span><strong>${escapeHtml((details.roles || []).join(", "))}</strong></div>
          <div class="profile-row"><span>Blacklist state</span><strong>${escapeHtml(details.blacklist?.endDate || "-")}</strong></div>
          <div class="profile-row"><span>Blacklist reason</span><strong>${escapeHtml(details.blacklist?.reason || "-")}</strong></div>
        </div>
        <div class="profile-actions">
          <a class="btn-primary" href="${profileRouteBase}/Edit/personal">Edit</a>
        </div>
      </article>
    </section>
  `;
}

function renderSettingsPage() {
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

function renderAdminBreadcrumbs(adminPage) {
  const breadcrumbs = Array.isArray(adminPage?.breadcrumbs) ? adminPage.breadcrumbs : [];
  if (!breadcrumbs.length) {
    return "";
  }

  return breadcrumbs
    .map((item) => {
      if (item.path) {
        return `<a href="${escapeHtml(item.path)}">${escapeHtml(item.label)}</a>`;
      }
      return `<span>${escapeHtml(item.label)}</span>`;
    })
    .join('<span class="admin-breadcrumb-sep">→</span>');
}

function renderAdminNavigation(adminPage) {
  const navigation = Array.isArray(adminPage?.navigation) ? adminPage.navigation : [];
  return navigation
    .map(
      (item) =>
        `<a class="admin-nav-link${isPathActive(item.path, runtimeData.route) ? " is-active" : ""}" href="${escapeHtml(item.path)}">${escapeHtml(item.label)}</a>`
    )
    .join("");
}

function renderAdminActionButtons(actions) {
  if (!Array.isArray(actions) || actions.length === 0) {
    return "";
  }

  return actions
    .map((action) => {
      const variantClass = action.kind === "danger" ? " is-danger" : "";
      if (action.path) {
        return `<a class="admin-table-action${variantClass}" href="${escapeHtml(action.path)}">${escapeHtml(action.label)}</a>`;
      }
      return `<button class="admin-table-action${variantClass}" type="button">${escapeHtml(action.label)}</button>`;
    })
    .join("");
}

function renderAdminCards(adminPage) {
  const cards = Array.isArray(adminPage?.cards) ? adminPage.cards : [];
  if (!cards.length) {
    return "";
  }

  return `
    <section class="admin-card-grid">
      ${cards
        .map(
          (card) => `
        <a class="admin-card-link" href="${escapeHtml(card.path || "#")}">
          <span class="admin-card-icon" aria-hidden="true">${escapeHtml(card.icon || "+")}</span>
          <strong>${escapeHtml(card.title || "")}</strong>
          <p>${escapeHtml(card.subtitle || "")}</p>
        </a>
      `
        )
        .join("")}
    </section>
  `;
}

function renderAdminTableFrame(adminPage) {
  const table = adminPage?.table;
  if (!table || !Array.isArray(table.columns)) {
    return "";
  }

  const filterMarkup = adminPage.filterPlaceholder
    ? `
      <div class="admin-toolbar">
        <input
          id="admin-list-filter"
          type="search"
          placeholder="${escapeHtml(adminPage.filterPlaceholder)}"
          aria-label="Admin filter"
        />
      </div>
    `
    : "";

  const primaryActionMarkup = adminPage.primaryAction
    ? adminPage.primaryAction.path
      ? `<a class="btn-primary" href="${escapeHtml(adminPage.primaryAction.path)}">${escapeHtml(adminPage.primaryAction.label || "Create new")}</a>`
      : `<button class="btn-primary" type="button" id="${escapeHtml(adminPage.primaryAction.id || "admin-primary-action")}">${escapeHtml(adminPage.primaryAction.label || "Action")}</button>`
    : "";

  return `
    ${filterMarkup}
    <div class="admin-table-actions">${primaryActionMarkup}</div>
    <table class="admin-table">
      <thead>
        <tr>
          ${table.columns
            .map((column) => {
              if (column.sortable) {
                return `<th><button class="admin-sort-link" type="button" data-admin-sort-key="${escapeHtml(column.key)}">${escapeHtml(column.label)}</button></th>`;
              }
              return `<th>${escapeHtml(column.label)}</th>`;
            })
            .join("")}
        </tr>
      </thead>
      <tbody id="admin-list-rows"></tbody>
    </table>
    <nav class="employee-pagination" id="admin-list-pagination" aria-label="Admin list pages"></nav>
  `;
}

function renderAdminForm(adminPage) {
  const form = adminPage?.form;
  if (!form || !Array.isArray(form.fields)) {
    return "";
  }

  const fieldsMarkup = form.fields
    .map((field) => {
      if (field.type === "checkbox") {
        return `
          <label class="admin-checkbox-row">
            <input type="checkbox" id="${escapeHtml(field.id)}" ${field.checked ? "checked" : ""} />
            <span>${escapeHtml(field.label)}</span>
          </label>
        `;
      }

      if (field.type === "select") {
        return `
          <label class="admin-form-field">
            <span>${escapeHtml(field.label)}${field.required ? ' <span class="text-danger">*</span>' : ""}</span>
            <select id="${escapeHtml(field.id)}">
              ${(field.options || [])
                .map(
                  (option) =>
                    `<option value="${escapeHtml(option.value)}"${option.value === field.value ? " selected" : ""}>${escapeHtml(option.label)}</option>`
                )
                .join("")}
            </select>
          </label>
        `;
      }

      if (field.type === "textarea") {
        return `
          <label class="admin-form-field">
            <span>${escapeHtml(field.label)}${field.required ? ' <span class="text-danger">*</span>' : ""}</span>
            <textarea id="${escapeHtml(field.id)}">${escapeHtml(field.value || "")}</textarea>
          </label>
        `;
      }

      return `
        <label class="admin-form-field">
          <span>${escapeHtml(field.label)}${field.required ? ' <span class="text-danger">*</span>' : ""}</span>
          <input id="${escapeHtml(field.id)}" type="${escapeHtml(field.type || "text")}" value="${escapeHtml(field.value || "")}" />
        </label>
      `;
    })
    .join("");

  return `
    <form id="admin-form" class="admin-form">
      ${fieldsMarkup}
      <div class="admin-form-actions">
        <button id="admin-form-save" type="submit" class="btn-primary" disabled>${escapeHtml(form.saveLabel || "Save")}</button>
        ${form.dangerActionLabel ? `<button id="admin-form-danger" type="button" class="btn-secondary admin-danger-btn">${escapeHtml(form.dangerActionLabel)}</button>` : ""}
        ${form.cancelPath ? `<a class="btn-secondary" href="${escapeHtml(form.cancelPath)}">Cancel</a>` : ""}
      </div>
      <div id="admin-form-feedback" class="profile-feedback" hidden>Information saved.</div>
    </form>
  `;
}

function renderAdminDonationsTable(adminPage) {
  const donationsTable = adminPage?.donationsTable;
  if (!donationsTable || !Array.isArray(donationsTable.rows)) {
    return "";
  }

  return `
    <table class="admin-table admin-table--compact">
      <thead>
        <tr>
          ${(donationsTable.columns || [])
            .map((column) => `<th>${escapeHtml(column.label)}</th>`)
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${donationsTable.rows
          .map(
            (row) => `
          <tr>
            <td>${escapeHtml(row.fullName)}</td>
            <td>${escapeHtml(row.amount)}</td>
            <td>${escapeHtml(row.date)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderAdminRefund(adminPage) {
  const refund = adminPage?.refund;
  if (!refund) {
    return "";
  }

  return `
    <section class="admin-refund-box">
      <p id="admin-refund-message">${escapeHtml(refund.message || "")}</p>
      <div class="admin-form-actions">
        <button id="admin-refund-action" type="button" class="btn-primary">${escapeHtml(refund.actionLabel || "Refund")}</button>
        ${refund.cancelPath ? `<a class="btn-secondary" href="${escapeHtml(refund.cancelPath)}">Cancel</a>` : ""}
      </div>
    </section>
  `;
}

function renderAdminPage() {
  const adminPage = runtimeData.adminPage;
  if (!adminPage) {
    return "";
  }

  return `
    <section class="admin-panel" data-ui="legacy-admin-page" data-admin-view="${escapeHtml(adminPage.view || "unknown")}">
      <header class="admin-header">
        <h1>${escapeHtml(adminPage.title || "Administration")}</h1>
        ${adminPage.subtitle ? `<p class="admin-subtitle">${escapeHtml(adminPage.subtitle)}</p>` : ""}
        <div class="admin-breadcrumbs">${renderAdminBreadcrumbs(adminPage)}</div>
      </header>
      <nav class="admin-nav">${renderAdminNavigation(adminPage)}</nav>
      ${renderAdminCards(adminPage)}
      ${renderAdminTableFrame(adminPage)}
      ${renderAdminForm(adminPage)}
      ${renderAdminDonationsTable(adminPage)}
      ${renderAdminRefund(adminPage)}
    </section>
  `;
}

function renderClientFeatureNavigation(clientPage) {
  const navigation = Array.isArray(clientPage?.navigation) ? clientPage.navigation : [];
  if (!navigation.length) {
    return "";
  }

  return navigation
    .map(
      (item) =>
        `<a class="client-nav-link${isPathActive(item.path, runtimeData.route) ? " is-active" : ""}" href="${escapeHtml(item.path)}">${escapeHtml(item.label)}</a>`
    )
    .join("");
}

function renderClientFeatureCards(clientPage) {
  const cards = Array.isArray(clientPage?.cards) ? clientPage.cards : [];
  if (!cards.length) {
    return "";
  }

  return `
    <section class="client-card-grid">
      ${cards
        .map(
          (card) => `
        <article class="client-card-item">
          <strong>${escapeHtml(card.title || "")}</strong>
          <p>${escapeHtml(card.subtitle || "")}</p>
        </article>
      `
        )
        .join("")}
    </section>
  `;
}

function renderClientFeatureTableFrame(clientPage) {
  const table = clientPage?.table;
  if (!table || !Array.isArray(table.columns)) {
    return "";
  }

  const filterMarkup = clientPage.filterPlaceholder
    ? `
      <div class="client-toolbar">
        <input
          id="client-list-filter"
          type="search"
          placeholder="${escapeHtml(clientPage.filterPlaceholder)}"
          aria-label="Client feature filter"
        />
      </div>
    `
    : "";

  const primaryActionMarkup = clientPage.primaryAction
    ? clientPage.primaryAction.path
      ? `<a class="btn-primary" href="${escapeHtml(clientPage.primaryAction.path)}">${escapeHtml(clientPage.primaryAction.label || "Action")}</a>`
      : `<button class="btn-primary" type="button" id="${escapeHtml(clientPage.primaryAction.id || "client-primary-action")}">${escapeHtml(clientPage.primaryAction.label || "Action")}</button>`
    : "";

  return `
    ${filterMarkup}
    <div class="client-table-actions">${primaryActionMarkup}</div>
    <table class="client-table">
      <thead>
        <tr>
          ${table.columns
            .map((column) => {
              if (column.sortable) {
                return `<th><button class="client-sort-link" type="button" data-client-sort-key="${escapeHtml(column.key)}">${escapeHtml(column.label)}</button></th>`;
              }
              return `<th>${escapeHtml(column.label)}</th>`;
            })
            .join("")}
        </tr>
      </thead>
      <tbody id="client-list-rows"></tbody>
    </table>
    <nav class="employee-pagination" id="client-list-pagination" aria-label="Client list pages"></nav>
  `;
}

function renderClientFeatureForm(clientPage) {
  const form = clientPage?.form;
  if (!form || !Array.isArray(form.fields)) {
    return "";
  }

  const fieldsMarkup = form.fields
    .map((field) => {
      if (field.type === "checkbox") {
        return `
          <label class="client-checkbox-row">
            <input type="checkbox" id="${escapeHtml(field.id)}" ${field.checked ? "checked" : ""} />
            <span>${escapeHtml(field.label)}</span>
          </label>
        `;
      }

      if (field.type === "select") {
        return `
          <label class="client-form-field">
            <span>${escapeHtml(field.label)}${field.required ? ' <span class="text-danger">*</span>' : ""}</span>
            <select id="${escapeHtml(field.id)}">
              ${(field.options || [])
                .map(
                  (option) =>
                    `<option value="${escapeHtml(option.value)}"${option.value === field.value ? " selected" : ""}>${escapeHtml(option.label)}</option>`
                )
                .join("")}
            </select>
          </label>
        `;
      }

      if (field.type === "textarea") {
        return `
          <label class="client-form-field">
            <span>${escapeHtml(field.label)}${field.required ? ' <span class="text-danger">*</span>' : ""}</span>
            <textarea id="${escapeHtml(field.id)}">${escapeHtml(field.value || "")}</textarea>
          </label>
        `;
      }

      return `
        <label class="client-form-field">
          <span>${escapeHtml(field.label)}${field.required ? ' <span class="text-danger">*</span>' : ""}</span>
          <input id="${escapeHtml(field.id)}" type="${escapeHtml(field.type || "text")}" value="${escapeHtml(field.value || "")}" />
        </label>
      `;
    })
    .join("");

  const formId = escapeHtml(form.id || "client-form");

  return `
    <form id="${formId}" class="client-form">
      ${fieldsMarkup}
      <div class="client-form-actions">
        <button id="${formId}-save" type="submit" class="btn-primary" disabled>${escapeHtml(form.saveLabel || "Save")}</button>
        ${form.cancelPath ? `<a class="btn-secondary" href="${escapeHtml(form.cancelPath)}">Cancel</a>` : ""}
      </div>
      <div id="${formId}-feedback" class="profile-feedback" hidden>Information saved.</div>
    </form>
  `;
}

function renderClientFeatureDetails(clientPage) {
  const sections = Array.isArray(clientPage?.details?.sections) ? clientPage.details.sections : [];
  if (!sections.length) {
    return "";
  }

  return `
    <section class="client-details">
      ${sections
        .map(
          (item) => `
        <div class="client-details-row">
          <span>${escapeHtml(item.label || "")}</span>
          <strong>${escapeHtml(item.value || "")}</strong>
        </div>
      `
        )
        .join("")}
    </section>
  `;
}

function renderClientFeatureLinks(clientPage) {
  const links = Array.isArray(clientPage?.links) ? clientPage.links : [];
  if (!links.length) {
    return "";
  }

  return `
    <div class="client-link-row">
      ${links
        .map((link) => {
          const className = link.kind === "primary" ? "btn-primary" : "btn-secondary";
          return `<a class="${className}" href="${escapeHtml(link.path)}">${escapeHtml(link.label)}</a>`;
        })
        .join("")}
    </div>
  `;
}

function renderClientFeaturePage() {
  const clientPage = runtimeData.clientFeaturePage;
  if (!clientPage) {
    return "";
  }

  return `
    <section class="client-feature-panel" data-ui="legacy-client-feature" data-client-view="${escapeHtml(clientPage.view || "unknown")}">
      <header class="client-feature-header">
        <h1>${escapeHtml(clientPage.title || "Feature")}</h1>
        ${clientPage.subtitle ? `<p>${escapeHtml(clientPage.subtitle)}</p>` : ""}
      </header>
      <nav class="client-nav">${renderClientFeatureNavigation(clientPage)}</nav>
      ${renderClientFeatureCards(clientPage)}
      ${renderClientFeatureDetails(clientPage)}
      ${renderClientFeatureTableFrame(clientPage)}
      ${renderClientFeatureForm(clientPage)}
      ${renderClientFeatureLinks(clientPage)}
    </section>
  `;
}

function renderAuthUtilityPage() {
  const authPage = runtimeData.authUtilityPage;
  if (!authPage) {
    return "";
  }

  const renderField = (field) => `
    <label class="auth-field" for="auth-input-${escapeHtml(field.id)}">
      <span>${escapeHtml(field.label)}</span>
      <input
        id="auth-input-${escapeHtml(field.id)}"
        name="${escapeHtml(field.id)}"
        type="${escapeHtml(field.type || "text")}"
        placeholder="${escapeHtml(field.placeholder || "")}"
        value="${escapeHtml(field.value || "")}"
        data-auth-field
        data-auth-required="${field.required ? "true" : "false"}"
      />
    </label>
  `;

  const formMarkup =
    authPage.form && Array.isArray(authPage.form.fields)
      ? `
      <form id="${escapeHtml(authPage.form.id || "auth-form")}" class="auth-form">
        ${authPage.form.fields.map((field) => renderField(field)).join("")}
        <button
          id="${escapeHtml(authPage.form.id || "auth-form")}-submit"
          class="btn-primary auth-submit-btn"
          type="submit"
          disabled
        >
          ${escapeHtml(authPage.form.submitLabel || "Submit")}
        </button>
        <div id="${escapeHtml(authPage.form.id || "auth-form")}-feedback" class="auth-feedback" hidden></div>
      </form>
    `
      : "";

  const linksMarkup = Array.isArray(authPage.links)
    ? `
      <div class="auth-link-row">
        ${authPage.links
          .map((link) => {
            const className = link.kind === "primary" ? "btn-primary" : "btn-secondary";
            return `<a class="${className}" href="${escapeHtml(link.path)}">${escapeHtml(link.label)}</a>`;
          })
          .join("")}
      </div>
    `
    : "";

  const providersMarkup = Array.isArray(authPage.providers) && authPage.providers.length
    ? `
      <div class="auth-provider-grid">
        ${authPage.providers
          .map(
            (provider) => `
          <button type="button" class="auth-provider-btn" data-auth-provider="${escapeHtml(provider.id)}">
            ${escapeHtml(provider.label)}
          </button>
        `
          )
          .join("")}
      </div>
      <div id="auth-provider-feedback" class="auth-feedback" hidden></div>
    `
    : "";

  const alertClass =
    authPage.alert?.kind === "success"
      ? " auth-alert--success"
      : authPage.alert?.kind === "danger"
        ? " auth-alert--danger"
        : "";

  return `
    <section class="auth-panel" data-ui="legacy-auth-view" data-auth-view="${escapeHtml(authPage.view || "auth")}">
      <article class="auth-card">
        <header class="auth-header">
          <h1>${escapeHtml(authPage.title || "Simoona")}</h1>
          ${authPage.subtitle ? `<p>${escapeHtml(authPage.subtitle)}</p>` : ""}
        </header>
        ${authPage.organizationName ? `<p class="auth-org-name">${escapeHtml(authPage.organizationName)}</p>` : ""}
        ${authPage.message ? `<p class="auth-system-message">${escapeHtml(authPage.message)}</p>` : ""}
        ${authPage.alert?.message ? `<div class="auth-alert${alertClass}">${escapeHtml(authPage.alert.message)}</div>` : ""}
        ${formMarkup}
        ${providersMarkup}
        ${linksMarkup}
      </article>
    </section>
  `;
}

function renderFallback() {
  return `
    <section class="route-placeholder">
      <h2>${escapeHtml(runtimeData.routeMatch?.routeKey || "Route")}</h2>
      <p>This route is recognized and mapped, but detailed UI parity is still in progress.</p>
      <p>Current route: <code>${escapeHtml(runtimeData.route)}</code></p>
    </section>
  `;
}

export { renderAdminActionButtons };

export function renderRuntimeShell(context) {
  runtimeData = context.runtimeData;
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

  let mainContentMarkup = renderFallback();
  if (hasAuthUtilityPage) {
    mainContentMarkup = renderAuthUtilityPage();
  } else if (hasClientFeaturePage) {
    mainContentMarkup = renderClientFeaturePage();
  } else if (hasEmployeeList) {
    mainContentMarkup = renderEmployeeList();
  } else if (hasAdminPage) {
    mainContentMarkup = renderAdminPage();
  } else if (hasProfilePage) {
    mainContentMarkup = renderProfilePage();
  } else if (hasSettingsPage) {
    mainContentMarkup = renderSettingsPage();
  } else if (hasWallFeed) {
    mainContentMarkup = renderWallFeed();
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
