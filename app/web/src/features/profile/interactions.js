export function setupProfilePageInteractions(root, runtimeData) {
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

