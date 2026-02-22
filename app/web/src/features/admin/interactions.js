import { escapeHtml } from "../../runtime/runtime-shared.js";
import { renderAdminActionButtons } from "./render.js";

export function setupAdminPageInteractions(root, runtimeData) {
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
