export function setupAuthUtilityInteractions(root, runtimeData) {
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

