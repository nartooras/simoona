import { escapeHtml } from "./runtime-shared.js";
import { renderAdminActionButtons } from "./runtime-views.js";

let root = null;
let runtimeData = null;

function setupEmployeeListInteractions() {
  const employeeRowsContainer = root.querySelector("#employee-rows");
  const filterInput = root.querySelector("#employee-filter");
  const pagination = root.querySelector("#employee-pagination");

  if (!employeeRowsContainer || !filterInput || !pagination) {
    return;
  }

  const employeeRowsContainerElement = employeeRowsContainer;
  const filterInputElement = filterInput;
  const paginationElement = pagination;

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

    paginationElement.innerHTML = `
      <button type="button" class="pager-btn" data-page-nav="first" ${prevDisabled ? "disabled" : ""}>«</button>
      <button type="button" class="pager-btn" data-page-nav="prev" ${prevDisabled ? "disabled" : ""}>‹</button>
      ${pageButtons.join("")}
      <button type="button" class="pager-btn" data-page-nav="next" ${nextDisabled ? "disabled" : ""}>›</button>
      <button type="button" class="pager-btn" data-page-nav="last" ${nextDisabled ? "disabled" : ""}>»</button>
    `;

    for (const pageButton of paginationElement.querySelectorAll("[data-page]")) {
      pageButton.addEventListener("click", () => {
        state.page = Number(pageButton.getAttribute("data-page") || "1");
        render();
      });
    }

    const firstButton = paginationElement.querySelector('[data-page-nav="first"]');
    const prevButton = paginationElement.querySelector('[data-page-nav="prev"]');
    const nextButton = paginationElement.querySelector('[data-page-nav="next"]');
    const lastButton = paginationElement.querySelector('[data-page-nav="last"]');

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

    employeeRowsContainerElement.innerHTML = pagedRows
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

    for (const rowNode of employeeRowsContainerElement.querySelectorAll("tr[data-row-id]")) {
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

  filterInputElement.addEventListener("input", () => {
    state.search = filterInputElement.value;
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
    const rowsContainerElement = rowsContainer;
    const paginationElement = pagination;
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

      paginationElement.innerHTML = `
        <button type="button" class="pager-btn" data-client-page-nav="first" ${prevDisabled ? "disabled" : ""}>«</button>
        <button type="button" class="pager-btn" data-client-page-nav="prev" ${prevDisabled ? "disabled" : ""}>‹</button>
        ${pageButtons.join("")}
        <button type="button" class="pager-btn" data-client-page-nav="next" ${nextDisabled ? "disabled" : ""}>›</button>
        <button type="button" class="pager-btn" data-client-page-nav="last" ${nextDisabled ? "disabled" : ""}>»</button>
      `;

      for (const pageButton of paginationElement.querySelectorAll("[data-client-page]")) {
        pageButton.addEventListener("click", () => {
          state.page = Number(pageButton.getAttribute("data-client-page") || "1");
          render();
        });
      }

      paginationElement.querySelector('[data-client-page-nav="first"]')?.addEventListener("click", () => {
        state.page = 1;
        render();
      });
      paginationElement.querySelector('[data-client-page-nav="prev"]')?.addEventListener("click", () => {
        state.page = Math.max(1, state.page - 1);
        render();
      });
      paginationElement.querySelector('[data-client-page-nav="next"]')?.addEventListener("click", () => {
        state.page = Math.min(totalPages, state.page + 1);
        render();
      });
      paginationElement.querySelector('[data-client-page-nav="last"]')?.addEventListener("click", () => {
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
      rowsContainerElement.innerHTML = pagedRows
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
    const rowsContainerElement = rowsContainer;
    const paginationElement = pagination;
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

      paginationElement.innerHTML = `
        <button type="button" class="pager-btn" data-admin-page-nav="first" ${prevDisabled ? "disabled" : ""}>«</button>
        <button type="button" class="pager-btn" data-admin-page-nav="prev" ${prevDisabled ? "disabled" : ""}>‹</button>
        ${pageButtons.join("")}
        <button type="button" class="pager-btn" data-admin-page-nav="next" ${nextDisabled ? "disabled" : ""}>›</button>
        <button type="button" class="pager-btn" data-admin-page-nav="last" ${nextDisabled ? "disabled" : ""}>»</button>
      `;

      for (const pageButton of paginationElement.querySelectorAll("[data-admin-page]")) {
        pageButton.addEventListener("click", () => {
          state.page = Number(pageButton.getAttribute("data-admin-page") || "1");
          render();
        });
      }

      paginationElement.querySelector('[data-admin-page-nav="first"]')?.addEventListener("click", () => {
        state.page = 1;
        render();
      });
      paginationElement.querySelector('[data-admin-page-nav="prev"]')?.addEventListener("click", () => {
        state.page = Math.max(1, state.page - 1);
        render();
      });
      paginationElement.querySelector('[data-admin-page-nav="next"]')?.addEventListener("click", () => {
        state.page = Math.min(totalPages, state.page + 1);
        render();
      });
      paginationElement.querySelector('[data-admin-page-nav="last"]')?.addEventListener("click", () => {
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
      rowsContainerElement.innerHTML = pagedRows
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

export function attachRuntimeInteractions(context) {
  root = context.root;
  runtimeData = context.runtimeData;

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

  setupEmployeeListInteractions();
  setupProfilePageInteractions();
  setupSettingsPageInteractions();
  setupAuthUtilityInteractions();
  setupClientFeatureInteractions();
  setupAdminPageInteractions();
}
