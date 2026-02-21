const root = document.getElementById("app");
const runtimeDataElement = document.getElementById("simoona-runtime-data");

if (!root || !runtimeDataElement) {
  throw new Error("Missing runtime root elements.");
}

let runtimeData = {
  route: "/",
  title: "Simoona",
  status: "ready",
  navItems: [],
  auth: {
    requiresLogin: false,
    redirectPath: "/"
  },
  routeMatch: {
    routeKey: "public.home",
    normalizedPath: "/",
    isKnownLegacyRoute: true
  },
  tenantRoute: {
    tenantId: "default",
    normalizedPath: "/"
  },
  motion: {
    pageTransitionMs: 160,
    microInteractionMs: 120,
    reducedMotionEnabled: false
  },
  shell: {
    userName: "User",
    notificationCount: 0,
    unreadMessages: 0
  },
  leftMenu: {
    groups: []
  },
  wallFeed: null,
  employeeList: null,
  profilePage: null,
  settingsPage: null,
  clientFeaturePage: null,
  adminPage: null,
  authUtilityPage: null,
  shellMode: "app"
};

try {
  const parsed = JSON.parse(runtimeDataElement.textContent || "{}");
  runtimeData = { ...runtimeData, ...parsed };
} catch (error) {
  console.error("[web-runtime] Failed to parse runtime payload:", error);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizePath(pathname) {
  const input = String(pathname || "/").trim();
  const collapsed = input.replace(/\/{2,}/g, "/");
  if (collapsed === "/") {
    return "/";
  }
  return collapsed.endsWith("/") ? collapsed.slice(0, -1) : collapsed;
}

function isPathActive(itemPath, routePath) {
  if (!itemPath || itemPath.startsWith("http")) {
    return false;
  }

  const normalizedItemPath = normalizePath(itemPath).toLowerCase();
  const normalizedRoutePath = normalizePath(routePath).toLowerCase();

  if (normalizedItemPath === normalizedRoutePath) {
    return true;
  }

  return normalizedRoutePath.startsWith(`${normalizedItemPath}/`);
}

const defaultLeftMenuGroups = [
  {
    id: "walls",
    title: "Walls",
    items: [
      { id: "walls-my", label: "My walls", path: "/default/Wall/Feed" },
      { id: "walls-all", label: "All walls", path: "/default/Wall/All" },
      { id: "walls-discover", label: "Discover walls", path: "/default/Wall/List" }
    ]
  }
];

const leftMenuGroups = Array.isArray(runtimeData.leftMenu?.groups)
  ? runtimeData.leftMenu.groups
  : defaultLeftMenuGroups;

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

root.innerHTML = `
  <style>
    :root {
      --page-bg: #dcdde1;
      --topbar: #006aa9;
      --topbar-dark: #00558f;
      --topbar-border: #2e8dc2;
      --text: #2f3438;
      --muted: #6e767f;
      --line: #d5d8dc;
      --panel: #ffffff;
      --left-menu-bg: #f3f3f5;
      --link: #2a78b9;
      --active-bg: #d6ecff;
      --active-link: #1e74b8;
      --kudos-blue: #1090d3;
    }
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      background: var(--page-bg);
      color: var(--text);
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      font-size: 14px;
    }
    a {
      color: inherit;
    }
    .app-shell {
      min-height: 100vh;
    }
    .topbar {
      height: 52px;
      display: grid;
      grid-template-columns: 190px minmax(200px, 1fr) 380px;
      align-items: center;
      gap: 14px;
      padding: 0 18px;
      background: linear-gradient(180deg, var(--topbar), var(--topbar-dark));
      border-bottom: 1px solid var(--topbar-border);
      color: #fff;
    }
    .topbar--auth {
      grid-template-columns: 190px minmax(0, 1fr) auto;
    }
    .brand {
      font-size: 40px;
      font-weight: 700;
      letter-spacing: 2px;
      line-height: 1;
      transform: scale(0.42);
      transform-origin: left center;
      width: 170px;
    }
    .topbar-search-wrap {
      position: relative;
    }
    .topbar-auth-spacer {
      min-height: 1px;
    }
    .topbar-search {
      width: 100%;
      height: 34px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.35);
      padding: 0 16px;
      background: rgba(255, 255, 255, 0.95);
      color: #4d5a67;
      font-size: 15px;
      font-style: italic;
    }
    .topbar-search::placeholder {
      color: #93a0ad;
    }
    .topbar-right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 10px;
      font-size: 16px;
    }
    .topbar-right--auth {
      gap: 8px;
      font-size: 12px;
    }
    .profile-name {
      font-weight: 600;
      max-width: 220px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .counter-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 11px;
      background: #f64343;
      border: 2px solid #fff;
      font-size: 12px;
      font-weight: 700;
      margin-left: -8px;
      margin-right: -6px;
    }
    .top-nav-link {
      color: #d5ecff;
      border: 1px solid rgba(255, 255, 255, 0.35);
      border-radius: 3px;
      text-decoration: none;
      padding: 3px 8px;
      font-size: 12px;
    }
    .shell-main {
      display: grid;
      grid-template-columns: 240px minmax(0, 1fr);
      align-items: start;
      min-height: calc(100vh - 52px);
    }
    .shell-main--auth {
      grid-template-columns: 1fr;
      align-items: center;
      justify-items: center;
    }
    .left-rail {
      background: var(--left-menu-bg);
      border-right: 1px solid var(--line);
      padding: 14px 14px 26px;
      min-height: calc(100vh - 52px);
    }
    .left-menu-group {
      margin-bottom: 18px;
    }
    .left-menu-group-title {
      font-size: 37px;
      font-weight: 600;
      color: #3a3f45;
      transform: scale(0.35);
      transform-origin: left center;
      width: 140px;
      margin: 0 0 6px;
      position: relative;
      left: -2px;
    }
    .left-menu-group ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .left-menu-link {
      display: block;
      color: #2f3438;
      text-decoration: none;
      padding: 8px 10px;
      border-left: 3px solid transparent;
      border-radius: 2px;
      line-height: 1.2;
    }
    .left-menu-link:hover {
      background: #edf2f7;
    }
    .left-menu-link.is-active {
      color: var(--active-link);
      border-left-color: var(--active-link);
      background: var(--active-bg);
      font-weight: 600;
    }
    .shell-content {
      padding: 14px;
    }
    .shell-content--auth {
      width: 100%;
      max-width: 640px;
      margin: 0 auto;
      padding-top: 30px;
    }
    .content-grid {
      display: grid;
      gap: 14px;
    }
    .content-grid--wall {
      grid-template-columns: minmax(560px, 1fr) 320px;
      align-items: start;
    }
    .feed-column {
      display: grid;
      gap: 12px;
    }
    .feed-card {
      background: var(--panel);
      border: 1px solid var(--line);
      padding: 10px 14px;
    }
    .feed-card-topline {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .feed-wall-name {
      color: var(--link);
      font-weight: 600;
      font-size: 28px;
      transform: scale(0.35);
      transform-origin: left center;
      width: 170px;
      margin-left: -2px;
    }
    .feed-header-icons {
      color: #4f97c9;
      letter-spacing: 2px;
      font-size: 15px;
    }
    .feed-card-header {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-bottom: 7px;
    }
    .avatar {
      width: 33px;
      height: 33px;
      border: 1px solid #b3bcc5;
      background: linear-gradient(160deg, #e4ebf3, #ccd8e7);
      border-radius: 2px;
      flex: 0 0 auto;
    }
    .author {
      margin: 0;
      color: var(--link);
      font-weight: 700;
      font-size: 18px;
      transform: scale(0.55);
      transform-origin: left center;
      width: 220px;
      margin-left: -2px;
    }
    .meta {
      margin: 0;
      color: var(--muted);
      font-size: 12px;
    }
    .content {
      margin: 8px 0;
      line-height: 1.35;
      white-space: pre-wrap;
    }
    .post-image {
      height: 240px;
      width: 280px;
      max-width: 100%;
      border: 1px solid #cfd4da;
      background:
        radial-gradient(circle at 20% 25%, #f4c978 0 8px, transparent 9px),
        radial-gradient(circle at 48% 42%, #e9eef2 0 9px, transparent 10px),
        radial-gradient(circle at 76% 30%, #cde4f6 0 8px, transparent 9px),
        radial-gradient(circle at 35% 72%, #f7e2e2 0 8px, transparent 9px),
        linear-gradient(125deg, #f8f4ea, #e8e2d7);
      margin: 10px 0;
    }
    .hashtags {
      margin: 6px 0;
      color: #2f7fbd;
      font-size: 13px;
    }
    .likes-summary {
      color: #4b6783;
      font-size: 13px;
    }
    .actions {
      margin-top: 8px;
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .action-link {
      border: 0;
      background: transparent;
      color: #2b7fbe;
      padding: 0;
      font-size: 14px;
      cursor: pointer;
    }
    .action-link:hover {
      text-decoration: underline;
    }
    .reply-form {
      margin-top: 9px;
    }
    .reply-form input {
      width: 100%;
      height: 34px;
      border: 1px solid #ccd2d9;
      padding: 0 10px;
      color: #2f3438;
      background: #fafafa;
    }
    .reply-toggle {
      margin-top: 6px;
      color: #2f7fbd;
      font-size: 13px;
    }
    .feed-counter-row {
      margin-top: 4px;
      color: #516678;
      font-size: 12px;
    }
    .separator-dot {
      margin: 0 6px;
    }
    .right-rail {
      display: grid;
      gap: 10px;
      align-content: start;
    }
    .quick-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 8px 0;
    }
    .quick-action {
      border: 0;
      background: transparent;
      color: #2b84c4;
      font-size: 44px;
      line-height: 1;
      padding: 0 2px;
      cursor: pointer;
    }
    .kudos-stream {
      border: 1px solid var(--line);
      background: var(--panel);
    }
    .kudos-stream ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .kudos-item {
      display: grid;
      grid-template-columns: 68px minmax(0, 1fr);
      border-top: 1px solid #e8edf2;
      min-height: 84px;
    }
    .kudos-item:first-child {
      border-top: 0;
    }
    .kudos-score {
      background: var(--kudos-blue);
      color: #fff;
      font-size: 38px;
      transform: scale(0.48);
      transform-origin: center center;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      border-right: 1px solid #0f78b0;
    }
    .kudos-text {
      padding: 8px 9px;
    }
    .kudos-text strong {
      display: block;
      color: var(--link);
      margin-bottom: 3px;
      font-size: 14px;
    }
    .kudos-text p {
      margin: 0;
      color: #3f464d;
      font-size: 13px;
    }
    .kudos-text span {
      display: block;
      margin-top: 4px;
      font-size: 12px;
      color: #8090a0;
    }
    .widget-card {
      background: var(--panel);
      border: 1px solid var(--line);
      padding: 10px;
    }
    .widget-card h3 {
      color: var(--link);
      font-size: 22px;
      transform: scale(0.48);
      transform-origin: left center;
      width: 220px;
      margin: 0 0 5px;
      margin-left: -1px;
      min-height: 14px;
    }
    .widget-card ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .widget-card li {
      padding: 6px 0;
      border-top: 1px solid #ecf0f4;
      color: #384149;
      font-size: 13px;
      line-height: 1.3;
    }
    .widget-card li:first-child {
      border-top: 0;
    }
    .employee-panel {
      background: transparent;
    }
    .employee-panel h1 {
      margin: 4px 0 12px;
      font-size: 56px;
      transform: scale(0.52);
      transform-origin: left center;
      width: 280px;
      min-height: 28px;
      font-weight: 600;
      color: #2e3237;
    }
    .employee-toolbar {
      margin-bottom: 12px;
      max-width: 960px;
    }
    #employee-filter {
      width: 100%;
      height: 48px;
      border: 1px solid #c9cdd2;
      background: #fbfbfb;
      padding: 0 14px;
      font-size: 34px;
      transform: scale(0.4);
      transform-origin: left center;
      width: 250%;
      margin-bottom: -26px;
    }
    .employee-table {
      width: 100%;
      border-collapse: collapse;
      background: #f8f8f9;
      border: 1px solid #cfd3d7;
      table-layout: fixed;
    }
    .employee-table th,
    .employee-table td {
      border: 1px solid #d5d8dc;
      padding: 9px 12px;
      text-align: center;
      vertical-align: middle;
    }
    .employee-table th {
      background: #f7f7f8;
      color: #2d7fbc;
      font-weight: 500;
    }
    .employee-table tbody tr {
      background: #f1f1f3;
    }
    .employee-table tbody tr.employee-row-selected {
      background: #c5e4f8;
    }
    .employee-name {
      color: #2c7fbd;
      text-decoration: none;
    }
    .sort-link {
      border: 0;
      background: transparent;
      color: #2d7fbc;
      cursor: pointer;
      font-size: 16px;
      transform: scale(0.68);
      transform-origin: center center;
      font-weight: 500;
      white-space: nowrap;
    }
    .employee-pagination {
      margin-top: 16px;
      display: inline-flex;
      border: 1px solid #ccd1d6;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
    }
    .pager-btn {
      border: 0;
      background: #fff;
      border-right: 1px solid #dde2e7;
      color: #2a7dba;
      min-width: 42px;
      height: 40px;
      cursor: pointer;
      font-size: 17px;
    }
    .pager-btn:last-child {
      border-right: 0;
    }
    .pager-btn[disabled] {
      cursor: default;
      color: #a6adb5;
      background: #f4f6f8;
    }
    .pager-btn.is-current {
      background: #2a84c2;
      color: #fff;
      font-weight: 700;
    }
    .profile-details-panel h1,
    .profile-edit-panel h1 {
      margin: 4px 0 10px;
      font-size: 52px;
      transform: scale(0.52);
      transform-origin: left center;
      width: 220px;
      min-height: 28px;
      color: #2e3237;
      font-weight: 600;
    }
    .profile-card,
    .profile-edit-panel,
    .settings-card {
      background: var(--panel);
      border: 1px solid var(--line);
      padding: 12px;
    }
    .profile-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid #e5e8ec;
      padding-bottom: 10px;
      margin-bottom: 8px;
    }
    .profile-avatar {
      width: 74px;
      height: 74px;
      border: 1px solid #b9c1cb;
      background: linear-gradient(155deg, #edf1f7, #ced9e7);
    }
    .profile-display-name {
      color: var(--link);
      text-decoration: none;
      font-size: 21px;
      font-weight: 700;
    }
    .profile-job-line {
      margin: 2px 0 0;
      color: #596572;
      font-size: 14px;
    }
    .profile-main-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 6px;
    }
    .profile-row {
      display: grid;
      grid-template-columns: 220px minmax(0, 1fr);
      align-items: start;
      gap: 8px;
      border-bottom: 1px solid #eef1f4;
      padding-bottom: 6px;
    }
    .profile-row span {
      font-weight: 600;
      color: #495462;
    }
    .profile-row p {
      margin: 0;
      line-height: 1.4;
    }
    .profile-warning {
      margin: 0 0 8px;
      padding: 8px 10px;
      background: #fff3cd;
      border: 1px solid #f1d7a4;
      color: #7f5a1b;
      font-size: 13px;
      font-weight: 500;
    }
    .profile-tabs {
      display: flex;
      gap: 6px;
      margin: 8px 0 10px;
      border-bottom: 1px solid #dfe4ea;
      padding-bottom: 8px;
      flex-wrap: wrap;
    }
    .profile-tab-btn,
    .settings-tab-btn {
      border: 1px solid #c9d2dc;
      background: #f8fafc;
      color: #2d587f;
      border-radius: 3px;
      padding: 6px 10px;
      cursor: pointer;
      font-size: 13px;
    }
    .profile-tab-btn.is-active,
    .settings-tab-btn.is-active {
      background: #2b84c4;
      border-color: #2b84c4;
      color: #fff;
      font-weight: 600;
    }
    .profile-form {
      margin: 0;
    }
    .profile-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px 14px;
    }
    .profile-grid label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      color: #3d4751;
      font-size: 13px;
      font-weight: 600;
    }
    .profile-grid input,
    .profile-grid textarea,
    .profile-grid select {
      width: 100%;
      border: 1px solid #c8cfd6;
      background: #fff;
      min-height: 36px;
      padding: 7px 8px;
      color: #2f3438;
      font-size: 13px;
    }
    .profile-grid textarea {
      min-height: 84px;
      resize: vertical;
    }
    .profile-meta-note {
      color: #596677;
      font-size: 13px;
      padding-top: 8px;
    }
    .profile-actions,
    .settings-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-top: 12px;
      flex-wrap: wrap;
    }
    .btn-primary,
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 34px;
      border-radius: 3px;
      padding: 0 12px;
      text-decoration: none;
      font-size: 13px;
      cursor: pointer;
      border: 1px solid transparent;
    }
    .btn-primary {
      background: #2a84c2;
      color: #fff;
      border-color: #2a84c2;
    }
    .btn-primary[disabled] {
      background: #8eb9d7;
      border-color: #8eb9d7;
      cursor: default;
    }
    .btn-secondary {
      background: #f3f4f6;
      color: #37424f;
      border-color: #cfd5dc;
    }
    .profile-feedback {
      margin-top: 8px;
      color: #1d7d3f;
      font-size: 13px;
      font-weight: 600;
    }
    .settings-panel {
      max-width: 980px;
    }
    .settings-title {
      font-size: 22px;
      color: #2e3237;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .settings-tabs {
      display: flex;
      gap: 6px;
      margin-bottom: 10px;
      border-bottom: 1px solid #dfe5eb;
      padding-bottom: 8px;
      flex-wrap: wrap;
    }
    .settings-form {
      display: grid;
      gap: 10px;
      max-width: 680px;
    }
    .settings-form label {
      display: grid;
      gap: 5px;
      font-size: 13px;
      font-weight: 600;
      color: #3f4a54;
    }
    .settings-form select {
      min-height: 36px;
      border: 1px solid #c8cfd6;
      padding: 6px 8px;
      color: #2f3438;
      font-size: 13px;
    }
    .settings-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #d1d7de;
      background: #fff;
    }
    .settings-table th,
    .settings-table td {
      border: 1px solid #d6dce3;
      padding: 8px 10px;
      font-size: 13px;
      vertical-align: middle;
    }
    .settings-table th {
      background: #f3f6f9;
      color: #33597e;
      font-weight: 600;
      text-align: left;
    }
    .provider-link-btn,
    .provider-unlink-btn {
      border: 1px solid #bfd1e0;
      background: #f7fafd;
      color: #2a79b7;
      border-radius: 3px;
      min-height: 30px;
      padding: 0 10px;
      cursor: pointer;
      font-size: 12px;
    }
    .provider-unlink-btn {
      border-color: #e0c4c4;
      color: #9f3535;
      background: #fff7f7;
    }
    .admin-panel {
      background: var(--panel);
      border: 1px solid var(--line);
      padding: 12px;
      max-width: 1200px;
    }
    .admin-header h1 {
      margin: 2px 0 4px;
      font-size: 34px;
      color: #2f3438;
      font-weight: 600;
    }
    .admin-subtitle {
      margin: 0 0 8px;
      color: #5c6774;
      font-size: 13px;
    }
    .admin-breadcrumbs {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
      color: #4f5e6f;
      font-size: 13px;
      margin-bottom: 10px;
    }
    .admin-breadcrumbs a {
      color: #2b7fbe;
      text-decoration: none;
    }
    .admin-breadcrumb-sep {
      color: #8a95a1;
      font-size: 12px;
    }
    .admin-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
      border-bottom: 1px solid #dde3e9;
      padding-bottom: 8px;
    }
    .admin-nav-link {
      text-decoration: none;
      color: #2c678f;
      background: #f1f5f8;
      border: 1px solid #d2dde7;
      border-radius: 3px;
      padding: 5px 10px;
      font-size: 12px;
      font-weight: 600;
    }
    .admin-nav-link.is-active {
      background: #2b84c4;
      border-color: #2b84c4;
      color: #fff;
    }
    .admin-card-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 12px;
    }
    .admin-card-link {
      display: grid;
      gap: 4px;
      text-decoration: none;
      color: #334253;
      border: 1px solid #d8e0e8;
      background: #f8fbfe;
      border-radius: 4px;
      padding: 10px;
    }
    .admin-card-icon {
      width: 24px;
      height: 24px;
      border-radius: 12px;
      background: #2b84c4;
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
    }
    .admin-card-link strong {
      color: #27658f;
      font-size: 14px;
    }
    .admin-card-link p {
      margin: 0;
      color: #586574;
      font-size: 12px;
      line-height: 1.3;
    }
    .admin-toolbar {
      max-width: 760px;
      margin-bottom: 10px;
    }
    #admin-list-filter {
      width: 100%;
      min-height: 38px;
      border: 1px solid #c9d0d8;
      background: #fbfdff;
      padding: 0 10px;
      color: #2f3438;
      font-size: 13px;
    }
    .admin-table-actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8px;
    }
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #d3dae2;
      background: #fff;
    }
    .admin-table th,
    .admin-table td {
      border: 1px solid #dbe1e8;
      padding: 8px 10px;
      font-size: 13px;
      vertical-align: top;
    }
    .admin-table th {
      background: #f4f7fa;
      color: #33597d;
      font-weight: 600;
      text-align: left;
    }
    .admin-table--compact {
      margin-top: 10px;
    }
    .admin-sort-link {
      border: 0;
      background: transparent;
      color: #2c76af;
      font-size: 13px;
      padding: 0;
      cursor: pointer;
      font-weight: 600;
    }
    .admin-cell-link {
      color: #2c76af;
      text-decoration: none;
    }
    .admin-status-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 38px;
      padding: 2px 8px;
      border-radius: 9px;
      font-size: 11px;
      font-weight: 700;
      background: #ebf5ff;
      color: #2c79b6;
    }
    .admin-status-badge.is-yes {
      background: #e7f6eb;
      color: #2a7e49;
    }
    .admin-status-badge.is-no {
      background: #f8ecec;
      color: #9f3a3a;
    }
    .admin-color-swatch {
      width: 36px;
      height: 14px;
      border: 1px solid #c8d0d8;
      border-radius: 2px;
      display: inline-block;
    }
    .admin-table-actions-cell {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }
    .admin-table-action {
      border: 1px solid #c4d2e0;
      background: #f7fafd;
      color: #2a79b7;
      text-decoration: none;
      border-radius: 3px;
      min-height: 28px;
      padding: 0 9px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      cursor: pointer;
    }
    .admin-table-action.is-danger {
      border-color: #e0c4c4;
      color: #9f3535;
      background: #fff7f7;
    }
    .admin-form {
      display: grid;
      gap: 10px;
      max-width: 760px;
      margin-top: 6px;
    }
    .admin-form-field {
      display: grid;
      gap: 4px;
      font-size: 13px;
      font-weight: 600;
      color: #3f4b56;
    }
    .admin-form-field input,
    .admin-form-field textarea,
    .admin-form-field select {
      width: 100%;
      border: 1px solid #c8d1d9;
      background: #fff;
      min-height: 36px;
      padding: 6px 8px;
      color: #2f3438;
      font-size: 13px;
    }
    .admin-form-field textarea {
      min-height: 90px;
      resize: vertical;
    }
    .admin-checkbox-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #3f4b56;
      font-weight: 600;
    }
    .admin-form-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .admin-danger-btn {
      border-color: #e0c4c4;
      color: #9f3535;
      background: #fff7f7;
    }
    .admin-refund-box {
      background: #f8fbff;
      border: 1px solid #d7e4ef;
      padding: 10px;
      margin-top: 10px;
    }
    #admin-refund-message {
      margin: 0 0 8px;
      color: #35516a;
      font-size: 13px;
    }
    .client-feature-panel {
      background: var(--panel);
      border: 1px solid var(--line);
      padding: 12px;
      max-width: 1200px;
    }
    .client-feature-header h1 {
      margin: 2px 0 4px;
      font-size: 34px;
      color: #2f3438;
      font-weight: 600;
    }
    .client-feature-header p {
      margin: 0 0 8px;
      color: #5b6876;
      font-size: 13px;
    }
    .client-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
      border-bottom: 1px solid #dde3e9;
      padding-bottom: 8px;
    }
    .client-nav-link {
      text-decoration: none;
      color: #2c678f;
      background: #f1f5f8;
      border: 1px solid #d2dde7;
      border-radius: 3px;
      padding: 5px 10px;
      font-size: 12px;
      font-weight: 600;
    }
    .client-nav-link.is-active {
      background: #2b84c4;
      border-color: #2b84c4;
      color: #fff;
    }
    .client-card-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 10px;
    }
    .client-card-item {
      border: 1px solid #d8e0e8;
      background: #f8fbfe;
      border-radius: 4px;
      padding: 10px;
      display: grid;
      gap: 3px;
    }
    .client-card-item strong {
      color: #27658f;
      font-size: 14px;
    }
    .client-card-item p {
      margin: 0;
      color: #586574;
      font-size: 12px;
      line-height: 1.3;
    }
    .client-details {
      border: 1px solid #d8e1ea;
      background: #fafcff;
      margin-bottom: 10px;
    }
    .client-details-row {
      display: grid;
      grid-template-columns: 220px minmax(0, 1fr);
      gap: 8px;
      align-items: start;
      padding: 7px 10px;
      border-top: 1px solid #e7edf3;
    }
    .client-details-row:first-child {
      border-top: 0;
    }
    .client-details-row span {
      color: #4c5b69;
      font-weight: 600;
      font-size: 13px;
    }
    .client-details-row strong {
      color: #2f3942;
      font-size: 13px;
      font-weight: 500;
    }
    .client-toolbar {
      max-width: 760px;
      margin-bottom: 10px;
    }
    #client-list-filter {
      width: 100%;
      min-height: 38px;
      border: 1px solid #c9d0d8;
      background: #fbfdff;
      padding: 0 10px;
      color: #2f3438;
      font-size: 13px;
    }
    .client-table-actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8px;
    }
    .client-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #d3dae2;
      background: #fff;
    }
    .client-table th,
    .client-table td {
      border: 1px solid #dbe1e8;
      padding: 8px 10px;
      font-size: 13px;
      vertical-align: top;
    }
    .client-table th {
      background: #f4f7fa;
      color: #33597d;
      font-weight: 600;
      text-align: left;
    }
    .client-sort-link {
      border: 0;
      background: transparent;
      color: #2c76af;
      font-size: 13px;
      padding: 0;
      cursor: pointer;
      font-weight: 600;
    }
    .client-form {
      display: grid;
      gap: 10px;
      max-width: 760px;
      margin-top: 6px;
    }
    .client-form-field {
      display: grid;
      gap: 4px;
      font-size: 13px;
      font-weight: 600;
      color: #3f4b56;
    }
    .client-form-field input,
    .client-form-field textarea,
    .client-form-field select {
      width: 100%;
      border: 1px solid #c8d1d9;
      background: #fff;
      min-height: 36px;
      padding: 6px 8px;
      color: #2f3438;
      font-size: 13px;
    }
    .client-form-field textarea {
      min-height: 90px;
      resize: vertical;
    }
    .client-checkbox-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #3f4b56;
      font-weight: 600;
    }
    .client-form-actions,
    .client-link-row {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .client-link-row {
      margin-top: 10px;
    }
    .client-table-actions-cell {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }
    .client-status-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 38px;
      padding: 2px 8px;
      border-radius: 9px;
      font-size: 11px;
      font-weight: 700;
      background: #ebf5ff;
      color: #2c79b6;
    }
    .client-status-badge.is-positive {
      background: #e7f6eb;
      color: #2a7e49;
    }
    .client-status-badge.is-negative {
      background: #f8ecec;
      color: #9f3a3a;
    }
    .route-placeholder {
      background: var(--panel);
      border: 1px solid var(--line);
      padding: 16px;
    }
    .auth-panel {
      width: 100%;
    }
    .auth-card {
      background: var(--panel);
      border: 1px solid var(--line);
      padding: 16px;
      box-shadow: 0 1px 2px rgba(19, 47, 71, 0.08);
    }
    .auth-header h1 {
      margin: 0;
      color: #2f3438;
      font-size: 28px;
      font-weight: 600;
    }
    .auth-header p {
      margin: 6px 0 0;
      color: #5f6e7e;
      font-size: 14px;
    }
    .auth-org-name {
      margin: 8px 0 0;
      color: #2c7bb7;
      font-weight: 600;
      font-size: 14px;
      text-transform: capitalize;
    }
    .auth-system-message {
      margin: 10px 0 0;
      color: #4f5f6f;
      font-size: 14px;
    }
    .auth-form {
      display: grid;
      gap: 10px;
      margin-top: 12px;
    }
    .auth-field {
      display: grid;
      gap: 4px;
      color: #41505e;
      font-size: 13px;
      font-weight: 600;
    }
    .auth-field input {
      min-height: 38px;
      border: 1px solid #c8cfd6;
      background: #fff;
      padding: 0 10px;
      color: #2f3438;
      font-size: 14px;
    }
    .auth-submit-btn {
      justify-content: center;
      min-height: 36px;
    }
    .auth-provider-grid {
      margin-top: 12px;
      display: grid;
      gap: 8px;
    }
    .auth-provider-btn {
      border: 1px solid #c5d3e2;
      background: #f8fbff;
      color: #2a79b7;
      border-radius: 3px;
      min-height: 34px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
    }
    .auth-link-row {
      margin-top: 12px;
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .auth-feedback {
      margin-top: 4px;
      color: #1d7d3f;
      font-size: 13px;
      font-weight: 600;
    }
    .auth-alert {
      margin-top: 10px;
      padding: 8px 10px;
      border: 1px solid #bfd2e3;
      background: #f0f7ff;
      color: #36597a;
      font-size: 13px;
      font-weight: 600;
    }
    .auth-alert--success {
      border-color: #b9e1c6;
      background: #edf9f1;
      color: #2c7c47;
    }
    .auth-alert--danger {
      border-color: #ebc7c7;
      background: #fff3f3;
      color: #984646;
    }
    .route-placeholder h2 {
      margin: 0 0 10px;
      color: #245f90;
      font-size: 19px;
    }
    .route-placeholder p {
      margin: 6px 0;
    }
    @media (max-width: 1280px) {
      .content-grid--wall {
        grid-template-columns: minmax(460px, 1fr) 290px;
      }
    }
    @media (max-width: 1060px) {
      .topbar {
        grid-template-columns: 140px minmax(0, 1fr);
      }
      .topbar-right {
        display: none;
      }
      .shell-main {
        grid-template-columns: 1fr;
      }
      .left-rail {
        min-height: 0;
      }
      .content-grid--wall {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 640px) {
      .topbar {
        height: auto;
        padding: 10px;
        gap: 8px;
      }
      .brand {
        width: auto;
      }
      .shell-content {
        padding: 10px;
      }
      .left-rail {
        padding: 10px;
      }
      .employee-table th,
      .employee-table td {
        padding: 8px 6px;
        font-size: 12px;
      }
      .profile-row {
        grid-template-columns: 1fr;
      }
      .profile-grid {
        grid-template-columns: 1fr;
      }
      .admin-card-grid {
        grid-template-columns: 1fr;
      }
      .client-card-grid {
        grid-template-columns: 1fr;
      }
      .client-details-row {
        grid-template-columns: 1fr;
      }
    }
  </style>
  <main class="app-shell" data-app="simoona-modern-web-runtime" data-route-key="${escapeHtml(runtimeData.routeMatch?.routeKey || "unknown")}">
    ${headerMarkup}
    <section class="${shellMainClass}">
      ${leftRailMarkup}
      <section class="${shellContentClass}">${mainContentMarkup}</section>
    </section>
  </main>
`;

for (const likeButton of root.querySelectorAll(".action-like")) {
  likeButton.addEventListener("click", () => {
    const postId = likeButton.getAttribute("data-like-for");
    const countNode = postId ? root.querySelector(`[data-like-count="${postId}"]`) : null;
    const value = Number.parseInt(countNode?.textContent ?? "0", 10);
    if (countNode) {
      countNode.textContent = String(Number.isNaN(value) ? 1 : value + 1);
    }
  });
}

for (const replyButton of root.querySelectorAll(".action-reply")) {
  replyButton.addEventListener("click", () => {
    const postId = replyButton.getAttribute("data-reply-for");
    const form = postId ? root.querySelector(`[data-reply-form="${postId}"]`) : null;
    if (form) {
      const hidden = form.hasAttribute("hidden");
      if (hidden) {
        form.removeAttribute("hidden");
      } else {
        form.setAttribute("hidden", "");
      }
    }
  });
}

function setupEmployeeListInteractions() {
  const employeeRowsContainer = root.querySelector("#employee-rows");
  const filterInput = root.querySelector("#employee-filter");
  const pagination = root.querySelector("#employee-pagination");

  if (!employeeRowsContainer || !filterInput || !pagination) {
    return;
  }

  const listData = runtimeData.employeeList;
  const sourceRows = Array.isArray(listData?.rows) ? listData.rows : [];
  const pageSize = Number(listData?.pageSize) > 0 ? Number(listData.pageSize) : 10;

  const state = {
    page: 1,
    search: "",
    sortKey: "fullName",
    sortDirection: "asc",
    selectedId: sourceRows[6]?.id || sourceRows[0]?.id || ""
  };

  function compareValues(a, b) {
    const left = String(a || "").toLowerCase();
    const right = String(b || "").toLowerCase();

    if (left === right) {
      return 0;
    }
    return left < right ? -1 : 1;
  }

  function getVisibleRows() {
    const searchTerm = state.search.trim().toLowerCase();
    const filteredRows = sourceRows.filter((row) => {
      if (!searchTerm) {
        return true;
      }

      return [row.fullName, row.birthDate, row.jobTitle, row.workingHours]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm);
    });

    const sortedRows = [...filteredRows].sort((leftRow, rightRow) => {
      const compare = compareValues(leftRow[state.sortKey], rightRow[state.sortKey]);
      return state.sortDirection === "asc" ? compare : compare * -1;
    });

    return sortedRows;
  }

  function renderPager(totalPages) {
    const prevDisabled = state.page <= 1;
    const nextDisabled = state.page >= totalPages;
    const pageButtons = [];

    for (let page = 1; page <= totalPages; page += 1) {
      pageButtons.push(
        `<button type="button" class="pager-btn${page === state.page ? " is-current" : ""}" data-page="${String(page)}">${String(page)}</button>`
      );
    }

    pagination.innerHTML = `
      <button type="button" class="pager-btn" data-page-nav="first" ${prevDisabled ? "disabled" : ""}>«</button>
      <button type="button" class="pager-btn" data-page-nav="prev" ${prevDisabled ? "disabled" : ""}>‹</button>
      ${pageButtons.join("")}
      <button type="button" class="pager-btn" data-page-nav="next" ${nextDisabled ? "disabled" : ""}>›</button>
      <button type="button" class="pager-btn" data-page-nav="last" ${nextDisabled ? "disabled" : ""}>»</button>
    `;

    for (const pageButton of pagination.querySelectorAll("[data-page]")) {
      pageButton.addEventListener("click", () => {
        state.page = Number(pageButton.getAttribute("data-page") || "1");
        render();
      });
    }

    const firstButton = pagination.querySelector('[data-page-nav="first"]');
    const prevButton = pagination.querySelector('[data-page-nav="prev"]');
    const nextButton = pagination.querySelector('[data-page-nav="next"]');
    const lastButton = pagination.querySelector('[data-page-nav="last"]');

    firstButton?.addEventListener("click", () => {
      state.page = 1;
      render();
    });

    prevButton?.addEventListener("click", () => {
      state.page = Math.max(1, state.page - 1);
      render();
    });

    nextButton?.addEventListener("click", () => {
      state.page = Math.min(totalPages, state.page + 1);
      render();
    });

    lastButton?.addEventListener("click", () => {
      state.page = totalPages;
      render();
    });
  }

  function render() {
    const visibleRows = getVisibleRows();
    const totalPages = Math.max(1, Math.ceil(visibleRows.length / pageSize));

    if (state.page > totalPages) {
      state.page = totalPages;
    }

    const start = (state.page - 1) * pageSize;
    const pagedRows = visibleRows.slice(start, start + pageSize);

    employeeRowsContainer.innerHTML = pagedRows
      .map((row) => {
        const rowClass = row.id === state.selectedId ? "employee-row-selected" : "";
        return `
          <tr class="${rowClass}" data-row-id="${escapeHtml(row.id)}">
            <td><a class="employee-name" href="/default/Profiles/Details/${escapeHtml(row.id)}">${escapeHtml(row.fullName)}</a></td>
            <td>${escapeHtml(row.birthDate)}</td>
            <td>${escapeHtml(row.jobTitle)}</td>
            <td>${escapeHtml(row.workingHours)}</td>
          </tr>
        `;
      })
      .join("");

    for (const rowNode of employeeRowsContainer.querySelectorAll("tr[data-row-id]")) {
      rowNode.addEventListener("click", () => {
        state.selectedId = rowNode.getAttribute("data-row-id") || "";
        render();
      });
    }

    renderPager(totalPages);
  }

  for (const sortButton of root.querySelectorAll(".sort-link")) {
    sortButton.addEventListener("click", () => {
      const sortKey = sortButton.getAttribute("data-sort-key");
      if (!sortKey) {
        return;
      }

      if (state.sortKey === sortKey) {
        state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
      } else {
        state.sortKey = sortKey;
        state.sortDirection = "asc";
      }

      state.page = 1;
      render();
    });
  }

  filterInput.addEventListener("input", () => {
    state.search = filterInput.value;
    state.page = 1;
    render();
  });

  render();
}

function setupProfilePageInteractions() {
  const profilePage = runtimeData.profilePage;
  if (!profilePage || profilePage.mode !== "edit") {
    return;
  }

  const tabButtons = root.querySelectorAll("[data-profile-tab]");
  const tabContents = root.querySelectorAll("[data-profile-tab-content]");
  const editForm = root.querySelector("#profile-edit-form");
  const saveButton = root.querySelector("#profile-edit-save");
  const feedback = root.querySelector("#profile-edit-feedback");

  if (!tabButtons.length || !tabContents.length || !editForm || !saveButton || !feedback) {
    return;
  }

  const state = {
    activeTab: String(profilePage.edit?.activeTab || "personal"),
    dirty: false
  };

  function applyTabState() {
    for (const button of tabButtons) {
      const tabName = button.getAttribute("data-profile-tab");
      if (tabName === state.activeTab) {
        button.classList.add("is-active");
      } else {
        button.classList.remove("is-active");
      }
    }

    for (const panel of tabContents) {
      const panelName = panel.getAttribute("data-profile-tab-content");
      if (panelName === state.activeTab) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    }
  }

  for (const button of tabButtons) {
    button.addEventListener("click", () => {
      const tabName = button.getAttribute("data-profile-tab");
      if (!tabName) {
        return;
      }
      state.activeTab = tabName;
      applyTabState();
    });
  }

  for (const field of editForm.querySelectorAll("input, textarea, select")) {
    field.addEventListener("input", () => {
      state.dirty = true;
      saveButton.removeAttribute("disabled");
      feedback.setAttribute("hidden", "");
    });
    field.addEventListener("change", () => {
      state.dirty = true;
      saveButton.removeAttribute("disabled");
      feedback.setAttribute("hidden", "");
    });
  }

  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.dirty = false;
    saveButton.setAttribute("disabled", "");
    feedback.removeAttribute("hidden");
  });

  applyTabState();
}

function setupSettingsPageInteractions() {
  const settingsPage = runtimeData.settingsPage;
  if (!settingsPage) {
    return;
  }

  const tabButtons = root.querySelectorAll("[data-settings-tab]");
  const tabContents = root.querySelectorAll("[data-settings-content]");
  const settingsState = {
    activeTab: String(settingsPage.activeTab || "general")
  };

  function applySettingsTabState() {
    for (const button of tabButtons) {
      const tabName = button.getAttribute("data-settings-tab");
      if (tabName === settingsState.activeTab) {
        button.classList.add("is-active");
      } else {
        button.classList.remove("is-active");
      }
    }

    for (const panel of tabContents) {
      const panelName = panel.getAttribute("data-settings-content");
      if (panelName === settingsState.activeTab) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    }
  }

  for (const button of tabButtons) {
    button.addEventListener("click", () => {
      const tabName = button.getAttribute("data-settings-tab");
      if (!tabName) {
        return;
      }
      settingsState.activeTab = tabName;
      applySettingsTabState();
    });
  }

  const languageSelect = root.querySelector("#settings-language");
  const timezoneSelect = root.querySelector("#settings-timezone");
  const generalForm = root.querySelector("#settings-general-form");
  const generalSaveButton = root.querySelector("#settings-general-save");
  const generalFeedback = root.querySelector("#settings-general-feedback");

  if (languageSelect && timezoneSelect && generalForm && generalSaveButton && generalFeedback) {
    const initialState = {
      language: languageSelect.value,
      timezone: timezoneSelect.value
    };

    function refreshGeneralDirtyState() {
      const dirty =
        languageSelect.value !== initialState.language ||
        timezoneSelect.value !== initialState.timezone;

      if (dirty) {
        generalSaveButton.removeAttribute("disabled");
      } else {
        generalSaveButton.setAttribute("disabled", "");
      }
      generalFeedback.setAttribute("hidden", "");
    }

    languageSelect.addEventListener("change", refreshGeneralDirtyState);
    timezoneSelect.addEventListener("change", refreshGeneralDirtyState);

    generalForm.addEventListener("submit", (event) => {
      event.preventDefault();
      initialState.language = languageSelect.value;
      initialState.timezone = timezoneSelect.value;
      generalSaveButton.setAttribute("disabled", "");
      generalFeedback.removeAttribute("hidden");
    });
  }

  const notificationsForm = root.querySelector("#settings-notifications-form");
  const notificationsSave = root.querySelector("#settings-notifications-save");

  if (notificationsForm && notificationsSave) {
    for (const checkbox of notificationsForm.querySelectorAll('[data-settings-checkbox]')) {
      checkbox.addEventListener("change", () => {
        notificationsSave.removeAttribute("disabled");
      });
    }

    notificationsForm.addEventListener("submit", (event) => {
      event.preventDefault();
      notificationsSave.setAttribute("disabled", "");
    });
  }

  for (const unlinkButton of root.querySelectorAll("[data-provider-unlink]")) {
    unlinkButton.addEventListener("click", () => {
      const row = unlinkButton.closest("tr");
      if (!row) {
        return;
      }
      const providerName = unlinkButton.getAttribute("data-provider-unlink") || "Provider";
      row.innerHTML = `
        <td>${escapeHtml(providerName)}</td>
        <td><button type="button" class="provider-link-btn" data-provider-link="${escapeHtml(providerName)}">Sign in</button></td>
        <td></td>
      `;
    });
  }

  applySettingsTabState();
}

function setupAuthUtilityInteractions() {
  const authPage = runtimeData.authUtilityPage;
  if (!authPage) {
    return;
  }

  const formId = authPage.form?.id;
  if (formId) {
    const form = root.querySelector(`#${formId}`);
    const submitButton = root.querySelector(`#${formId}-submit`);
    const feedback = root.querySelector(`#${formId}-feedback`);
    const fields = form ? Array.from(form.querySelectorAll("[data-auth-field]")) : [];

    if (form && submitButton && feedback && fields.length) {
      const passwordInput = form.querySelector('input[name="password"]');
      const confirmPasswordInput =
        form.querySelector('input[name="confirmPassword"]') ||
        form.querySelector('input[name="repeatedPassword"]');

      function isFieldValid(fieldNode) {
        const required = fieldNode.getAttribute("data-auth-required") === "true";
        if (!required) {
          return true;
        }
        return String(fieldNode.value || "").trim().length > 0;
      }

      function refreshSubmitState() {
        const requiredValid = fields.every((fieldNode) => isFieldValid(fieldNode));
        const passwordsMatch =
          !passwordInput ||
          !confirmPasswordInput ||
          String(passwordInput.value || "") === String(confirmPasswordInput.value || "");

        if (requiredValid && passwordsMatch) {
          submitButton.removeAttribute("disabled");
        } else {
          submitButton.setAttribute("disabled", "");
        }
        feedback.setAttribute("hidden", "");
      }

      for (const fieldNode of fields) {
        fieldNode.addEventListener("input", refreshSubmitState);
        fieldNode.addEventListener("change", refreshSubmitState);
      }

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitButton.setAttribute("disabled", "");
        feedback.textContent = authPage.form?.submitSuccessMessage || "Completed successfully.";
        feedback.removeAttribute("hidden");
      });

      refreshSubmitState();
    }
  }

  const providerFeedback = root.querySelector("#auth-provider-feedback");
  for (const providerButton of root.querySelectorAll("[data-auth-provider]")) {
    providerButton.addEventListener("click", () => {
      const providerId = providerButton.getAttribute("data-auth-provider") || "provider";
      if (providerFeedback) {
        providerFeedback.textContent = `${providerId} sign-in flow started.`;
        providerFeedback.removeAttribute("hidden");
      }
    });
  }
}

function setupClientFeatureInteractions() {
  const clientPage = runtimeData.clientFeaturePage;
  if (!clientPage) {
    return;
  }

  const tableConfig = clientPage.table;
  const rowsContainer = root.querySelector("#client-list-rows");
  const filterInput = root.querySelector("#client-list-filter");
  const pagination = root.querySelector("#client-list-pagination");
  const sortButtons = root.querySelectorAll(".client-sort-link");

  if (tableConfig && rowsContainer && pagination) {
    const columns = Array.isArray(tableConfig.columns) ? tableConfig.columns : [];
    const sourceRows = Array.isArray(tableConfig.rows) ? tableConfig.rows : [];
    const pageSize = Number(tableConfig.pageSize) > 0 ? Number(tableConfig.pageSize) : 8;
    const firstSortable = columns.find((column) => column.sortable)?.key || columns[0]?.key || "";
    const state = {
      page: 1,
      search: "",
      sortKey: tableConfig.defaultSort?.key || firstSortable,
      sortDirection: tableConfig.defaultSort?.direction === "desc" ? "desc" : "asc"
    };

    function compareValues(leftValue, rightValue) {
      const left = String(leftValue ?? "").toLowerCase();
      const right = String(rightValue ?? "").toLowerCase();
      if (left === right) {
        return 0;
      }
      return left < right ? -1 : 1;
    }

    function getVisibleRows() {
      const searchTerm = state.search.trim().toLowerCase();
      const filteredRows = sourceRows.filter((row) => {
        if (!searchTerm) {
          return true;
        }

        const lookup = columns
          .filter((column) => column.key !== "actions")
          .map((column) => String(row[column.key] || ""))
          .join(" ")
          .toLowerCase();
        return lookup.includes(searchTerm);
      });

      if (!state.sortKey) {
        return filteredRows;
      }

      const sortedRows = [...filteredRows].sort((leftRow, rightRow) => {
        const compare = compareValues(leftRow[state.sortKey], rightRow[state.sortKey]);
        return state.sortDirection === "asc" ? compare : compare * -1;
      });

      return sortedRows;
    }

    function renderPager(totalPages) {
      const prevDisabled = state.page <= 1;
      const nextDisabled = state.page >= totalPages;
      const pageButtons = [];

      for (let page = 1; page <= totalPages; page += 1) {
        pageButtons.push(
          `<button type="button" class="pager-btn${page === state.page ? " is-current" : ""}" data-client-page="${String(page)}">${String(page)}</button>`
        );
      }

      pagination.innerHTML = `
        <button type="button" class="pager-btn" data-client-page-nav="first" ${prevDisabled ? "disabled" : ""}>«</button>
        <button type="button" class="pager-btn" data-client-page-nav="prev" ${prevDisabled ? "disabled" : ""}>‹</button>
        ${pageButtons.join("")}
        <button type="button" class="pager-btn" data-client-page-nav="next" ${nextDisabled ? "disabled" : ""}>›</button>
        <button type="button" class="pager-btn" data-client-page-nav="last" ${nextDisabled ? "disabled" : ""}>»</button>
      `;

      for (const pageButton of pagination.querySelectorAll("[data-client-page]")) {
        pageButton.addEventListener("click", () => {
          state.page = Number(pageButton.getAttribute("data-client-page") || "1");
          render();
        });
      }

      pagination.querySelector('[data-client-page-nav="first"]')?.addEventListener("click", () => {
        state.page = 1;
        render();
      });
      pagination.querySelector('[data-client-page-nav="prev"]')?.addEventListener("click", () => {
        state.page = Math.max(1, state.page - 1);
        render();
      });
      pagination.querySelector('[data-client-page-nav="next"]')?.addEventListener("click", () => {
        state.page = Math.min(totalPages, state.page + 1);
        render();
      });
      pagination.querySelector('[data-client-page-nav="last"]')?.addEventListener("click", () => {
        state.page = totalPages;
        render();
      });
    }

    function renderCell(row, column) {
      if (column.key === "actions") {
        return `<div class="client-table-actions-cell">${renderAdminActionButtons(row.actions)}</div>`;
      }

      const value = row[column.key];
      if (column.badge) {
        const normalized = String(value || "").trim().toLowerCase();
        const positiveTokens = ["open", "active", "approved", "available", "yes", "in progress", "started"];
        const negativeTokens = ["full", "on hold", "ended", "pending", "no", "closed"];
        let badgeClass = "";
        if (positiveTokens.includes(normalized)) {
          badgeClass = " is-positive";
        } else if (negativeTokens.includes(normalized)) {
          badgeClass = " is-negative";
        }
        return `<span class="client-status-badge${badgeClass}">${escapeHtml(value || "")}</span>`;
      }

      if (column.link) {
        const pathValue = row[`${column.key}Path`] || "";
        if (pathValue) {
          return `<a class="admin-cell-link" href="${escapeHtml(pathValue)}">${escapeHtml(value || "")}</a>`;
        }
      }

      return escapeHtml(value || "");
    }

    function render() {
      const visibleRows = getVisibleRows();
      const totalPages = Math.max(1, Math.ceil(visibleRows.length / pageSize));
      if (state.page > totalPages) {
        state.page = totalPages;
      }

      const startIndex = (state.page - 1) * pageSize;
      const pagedRows = visibleRows.slice(startIndex, startIndex + pageSize);
      rowsContainer.innerHTML = pagedRows
        .map(
          (row) => `
            <tr data-client-row-id="${escapeHtml(row.id || "")}">
              ${columns.map((column) => `<td>${renderCell(row, column)}</td>`).join("")}
            </tr>
          `
        )
        .join("");

      renderPager(totalPages);
    }

    for (const sortButton of sortButtons) {
      sortButton.addEventListener("click", () => {
        const sortKey = sortButton.getAttribute("data-client-sort-key");
        if (!sortKey) {
          return;
        }
        if (state.sortKey === sortKey) {
          state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
        } else {
          state.sortKey = sortKey;
          state.sortDirection = "asc";
        }
        state.page = 1;
        render();
      });
    }

    if (filterInput) {
      filterInput.addEventListener("input", () => {
        state.search = filterInput.value;
        state.page = 1;
        render();
      });
    }

    render();
  }

  const formId = clientPage.form?.id;
  if (formId) {
    const form = root.querySelector(`#${formId}`);
    const saveButton = root.querySelector(`#${formId}-save`);
    const feedback = root.querySelector(`#${formId}-feedback`);
    if (form && saveButton && feedback) {
      for (const field of form.querySelectorAll("input, textarea, select")) {
        field.addEventListener("input", () => {
          saveButton.removeAttribute("disabled");
          feedback.setAttribute("hidden", "");
        });
        field.addEventListener("change", () => {
          saveButton.removeAttribute("disabled");
          feedback.setAttribute("hidden", "");
        });
      }

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        saveButton.setAttribute("disabled", "");
        feedback.removeAttribute("hidden");
      });
    }
  }
}

function setupAdminPageInteractions() {
  const adminPage = runtimeData.adminPage;
  if (!adminPage) {
    return;
  }

  const tableConfig = adminPage.table;
  const rowsContainer = root.querySelector("#admin-list-rows");
  const filterInput = root.querySelector("#admin-list-filter");
  const pagination = root.querySelector("#admin-list-pagination");
  const sortButtons = root.querySelectorAll(".admin-sort-link");

  if (tableConfig && rowsContainer && pagination) {
    const columns = Array.isArray(tableConfig.columns) ? tableConfig.columns : [];
    const sourceRows = Array.isArray(tableConfig.rows) ? tableConfig.rows : [];
    const pageSize = Number(tableConfig.pageSize) > 0 ? Number(tableConfig.pageSize) : 8;
    const firstSortable = columns.find((column) => column.sortable)?.key || columns[0]?.key || "";
    const state = {
      page: 1,
      search: "",
      sortKey: tableConfig.defaultSort?.key || firstSortable,
      sortDirection: tableConfig.defaultSort?.direction === "desc" ? "desc" : "asc"
    };

    function compareValues(leftValue, rightValue) {
      const left = String(leftValue ?? "").toLowerCase();
      const right = String(rightValue ?? "").toLowerCase();
      if (left === right) {
        return 0;
      }
      return left < right ? -1 : 1;
    }

    function getVisibleRows() {
      const searchTerm = state.search.trim().toLowerCase();
      const filteredRows = sourceRows.filter((row) => {
        if (!searchTerm) {
          return true;
        }

        const lookup = columns
          .filter((column) => column.key !== "actions")
          .map((column) => String(row[column.key] || ""))
          .join(" ")
          .toLowerCase();
        return lookup.includes(searchTerm);
      });

      if (!state.sortKey) {
        return filteredRows;
      }

      const sortedRows = [...filteredRows].sort((leftRow, rightRow) => {
        const compare = compareValues(leftRow[state.sortKey], rightRow[state.sortKey]);
        return state.sortDirection === "asc" ? compare : compare * -1;
      });

      return sortedRows;
    }

    function renderPager(totalPages) {
      const prevDisabled = state.page <= 1;
      const nextDisabled = state.page >= totalPages;
      const pageButtons = [];

      for (let page = 1; page <= totalPages; page += 1) {
        pageButtons.push(
          `<button type="button" class="pager-btn${page === state.page ? " is-current" : ""}" data-admin-page="${String(page)}">${String(page)}</button>`
        );
      }

      pagination.innerHTML = `
        <button type="button" class="pager-btn" data-admin-page-nav="first" ${prevDisabled ? "disabled" : ""}>«</button>
        <button type="button" class="pager-btn" data-admin-page-nav="prev" ${prevDisabled ? "disabled" : ""}>‹</button>
        ${pageButtons.join("")}
        <button type="button" class="pager-btn" data-admin-page-nav="next" ${nextDisabled ? "disabled" : ""}>›</button>
        <button type="button" class="pager-btn" data-admin-page-nav="last" ${nextDisabled ? "disabled" : ""}>»</button>
      `;

      for (const pageButton of pagination.querySelectorAll("[data-admin-page]")) {
        pageButton.addEventListener("click", () => {
          state.page = Number(pageButton.getAttribute("data-admin-page") || "1");
          render();
        });
      }

      pagination.querySelector('[data-admin-page-nav="first"]')?.addEventListener("click", () => {
        state.page = 1;
        render();
      });
      pagination.querySelector('[data-admin-page-nav="prev"]')?.addEventListener("click", () => {
        state.page = Math.max(1, state.page - 1);
        render();
      });
      pagination.querySelector('[data-admin-page-nav="next"]')?.addEventListener("click", () => {
        state.page = Math.min(totalPages, state.page + 1);
        render();
      });
      pagination.querySelector('[data-admin-page-nav="last"]')?.addEventListener("click", () => {
        state.page = totalPages;
        render();
      });
    }

    function renderCell(row, column) {
      if (column.key === "actions") {
        return `<div class="admin-table-actions-cell">${renderAdminActionButtons(row.actions)}</div>`;
      }

      const value = row[column.key];
      if (column.colorSwatch) {
        return `
          <span class="admin-color-swatch" style="background:${escapeHtml(value || "#ffffff")}"></span>
          <span>${escapeHtml(value || "")}</span>
        `;
      }

      if (column.badge) {
        const normalized = String(value || "").trim().toLowerCase();
        const badgeClass =
          normalized === "yes" ? " is-yes" : normalized === "no" ? " is-no" : "";
        return `<span class="admin-status-badge${badgeClass}">${escapeHtml(value || "")}</span>`;
      }

      if (column.link) {
        const pathValue = row[`${column.key}Path`] || "";
        if (pathValue) {
          return `<a class="admin-cell-link" href="${escapeHtml(pathValue)}">${escapeHtml(value || "")}</a>`;
        }
      }

      return escapeHtml(value || "");
    }

    function render() {
      const visibleRows = getVisibleRows();
      const totalPages = Math.max(1, Math.ceil(visibleRows.length / pageSize));
      if (state.page > totalPages) {
        state.page = totalPages;
      }

      const startIndex = (state.page - 1) * pageSize;
      const pagedRows = visibleRows.slice(startIndex, startIndex + pageSize);
      rowsContainer.innerHTML = pagedRows
        .map(
          (row) => `
            <tr data-admin-row-id="${escapeHtml(row.id || "")}">
              ${columns.map((column) => `<td>${renderCell(row, column)}</td>`).join("")}
            </tr>
          `
        )
        .join("");

      renderPager(totalPages);
    }

    for (const sortButton of sortButtons) {
      sortButton.addEventListener("click", () => {
        const sortKey = sortButton.getAttribute("data-admin-sort-key");
        if (!sortKey) {
          return;
        }
        if (state.sortKey === sortKey) {
          state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
        } else {
          state.sortKey = sortKey;
          state.sortDirection = "asc";
        }
        state.page = 1;
        render();
      });
    }

    if (filterInput) {
      filterInput.addEventListener("input", () => {
        state.search = filterInput.value;
        state.page = 1;
        render();
      });
    }

    render();
  }

  const form = root.querySelector("#admin-form");
  const formSaveButton = root.querySelector("#admin-form-save");
  const formFeedback = root.querySelector("#admin-form-feedback");
  if (form && formSaveButton && formFeedback) {
    for (const field of form.querySelectorAll("input, textarea, select")) {
      field.addEventListener("input", () => {
        formSaveButton.removeAttribute("disabled");
        formFeedback.setAttribute("hidden", "");
      });
      field.addEventListener("change", () => {
        formSaveButton.removeAttribute("disabled");
        formFeedback.setAttribute("hidden", "");
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      formSaveButton.setAttribute("disabled", "");
      formFeedback.textContent = "Information saved.";
      formFeedback.removeAttribute("hidden");
    });

    const dangerButton = root.querySelector("#admin-form-danger");
    dangerButton?.addEventListener("click", () => {
      formFeedback.textContent = "Item deleted.";
      formFeedback.removeAttribute("hidden");
    });
  }

  const refundAction = root.querySelector("#admin-refund-action");
  const refundMessage = root.querySelector("#admin-refund-message");
  if (refundAction && refundMessage && adminPage.refund) {
    refundAction.addEventListener("click", () => {
      refundMessage.textContent = adminPage.refund.failedMessage || "Refund failed.";
    });
  }
}

setupEmployeeListInteractions();
setupProfilePageInteractions();
setupSettingsPageInteractions();
setupAuthUtilityInteractions();
setupClientFeatureInteractions();
setupAdminPageInteractions();
