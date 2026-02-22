import { escapeHtml } from "../../runtime/runtime-shared.js";

export function renderFallback(runtimeData) {
  return `
    <section class="route-placeholder">
      <h2>${escapeHtml(runtimeData.routeMatch?.routeKey || "Route")}</h2>
      <p>This route is recognized and mapped, but detailed UI parity is still in progress.</p>
      <p>Current route: <code>${escapeHtml(runtimeData.route)}</code></p>
    </section>
  `;
}
