import { escapeHtml } from "../../runtime/runtime-shared.js";
import { renderAdminActionButtons } from "../admin/render.js";

export function setupClientFeatureInteractions(root, runtimeData) {
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

