import { escapeHtml, isPathActive } from "../../runtime/runtime-shared.js";
import { renderAdminActionButtons } from "../admin/render.js";

function renderClientFeatureNavigation(clientPage, routePath) {
  const navigation = Array.isArray(clientPage?.navigation) ? clientPage.navigation : [];
  if (!navigation.length) {
    return "";
  }

  return navigation
    .map(
      (item) =>
        `<a class="client-nav-link${isPathActive(item.path, routePath) ? " is-active" : ""}" href="${escapeHtml(item.path)}">${escapeHtml(item.label)}</a>`
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

export function renderClientFeaturePage(runtimeData) {
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
      <nav class="client-nav">${renderClientFeatureNavigation(clientPage, runtimeData.route)}</nav>
      ${renderClientFeatureCards(clientPage)}
      ${renderClientFeatureDetails(clientPage)}
      ${renderClientFeatureTableFrame(clientPage)}
      ${renderClientFeatureForm(clientPage)}
      ${renderClientFeatureLinks(clientPage)}
    </section>
  `;
}
