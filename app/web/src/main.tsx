import {
  employeeRows,
  legacyLeftMenuGroups,
  normalizePath,
  wallFeedPosts
} from "./runtime/runtime-shared.js";
import { legacyRuntimeStyles } from "./runtime/legacy-runtime-styles.js";
import { renderRuntimeShell } from "./runtime/runtime-views.js";
import { attachRuntimeInteractions } from "./runtime/runtime-interactions.js";

const root = document.getElementById("app");
const runtimeDataElement = document.getElementById("simoona-runtime-data");

if (!(root instanceof HTMLElement) || !(runtimeDataElement instanceof HTMLScriptElement)) {
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
  },
  shell: {
    userName: "User",
    notificationCount: 0,
    unreadMessages: 0
  },
  leftMenu: {
    groups: []
  },
  wallFeed: null,
  employeeList: null,
  profilePage: null,
  settingsPage: null,
  clientFeaturePage: null,
  adminPage: null,
  authUtilityPage: null,
  shellMode: "app"
};

try {
  const parsed = JSON.parse(runtimeDataElement.textContent || "{}");
  runtimeData = { ...runtimeData, ...parsed };
} catch (error) {
  console.error("[web-runtime] Failed to parse runtime payload:", error);
}

const defaultLeftMenuGroups = legacyLeftMenuGroups;
const defaultWallFeedPosts = wallFeedPosts;
const defaultEmployeeRows = employeeRows;

function ensureClientSideRuntimePayload() {
  const browserPath = normalizePath(window.location.pathname || runtimeData.route || "/");
  runtimeData.route = browserPath === "/" ? "/default/Wall/Feed" : browserPath;

  if (!Array.isArray(runtimeData.leftMenu?.groups) || runtimeData.leftMenu.groups.length === 0) {
    runtimeData.leftMenu = {
      groups: defaultLeftMenuGroups
    };
  }

  if (!Array.isArray(runtimeData.navItems) || runtimeData.navItems.length === 0) {
    runtimeData.navItems = [
      { id: "home", title: "Home", path: "/default/Wall/Feed" },
      { id: "profile", title: "Profile", path: "/default/Profiles/1" }
    ];
  }

  const normalizedLower = runtimeData.route.toLowerCase();
  const hasAnyExplicitView =
    runtimeData.wallFeed ||
    runtimeData.employeeList ||
    runtimeData.profilePage ||
    runtimeData.settingsPage ||
    runtimeData.clientFeaturePage ||
    runtimeData.adminPage ||
    runtimeData.authUtilityPage;

  if (hasAnyExplicitView) {
    return;
  }

  if (normalizedLower.includes("/employee")) {
    runtimeData.employeeList = {
      title: "Employee List",
      pageSize: 10,
      rows: defaultEmployeeRows
    };
    runtimeData.routeMatch = {
      routeKey: "tenant.employee.list",
      normalizedPath: runtimeData.route,
      isKnownLegacyRoute: true
    };
    return;
  }

  if (
    normalizedLower === "/" ||
    normalizedLower.includes("/wall/feed") ||
    normalizedLower.endsWith("/wall") ||
    normalizedLower.endsWith("/wall/all")
  ) {
    runtimeData.wallFeed = {
      posts: defaultWallFeedPosts,
      rightSidebar: {
        quickActions: [
          { id: "create-post", symbol: "+", title: "Create post" },
          { id: "apps", symbol: "▦", title: "Apps" },
          { id: "basket", symbol: "🛒", title: "Kudos basket" }
        ],
        kudosFeed: [
          { score: "+2", date: "02-18", fullName: "Vardenis Pavardenis", reason: "Saldainiai" },
          { score: "+1", date: "02-17", fullName: "Vardenis Pavardenis 2", reason: "Sokoladas" },
          { score: "+3", date: "02-17", fullName: "Vardenis Pavardenis 3", reason: "Lauktuves" }
        ],
        widgets: [
          {
            title: "Upcoming events",
            items: ["FPV dronu surinkimo workshop'as Nr1", "ISTQB Advanced hub", "Vaiku Svente 2026"]
          },
          {
            title: "Most Kudos in 3 months",
            items: ["Vardenis Pavardenis (459)", "Jona Jonaite (195)"]
          }
        ]
      }
    };
    runtimeData.routeMatch = {
      routeKey: "tenant.wall.feed",
      normalizedPath: runtimeData.route,
      isKnownLegacyRoute: true
    };
    return;
  }

  if (
    normalizedLower === "/login" ||
    normalizedLower.endsWith("/login") ||
    normalizedLower.endsWith("/register") ||
    normalizedLower.endsWith("/forgot") ||
    normalizedLower.endsWith("/reset")
  ) {
    runtimeData.shellMode = "auth";
    runtimeData.authUtilityPage = {
      view: "tenant-login",
      title: "Sign in",
      subtitle: "Use your account to continue",
      form: {
        id: "auth-tenant-login-form",
        submitLabel: "Login",
        submitSuccessMessage: "Login validated.",
        fields: [
          { id: "email", label: "Email", type: "email", placeholder: "Enter email address", required: true, value: "" },
          { id: "password", label: "Password", type: "password", placeholder: "Enter password", required: true, value: "" }
        ]
      },
      links: [{ label: "Forgot password", path: "/default/Forgot", kind: "link" }]
    };
    runtimeData.routeMatch = {
      routeKey: "tenant.login",
      normalizedPath: runtimeData.route,
      isKnownLegacyRoute: true
    };
    return;
  }

  runtimeData.wallFeed = {
    posts: defaultWallFeedPosts,
    rightSidebar: {
      quickActions: [],
      kudosFeed: [],
      widgets: []
    }
  };
  runtimeData.routeMatch = {
    routeKey: "tenant.wall.feed",
    normalizedPath: runtimeData.route,
    isKnownLegacyRoute: true
  };
}

ensureClientSideRuntimePayload();

const leftMenuGroups = Array.isArray(runtimeData.leftMenu?.groups) &&
  runtimeData.leftMenu.groups.length > 0
  ? runtimeData.leftMenu.groups
  : defaultLeftMenuGroups;

const appShellMarkup = renderRuntimeShell({
  runtimeData,
  leftMenuGroups
});

root.innerHTML = `
  <style>
${legacyRuntimeStyles}
  </style>
${appShellMarkup}
`;

attachRuntimeInteractions({ root, runtimeData });
