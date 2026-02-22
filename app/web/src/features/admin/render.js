import { escapeHtml, isPathActive } from "../../runtime/runtime-shared.js";

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

function renderAdminNavigation(adminPage, routePath) {
  const navigation = Array.isArray(adminPage?.navigation) ? adminPage.navigation : [];
  return navigation
    .map(
      (item) =>
        `<a class="admin-nav-link${isPathActive(item.path, routePath) ? " is-active" : ""}" href="${escapeHtml(item.path)}">${escapeHtml(item.label)}</a>`
    )
    .join("");
}

export function renderAdminActionButtons(actions) {
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

export function renderAdminPage(runtimeData) {
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
      <nav class="admin-nav">${renderAdminNavigation(adminPage, runtimeData.route)}</nav>
      ${renderAdminCards(adminPage)}
      ${renderAdminTableFrame(adminPage)}
      ${renderAdminForm(adminPage)}
      ${renderAdminDonationsTable(adminPage)}
      ${renderAdminRefund(adminPage)}
    </section>
  `;
}
