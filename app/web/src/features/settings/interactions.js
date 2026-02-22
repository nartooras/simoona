export function setupSettingsPageInteractions(root, runtimeData) {
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

