import { useMemo, useState } from "react";
import { isPathActive } from "../../runtime/runtime-shared";
import type {
  RuntimeData,
  RuntimeFormField,
  RuntimeFormModel,
  RuntimeTableModel
} from "../../app/runtime-data";
import { normalizeText } from "../../app/lib/normalize-text";
import { useInteractiveTable } from "../../app/hooks/useInteractiveTable";

function renderActions(actions: unknown, className: string) {
  if (!Array.isArray(actions) || actions.length === 0) {
    return null;
  }

  return actions.map((action, index) => {
    const normalized = (action ?? {}) as {
      label?: string;
      path?: string;
      kind?: string;
    };
    const variantClass = normalized.kind === "danger" ? " is-danger" : "";

    if (normalized.path) {
      return (
        <a
          key={`action-link-${String(index)}`}
          className={`${className}${variantClass}`}
          href={normalized.path}
        >
          {normalized.label || "Action"}
        </a>
      );
    }

    return (
      <button
        key={`action-btn-${String(index)}`}
        className={`${className}${variantClass}`}
        type="button"
      >
        {normalized.label || "Action"}
      </button>
    );
  });
}

function AuthField({
  field,
  value,
  onChange
}: {
  field: RuntimeFormField;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = `auth-input-${field.id}`;
  const inputType = field.type || "text";

  if (inputType === "textarea") {
    return (
      <label className="auth-field" htmlFor={id}>
        <span>{field.label}</span>
        <textarea id={id} name={field.id} value={value} onChange={(event) => onChange(event.target.value)} />
      </label>
    );
  }

  return (
    <label className="auth-field" htmlFor={id}>
      <span>{field.label}</span>
      <input
        id={id}
        name={field.id}
        type={inputType}
        placeholder={field.placeholder || ""}
        value={value}
        data-auth-field
        data-auth-required={field.required ? "true" : "false"}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function AuthUtilityView({ runtimeData }: { runtimeData: RuntimeData }) {
  const authPage = runtimeData.authUtilityPage as
    | {
        view?: string;
        title?: string;
        subtitle?: string;
        organizationName?: string;
        message?: string;
        alert?: { kind?: string; message?: string };
        providers?: Array<{ id: string; label: string }>;
        links?: Array<{ label: string; path: string; kind?: string }>;
        form?: {
          id?: string;
          submitLabel?: string;
          submitSuccessMessage?: string;
          fields?: RuntimeFormField[];
        };
      }
    | undefined;

  if (!authPage) {
    return null;
  }

  const formFields = authPage.form?.fields || [];
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of formFields) {
      initial[field.id] = field.value || "";
    }
    return initial;
  });
  const [formFeedback, setFormFeedback] = useState<string>("");
  const [providerFeedback, setProviderFeedback] = useState<string>("");

  const formId = authPage.form?.id || "auth-form";

  const submitEnabled = useMemo(() => {
    if (!formFields.length) {
      return false;
    }

    const requiredValid = formFields.every((field) => {
      if (!field.required) {
        return true;
      }
      return normalizeText(values[field.id]).length > 0;
    });

    const passwordValue = values.password;
    const confirmValue = values.confirmPassword || values.repeatedPassword;
    const passwordsMatch =
      !passwordValue || !confirmValue || normalizeText(passwordValue) === normalizeText(confirmValue);

    return requiredValid && passwordsMatch;
  }, [formFields, values]);

  const alertClass =
    authPage.alert?.kind === "success"
      ? " auth-alert--success"
      : authPage.alert?.kind === "danger"
        ? " auth-alert--danger"
        : "";

  return (
    <section
      className="auth-panel"
      data-ui="legacy-auth-view"
      data-auth-view={authPage.view || "auth"}
    >
      <article className="auth-card">
        <header className="auth-header">
          <h1>{authPage.title || "Simoona"}</h1>
          {authPage.subtitle ? <p>{authPage.subtitle}</p> : null}
        </header>

        {authPage.organizationName ? <p className="auth-org-name">{authPage.organizationName}</p> : null}
        {authPage.message ? <p className="auth-system-message">{authPage.message}</p> : null}
        {authPage.alert?.message ? <div className={`auth-alert${alertClass}`}>{authPage.alert.message}</div> : null}

        {authPage.form && formFields.length ? (
          <form
            id={formId}
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!submitEnabled) {
                return;
              }
              setFormFeedback(authPage.form?.submitSuccessMessage || "Completed successfully.");
            }}
          >
            {formFields.map((field) => (
              <AuthField
                key={field.id}
                field={field}
                value={values[field.id] || ""}
                onChange={(nextValue) => {
                  setValues((current) => ({
                    ...current,
                    [field.id]: nextValue
                  }));
                  setFormFeedback("");
                }}
              />
            ))}

            <button
              id={`${formId}-submit`}
              className="btn-primary auth-submit-btn"
              type="submit"
              disabled={!submitEnabled}
            >
              {authPage.form.submitLabel || "Submit"}
            </button>
            <div id={`${formId}-feedback`} className="auth-feedback" hidden={!formFeedback}>
              {formFeedback}
            </div>
          </form>
        ) : null}

        {Array.isArray(authPage.providers) && authPage.providers.length ? (
          <>
            <div className="auth-provider-grid">
              {authPage.providers.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  className="auth-provider-btn"
                  data-auth-provider={provider.id}
                  onClick={() => {
                    setProviderFeedback(`${provider.id} sign-in flow started.`);
                  }}
                >
                  {provider.label}
                </button>
              ))}
            </div>
            <div id="auth-provider-feedback" className="auth-feedback" hidden={!providerFeedback}>
              {providerFeedback}
            </div>
          </>
        ) : null}

        {Array.isArray(authPage.links) && authPage.links.length ? (
          <div className="auth-link-row">
            {authPage.links.map((link) => (
              <a
                key={`${link.label}-${link.path}`}
                className={link.kind === "primary" ? "btn-primary" : "btn-secondary"}
                href={link.path}
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </article>
    </section>
  );
}

export function ClientFeatureView({ runtimeData }: { runtimeData: RuntimeData }) {
  const clientPage = runtimeData.clientFeaturePage as
    | {
        view?: string;
        title?: string;
        subtitle?: string;
        navigation?: Array<{ id: string; label: string; path: string }>;
        cards?: Array<{ title: string; subtitle: string }>;
        details?: { sections?: Array<{ label: string; value: string }> };
        filterPlaceholder?: string;
        table?: RuntimeTableModel;
        form?: RuntimeFormModel;
      }
    | undefined;

  if (!clientPage) {
    return null;
  }

  const table = clientPage.table
    ? useInteractiveTable({
        table: clientPage.table
      })
    : null;

  const form = clientPage.form;
  const formFields: RuntimeFormField[] = Array.isArray(form?.fields) ? form.fields : [];
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of formFields) {
      initial[field.id] = field.value || "";
    }
    return initial;
  });
  const [formFeedbackVisible, setFormFeedbackVisible] = useState(false);

  const formId = form?.id || "client-form";

  const canSubmitForm = useMemo(() => {
    if (!form || !formFields.length) {
      return false;
    }

    return formFields.every((field) => {
      if (!field.required) {
        return true;
      }

      return normalizeText(formValues[field.id]).length > 0;
    });
  }, [form, formFields, formValues]);

  return (
    <section
      className="client-feature-panel"
      data-ui="legacy-client-feature"
      data-client-view={clientPage.view || "unknown"}
    >
      <header className="client-feature-header">
        <h1>{clientPage.title || "Feature"}</h1>
        {clientPage.subtitle ? <p>{clientPage.subtitle}</p> : null}
      </header>

      <nav className="client-nav">
        {(clientPage.navigation || []).map((item) => (
          <a
            key={item.id}
            className={`client-nav-link${isPathActive(item.path, runtimeData.route) ? " is-active" : ""}`}
            href={item.path}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {Array.isArray(clientPage.cards) && clientPage.cards.length ? (
        <section className="client-card-grid">
          {clientPage.cards.map((card, index) => (
            <article key={`card-${String(index)}`} className="client-card-item">
              <strong>{card.title}</strong>
              <p>{card.subtitle}</p>
            </article>
          ))}
        </section>
      ) : null}

      {Array.isArray(clientPage.details?.sections) && clientPage.details?.sections.length ? (
        <section className="client-details">
          {clientPage.details.sections.map((item) => (
            <div key={`${item.label}-${item.value}`} className="client-details-row">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </section>
      ) : null}

      {table ? (
        <>
          {clientPage.filterPlaceholder ? (
            <div className="client-toolbar">
              <input
                id="client-list-filter"
                type="search"
                placeholder={clientPage.filterPlaceholder}
                aria-label="Client feature filter"
                value={table.search}
                onChange={(event) => {
                  table.setSearch(event.target.value);
                  table.setPage(1);
                }}
              />
            </div>
          ) : null}
          <table className="client-table">
            <thead>
              <tr>
                {table.columns.map((column) => (
                  <th key={column.key}>
                    {column.sortable ? (
                      <button
                        className="client-sort-link"
                        type="button"
                        data-client-sort-key={column.key}
                        onClick={() => {
                          table.handleSort(column.key);
                          table.setPage(1);
                        }}
                      >
                        {column.label}
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody id="client-list-rows">
              {table.pagedRows.map((row) => {
                const normalized = row as Record<string, unknown>;
                return (
                  <tr key={String(normalized.id || Math.random())} data-client-row-id={String(normalized.id || "")}> 
                    {table.columns.map((column) => {
                      if (column.key === "actions") {
                        return (
                          <td key={column.key}>
                            <div className="client-table-actions-cell">
                              {renderActions(normalized.actions, "admin-table-action")}
                            </div>
                          </td>
                        );
                      }

                      if (column.link) {
                        const pathValue = String(normalized[`${column.key}Path`] || "");
                        if (pathValue) {
                          return (
                            <td key={column.key}>
                              <a className="admin-cell-link" href={pathValue}>
                                {String(normalized[column.key] || "")}
                              </a>
                            </td>
                          );
                        }
                      }

                      if (column.badge) {
                        const value = String(normalized[column.key] || "");
                        const normalizedBadge = normalizeText(value);
                        const positiveTokens = ["open", "active", "approved", "available", "yes", "in progress", "started"];
                        const negativeTokens = ["full", "on hold", "ended", "pending", "no", "closed"];
                        const badgeClass = positiveTokens.includes(normalizedBadge)
                          ? " is-positive"
                          : negativeTokens.includes(normalizedBadge)
                            ? " is-negative"
                            : "";

                        return (
                          <td key={column.key}>
                            <span className={`client-status-badge${badgeClass}`}>{value}</span>
                          </td>
                        );
                      }

                      return <td key={column.key}>{String(normalized[column.key] || "")}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <nav className="employee-pagination" id="client-list-pagination" aria-label="Client list pages">
            <button
              type="button"
              className="pager-btn"
              data-client-page-nav="first"
              disabled={table.currentPage <= 1}
              onClick={() => table.setPage(1)}
            >
              «
            </button>
            <button
              type="button"
              className="pager-btn"
              data-client-page-nav="prev"
              disabled={table.currentPage <= 1}
              onClick={() => table.setPage(Math.max(1, table.currentPage - 1))}
            >
              ‹
            </button>
            {Array.from({ length: table.totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={`client-page-${String(pageNumber)}`}
                type="button"
                className={`pager-btn${pageNumber === table.currentPage ? " is-current" : ""}`}
                data-client-page={String(pageNumber)}
                onClick={() => table.setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              className="pager-btn"
              data-client-page-nav="next"
              disabled={table.currentPage >= table.totalPages}
              onClick={() => table.setPage(Math.min(table.totalPages, table.currentPage + 1))}
            >
              ›
            </button>
            <button
              type="button"
              className="pager-btn"
              data-client-page-nav="last"
              disabled={table.currentPage >= table.totalPages}
              onClick={() => table.setPage(table.totalPages)}
            >
              »
            </button>
          </nav>
        </>
      ) : null}

      {form ? (
        <form
          id={formId}
          className="client-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!canSubmitForm) {
              return;
            }
            setFormFeedbackVisible(true);
          }}
        >
          {formFields.map((field) => {
            const value = formValues[field.id] || "";

            if (field.type === "textarea") {
              return (
                <label key={field.id} className="client-form-field">
                  <span>
                    {field.label}
                    {field.required ? <span className="text-danger">*</span> : null}
                  </span>
                  <textarea
                    id={field.id}
                    value={value}
                    onChange={(event) => {
                      setFormValues((current) => ({ ...current, [field.id]: event.target.value }));
                      setFormFeedbackVisible(false);
                    }}
                  ></textarea>
                </label>
              );
            }

            if (field.type === "select") {
              return (
                <label key={field.id} className="client-form-field">
                  <span>
                    {field.label}
                    {field.required ? <span className="text-danger">*</span> : null}
                  </span>
                  <select
                    id={field.id}
                    value={value}
                    onChange={(event) => {
                      setFormValues((current) => ({ ...current, [field.id]: event.target.value }));
                      setFormFeedbackVisible(false);
                    }}
                  >
                    {(field.options || []).map((option: { value: string; label: string }) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            return (
              <label key={field.id} className="client-form-field">
                <span>
                  {field.label}
                  {field.required ? <span className="text-danger">*</span> : null}
                </span>
                <input
                  id={field.id}
                  type={field.type || "text"}
                  value={value}
                  onChange={(event) => {
                    setFormValues((current) => ({ ...current, [field.id]: event.target.value }));
                    setFormFeedbackVisible(false);
                  }}
                />
              </label>
            );
          })}

          <div className="client-form-actions">
            <button id={`${formId}-save`} type="submit" className="btn-primary" disabled={!canSubmitForm}>
              {form.saveLabel || "Save"}
            </button>
            {form.cancelPath ? (
              <a className="btn-secondary" href={form.cancelPath}>
                Cancel
              </a>
            ) : null}
          </div>
          <div id={`${formId}-feedback`} className="profile-feedback" hidden={!formFeedbackVisible}>
            Information saved.
          </div>
        </form>
      ) : null}
    </section>
  );
}

export function AdminView({ runtimeData }: { runtimeData: RuntimeData }) {
  const adminPage = runtimeData.adminPage as
    | {
        view?: string;
        title?: string;
        subtitle?: string;
        navigation?: Array<{ id: string; label: string; path: string }>;
        breadcrumbs?: Array<{ label: string; path?: string }>;
        cards?: Array<{ id: string; title: string; subtitle: string; path: string; icon?: string }>;
        filterPlaceholder?: string;
        primaryAction?: { label: string; path?: string; id?: string };
        table?: RuntimeTableModel;
        form?: RuntimeFormModel;
        donationsTable?: { columns?: Array<{ label: string }>; rows?: Array<Record<string, string>> };
        refund?: { message?: string; failedMessage?: string; actionLabel?: string; cancelPath?: string };
      }
    | undefined;

  if (!adminPage) {
    return null;
  }

  const table = adminPage.table
    ? useInteractiveTable({
        table: adminPage.table
      })
    : null;

  const form = adminPage.form;
  const formFields: RuntimeFormField[] = Array.isArray(form?.fields) ? form.fields : [];
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of formFields) {
      initial[field.id] = field.value || "";
    }
    return initial;
  });
  const [formInitialValues] = useState(formValues);
  const [formFeedback, setFormFeedback] = useState<string>("");

  const [refundMessage, setRefundMessage] = useState(String(adminPage.refund?.message || ""));

  const formDirty = useMemo(() => {
    return Object.keys(formValues).some((key) => formValues[key] !== formInitialValues[key]);
  }, [formInitialValues, formValues]);

  const requiredFieldsValid = useMemo(() => {
    if (!form || !formFields.length) {
      return false;
    }

    return formFields.every((field) => {
      if (!field.required) {
        return true;
      }
      return normalizeText(formValues[field.id]).length > 0;
    });
  }, [form, formFields, formValues]);

  const formSaveEnabled = Boolean(form && formDirty && requiredFieldsValid);

  return (
    <section className="admin-panel" data-ui="legacy-admin-page" data-admin-view={adminPage.view || "unknown"}>
      <header className="admin-header">
        <h1>{adminPage.title || "Administration"}</h1>
        {adminPage.subtitle ? <p className="admin-subtitle">{adminPage.subtitle}</p> : null}
        <div className="admin-breadcrumbs">
          {(adminPage.breadcrumbs || []).map((item, index) => (
            <span key={`crumb-${String(index)}`}>
              {item.path ? <a href={item.path}>{item.label}</a> : <span>{item.label}</span>}
              {index < (adminPage.breadcrumbs || []).length - 1 ? (
                <span className="admin-breadcrumb-sep">→</span>
              ) : null}
            </span>
          ))}
        </div>
      </header>

      <nav className="admin-nav">
        {(adminPage.navigation || []).map((item) => (
          <a
            key={item.id}
            className={`admin-nav-link${isPathActive(item.path, runtimeData.route) ? " is-active" : ""}`}
            href={item.path}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {Array.isArray(adminPage.cards) && adminPage.cards.length ? (
        <section className="admin-card-grid">
          {adminPage.cards.map((card) => (
            <a key={card.id} className="admin-card-link" href={card.path || "#"}>
              <span className="admin-card-icon" aria-hidden="true">
                {card.icon || "+"}
              </span>
              <strong>{card.title}</strong>
              <p>{card.subtitle}</p>
            </a>
          ))}
        </section>
      ) : null}

      {table ? (
        <>
          {adminPage.filterPlaceholder ? (
            <div className="admin-toolbar">
              <input
                id="admin-list-filter"
                type="search"
                placeholder={adminPage.filterPlaceholder}
                aria-label="Admin filter"
                value={table.search}
                onChange={(event) => {
                  table.setSearch(event.target.value);
                  table.setPage(1);
                }}
              />
            </div>
          ) : null}

          <div className="admin-table-actions">
            {adminPage.primaryAction ? (
              adminPage.primaryAction.path ? (
                <a className="btn-primary" href={adminPage.primaryAction.path}>
                  {adminPage.primaryAction.label || "Action"}
                </a>
              ) : (
                <button className="btn-primary" type="button" id={adminPage.primaryAction.id || "admin-primary-action"}>
                  {adminPage.primaryAction.label || "Action"}
                </button>
              )
            ) : null}
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                {table.columns.map((column) => (
                  <th key={column.key}>
                    {column.sortable ? (
                      <button
                        className="admin-sort-link"
                        type="button"
                        data-admin-sort-key={column.key}
                        onClick={() => {
                          table.handleSort(column.key);
                          table.setPage(1);
                        }}
                      >
                        {column.label}
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody id="admin-list-rows">
              {table.pagedRows.map((row) => {
                const normalized = row as Record<string, unknown>;
                return (
                  <tr key={String(normalized.id || Math.random())} data-admin-row-id={String(normalized.id || "")}> 
                    {table.columns.map((column) => {
                      if (column.key === "actions") {
                        return (
                          <td key={column.key}>
                            <div className="admin-table-actions-cell">
                              {renderActions(normalized.actions, "admin-table-action")}
                            </div>
                          </td>
                        );
                      }

                      if (column.colorSwatch) {
                        return (
                          <td key={column.key}>
                            <span
                              className="admin-color-swatch"
                              style={{ background: String(normalized[column.key] || "#ffffff") }}
                            ></span>
                            <span>{String(normalized[column.key] || "")}</span>
                          </td>
                        );
                      }

                      if (column.badge) {
                        const value = String(normalized[column.key] || "");
                        const token = normalizeText(value);
                        const badgeClass = token === "yes" ? " is-yes" : token === "no" ? " is-no" : "";
                        return (
                          <td key={column.key}>
                            <span className={`admin-status-badge${badgeClass}`}>{value}</span>
                          </td>
                        );
                      }

                      if (column.link) {
                        const pathValue = String(normalized[`${column.key}Path`] || "");
                        if (pathValue) {
                          return (
                            <td key={column.key}>
                              <a className="admin-cell-link" href={pathValue}>
                                {String(normalized[column.key] || "")}
                              </a>
                            </td>
                          );
                        }
                      }

                      return <td key={column.key}>{String(normalized[column.key] || "")}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <nav className="employee-pagination" id="admin-list-pagination" aria-label="Admin list pages">
            <button
              type="button"
              className="pager-btn"
              data-admin-page-nav="first"
              disabled={table.currentPage <= 1}
              onClick={() => table.setPage(1)}
            >
              «
            </button>
            <button
              type="button"
              className="pager-btn"
              data-admin-page-nav="prev"
              disabled={table.currentPage <= 1}
              onClick={() => table.setPage(Math.max(1, table.currentPage - 1))}
            >
              ‹
            </button>
            {Array.from({ length: table.totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={`admin-page-${String(pageNumber)}`}
                type="button"
                className={`pager-btn${pageNumber === table.currentPage ? " is-current" : ""}`}
                data-admin-page={String(pageNumber)}
                onClick={() => table.setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              className="pager-btn"
              data-admin-page-nav="next"
              disabled={table.currentPage >= table.totalPages}
              onClick={() => table.setPage(Math.min(table.totalPages, table.currentPage + 1))}
            >
              ›
            </button>
            <button
              type="button"
              className="pager-btn"
              data-admin-page-nav="last"
              disabled={table.currentPage >= table.totalPages}
              onClick={() => table.setPage(table.totalPages)}
            >
              »
            </button>
          </nav>
        </>
      ) : null}

      {form ? (
        <form
          id="admin-form"
          className="admin-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!formSaveEnabled) {
              return;
            }
            setFormFeedback("Information saved.");
          }}
        >
          {formFields.map((field) => {
            const value = formValues[field.id] || "";

            if (field.type === "checkbox") {
              return (
                <label key={field.id} className="admin-checkbox-row">
                  <input
                    type="checkbox"
                    id={field.id}
                    checked={value === "true"}
                    onChange={(event) => {
                      setFormValues((current) => ({
                        ...current,
                        [field.id]: event.target.checked ? "true" : "false"
                      }));
                      setFormFeedback("");
                    }}
                  />
                  <span>{field.label}</span>
                </label>
              );
            }

            if (field.type === "textarea") {
              return (
                <label key={field.id} className="admin-form-field">
                  <span>
                    {field.label}
                    {field.required ? <span className="text-danger">*</span> : null}
                  </span>
                  <textarea
                    id={field.id}
                    value={value}
                    onChange={(event) => {
                      setFormValues((current) => ({
                        ...current,
                        [field.id]: event.target.value
                      }));
                      setFormFeedback("");
                    }}
                  ></textarea>
                </label>
              );
            }

            if (field.type === "select") {
              return (
                <label key={field.id} className="admin-form-field">
                  <span>
                    {field.label}
                    {field.required ? <span className="text-danger">*</span> : null}
                  </span>
                  <select
                    id={field.id}
                    value={value}
                    onChange={(event) => {
                      setFormValues((current) => ({
                        ...current,
                        [field.id]: event.target.value
                      }));
                      setFormFeedback("");
                    }}
                  >
                    {(field.options || []).map((option: { value: string; label: string }) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            return (
              <label key={field.id} className="admin-form-field">
                <span>
                  {field.label}
                  {field.required ? <span className="text-danger">*</span> : null}
                </span>
                <input
                  id={field.id}
                  type={field.type || "text"}
                  value={value}
                  onChange={(event) => {
                    setFormValues((current) => ({
                      ...current,
                      [field.id]: event.target.value
                    }));
                    setFormFeedback("");
                  }}
                />
              </label>
            );
          })}

          <div className="admin-form-actions">
            <button id="admin-form-save" type="submit" className="btn-primary" disabled={!formSaveEnabled}>
              {form.saveLabel || "Save"}
            </button>
            {form.dangerActionLabel ? (
              <button
                id="admin-form-danger"
                type="button"
                className="btn-secondary admin-danger-btn"
                onClick={() => setFormFeedback("Item deleted.")}
              >
                {form.dangerActionLabel}
              </button>
            ) : null}
            {form.cancelPath ? (
              <a className="btn-secondary" href={form.cancelPath}>
                Cancel
              </a>
            ) : null}
          </div>
          <div id="admin-form-feedback" className="profile-feedback" hidden={!formFeedback}>
            {formFeedback}
          </div>
        </form>
      ) : null}

      {adminPage.donationsTable ? (
        <table className="admin-table admin-table--compact">
          <thead>
            <tr>
              {(adminPage.donationsTable.columns || []).map((column, index) => (
                <th key={`don-col-${String(index)}`}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(adminPage.donationsTable.rows || []).map((row, index) => (
              <tr key={`don-row-${String(index)}`}>
                <td>{row.fullName}</td>
                <td>{row.amount}</td>
                <td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {adminPage.refund ? (
        <section className="admin-refund-box">
          <p id="admin-refund-message">{refundMessage}</p>
          <div className="admin-form-actions">
            <button
              id="admin-refund-action"
              type="button"
              className="btn-primary"
              onClick={() => {
                setRefundMessage(String(adminPage.refund?.failedMessage || "Refund failed."));
              }}
            >
              {adminPage.refund.actionLabel || "Refund"}
            </button>
            {adminPage.refund.cancelPath ? (
              <a className="btn-secondary" href={adminPage.refund.cancelPath}>
                Cancel
              </a>
            ) : null}
          </div>
        </section>
      ) : null}
    </section>
  );
}
