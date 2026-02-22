import { normalizePath } from "../runtime/runtime-shared";

interface MinimalRuntimeData {
  route: string;
  navItems?: Array<{ id: string; title: string; path: string }>;
  leftMenu?: { groups?: unknown[] };
  wallFeed?: unknown;
  employeeList?: unknown;
  profilePage?: unknown;
  settingsPage?: unknown;
  clientFeaturePage?: unknown;
  adminPage?: unknown;
  authUtilityPage?: unknown;
  routeMatch?: {
    routeKey?: string;
    normalizedPath?: string;
    isKnownLegacyRoute?: boolean;
  };
  shellMode?: "app" | "auth";
}

interface RuntimePayloadOptions {
  browserPath?: string;
  defaultLeftMenuGroups: unknown[];
  defaultEmployeeRows: Array<Record<string, unknown>>;
  defaultWallFeedPosts: Array<Record<string, unknown>>;
}

export function createBaseRuntimeData() {
  return {
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
}

export function createDefaultWallFeedPayload(
  defaultWallFeedPosts: Array<Record<string, unknown>>
) {
  return {
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
        { score: "+3", date: "02-17", fullName: "Vardenis Pavardenis 3", reason: "Lauktuves" },
        { score: "+5", date: "02-13", fullName: "Vardenis Pavardenis 4", reason: "Naminis tinginys" },
        { score: "+1", date: "02-13", fullName: "Vardenis Pavardenis", reason: "Sausainiai" }
      ],
      widgets: [
        {
          title: "Upcoming events",
          items: [
            "FPV dronu surinkimo workshop'as Nr1 (Leisure)",
            "ISTQB Advanced hub (Hub)",
            "Vaiku Svente 2026 (Leisure)"
          ]
        },
        {
          title: "Most Kudos in 3 months",
          items: ["Vardenis Pavardenis (459)", "Vardenis Pavardenis (250)", "Jona Jonaite (195)"]
        },
        {
          title: "Most Kudos in 12 months",
          items: [
            "Vardenis Pavardenis (741)",
            "Reda Redaitiene (719)",
            "Rytienis Pavardenis (489)"
          ]
        },
        {
          title: "Birthdays",
          items: ["Vanesa - 2026-02-18 (Wednesday)"]
        }
      ]
    }
  };
}

export function createDefaultEmployeeListPayload(
  defaultEmployeeRows: Array<Record<string, unknown>>
) {
  return {
    title: "Employee List",
    pageSize: 10,
    rows: defaultEmployeeRows
  };
}

export function createDefaultTenantLoginPayload() {
  return {
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
}

function hasAnyExplicitView(runtimeData: MinimalRuntimeData): boolean {
  return Boolean(
    runtimeData.wallFeed ||
      runtimeData.employeeList ||
      runtimeData.profilePage ||
      runtimeData.settingsPage ||
      runtimeData.clientFeaturePage ||
      runtimeData.adminPage ||
      runtimeData.authUtilityPage
  );
}

export function ensureClientRuntimePayload(
  runtimeData: MinimalRuntimeData,
  options: RuntimePayloadOptions
) {
  const browserPath = normalizePath(options.browserPath || runtimeData.route || "/");
  runtimeData.route = browserPath === "/" ? "/default/Wall/Feed" : browserPath;

  if (!Array.isArray(runtimeData.leftMenu?.groups) || runtimeData.leftMenu.groups.length === 0) {
    runtimeData.leftMenu = {
      groups: options.defaultLeftMenuGroups
    };
  }

  if (!Array.isArray(runtimeData.navItems) || runtimeData.navItems.length === 0) {
    runtimeData.navItems = [
      { id: "home", title: "Home", path: "/default/Wall/Feed" },
      { id: "profile", title: "Profile", path: "/default/Profiles/1" }
    ];
  }

  const normalizedLower = runtimeData.route.toLowerCase();

  if (hasAnyExplicitView(runtimeData)) {
    return runtimeData;
  }

  if (normalizedLower.includes("/employee")) {
    runtimeData.employeeList = createDefaultEmployeeListPayload(options.defaultEmployeeRows);
    runtimeData.routeMatch = {
      routeKey: "tenant.employee.list",
      normalizedPath: runtimeData.route,
      isKnownLegacyRoute: true
    };
    return runtimeData;
  }

  if (
    normalizedLower === "/" ||
    normalizedLower.includes("/wall/feed") ||
    normalizedLower.endsWith("/wall") ||
    normalizedLower.endsWith("/wall/all")
  ) {
    runtimeData.wallFeed = createDefaultWallFeedPayload(options.defaultWallFeedPosts);
    runtimeData.routeMatch = {
      routeKey: "tenant.wall.feed",
      normalizedPath: runtimeData.route,
      isKnownLegacyRoute: true
    };
    return runtimeData;
  }

  if (
    normalizedLower === "/login" ||
    normalizedLower.endsWith("/login") ||
    normalizedLower.endsWith("/register") ||
    normalizedLower.endsWith("/forgot") ||
    normalizedLower.endsWith("/reset")
  ) {
    runtimeData.shellMode = "auth";
    runtimeData.authUtilityPage = createDefaultTenantLoginPayload();
    runtimeData.routeMatch = {
      routeKey: "tenant.login",
      normalizedPath: runtimeData.route,
      isKnownLegacyRoute: true
    };
    return runtimeData;
  }

  runtimeData.wallFeed = {
    posts: options.defaultWallFeedPosts,
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

  return runtimeData;
}
