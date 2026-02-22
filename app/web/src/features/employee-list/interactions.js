import { escapeHtml } from "../../runtime/runtime-shared.js";

export function setupEmployeeListInteractions(root, runtimeData) {
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

