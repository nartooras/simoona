const root = document.getElementById("app");
const runtimeDataElement = document.getElementById("simoona-runtime-data");

if (!root || !runtimeDataElement) {
  throw new Error("Missing runtime root elements.");
}

let runtimeData = {
  route: "/",
  title: "Simoona",
  status: "ready",
  navItems: [],
  auth: {
    requiresLogin: false,
    redirectPath: "/"
  },
  routeMatch: {
    routeKey: "public.home",
    normalizedPath: "/",
    isKnownLegacyRoute: true
  },
  tenantRoute: {
    tenantId: "default",
    normalizedPath: "/"
  },
  motion: {
    pageTransitionMs: 160,
    microInteractionMs: 120,
    reducedMotionEnabled: false
  }
};

try {
  const parsed = JSON.parse(runtimeDataElement.textContent || "{}");
  runtimeData = { ...runtimeData, ...parsed };
} catch (error) {
  console.error("[web-runtime] Failed to parse runtime payload:", error);
}

const navLinks = (runtimeData.navItems || [])
  .map((item) => `<a href="${item.path}" data-nav="${item.id}">${item.title}</a>`)
  .join(" · ");

root.innerHTML = `
  <main data-app="simoona-modern-web-runtime">
    <h1>${runtimeData.title}</h1>
    <p><strong>Route:</strong> ${runtimeData.route}</p>
    <p><strong>Status:</strong> ${runtimeData.status}</p>
    <p><strong>Route key:</strong> ${runtimeData.routeMatch?.routeKey || "unknown"}</p>
    <p><strong>Tenant:</strong> ${runtimeData.tenantRoute?.tenantId || "default"}</p>
    <p><strong>Auth requires login:</strong> ${String(runtimeData.auth?.requiresLogin)}</p>
    <p><strong>Navigation:</strong> ${navLinks || "none"}</p>
  </main>
`;
