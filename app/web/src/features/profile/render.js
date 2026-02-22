import { escapeHtml } from "../../runtime/runtime-shared.js";

export function renderProfilePage(runtimeData) {
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

