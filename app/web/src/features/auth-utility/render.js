import { escapeHtml } from "../../runtime/runtime-shared.js";

export function renderAuthUtilityPage(runtimeData) {
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

