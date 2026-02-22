import { escapeHtml } from "../../runtime/runtime-shared.js";

export function renderEmployeeList(runtimeData) {
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

