#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, "..");

const mode = process.argv[2] ?? "dev";
const port = Number(
  process.env.WEB_RUNTIME_PORT ?? (mode === "preview" ? "4173" : "5173")
);

const requiredFiles = [
  path.join(webRoot, "index.html"),
  path.join(webRoot, "vite.config.ts"),
  path.join(webRoot, "src/main.tsx"),
  path.join(webRoot, "src/shell/auth-boundary.ts"),
  path.join(webRoot, "src/shell/legacy-route-catchup.ts"),
  path.join(webRoot, "src/shell/tenant-route-container.ts"),
  path.join(webRoot, "src/shell/top-level-layout.ts")
];

for (const filePath of requiredFiles) {
  if (!fs.existsSync(filePath)) {
    console.error(`[web-runtime] Missing required file: ${filePath}`);
    process.exit(1);
  }
}

if (mode === "build") {
  console.log("[web-runtime] Build/runtime contract checks passed.");
  process.exit(0);
}

const { resolveAuthBoundary } = await import(path.join(webRoot, "src/shell/auth-boundary.ts"));
const { resolveLegacyRouteCatchup } = await import(
  path.join(webRoot, "src/shell/legacy-route-catchup.ts")
);
const { resolveTenantRoute } = await import(
  path.join(webRoot, "src/shell/tenant-route-container.ts")
);
const { createTopLevelLayoutState } = await import(
  path.join(webRoot, "src/shell/top-level-layout.ts")
);

const indexTemplate = fs.readFileSync(path.join(webRoot, "index.html"), "utf8");
const mainModule = fs.readFileSync(path.join(webRoot, "src/main.tsx"), "utf8");

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function buildWallFeedPayload(pathname) {
  const isWallFeedRoute =
    pathname.toLowerCase().includes("/wall/feed") ||
    pathname.toLowerCase().endsWith("/wall") ||
    pathname.toLowerCase().endsWith("/wall/all");

  if (!isWallFeedRoute) {
    return null;
  }

  return {
    sections: {
      leftNav: {
        groups: [
          {
            title: "Walls",
            items: ["Main feed", "My walls", "Following", "Discover walls"]
          },
          {
            title: "Activities",
            items: ["Kudos", "Events", "Birthdays", "Lotteries"]
          },
          {
            title: "Company",
            items: ["Users", "Organizational chart", "Offices"]
          }
        ]
      },
      rightSidebar: [
        { title: "Upcoming events", items: ["Monthly standup", "Release retro", "Town hall"] },
        { title: "Kudos leaderboard", items: ["Anna", "Mantas", "Greta"] },
        { title: "Birthdays", items: ["Jonas", "Ieva"] }
      ]
    },
    posts: [
      {
        id: "post-1",
        author: "Asta V.",
        timestamp: "Today 08:42",
        content:
          "Wall/feed recovery baseline is now tied to runtime evidence and visual snapshots for desktop, tablet, and mobile.",
        likeCount: 4,
        commentCount: 2
      },
      {
        id: "post-2",
        author: "Mindaugas P.",
        timestamp: "Today 07:15",
        content:
          "This card intentionally mirrors legacy density: compact meta rows, subtle dividers, and inline interaction controls.",
        likeCount: 2,
        commentCount: 1
      }
    ]
  };
}

function renderIndexForRoute(pathname) {
  const isAuthenticated = pathname !== "/account/login";
  const layout = createTopLevelLayoutState(false);
  const auth = resolveAuthBoundary(isAuthenticated);
  const routeMatch = resolveLegacyRouteCatchup(pathname);
  const tenantRoute = resolveTenantRoute(pathname, "default");
  const wallFeed = buildWallFeedPayload(pathname);
  const runtimePayload = {
    route: pathname,
    title: layout.title,
    status: routeMatch.isKnownLegacyRoute ? "ready" : "not_found",
    navItems: layout.navItems,
    auth,
    routeMatch,
    tenantRoute,
    motion: layout.motion,
    wallFeed
  };

  return indexTemplate.replace(
    '<script id="simoona-runtime-data" type="application/json"></script>',
    `<script id="simoona-runtime-data" type="application/json">${JSON.stringify(
      runtimePayload
    )}</script>`
  );
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://127.0.0.1:${String(port)}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === "/healthz" || pathname === "/readyz") {
    sendJson(response, 200, {
      status: "ok",
      service: "simoona-web-runtime",
      checkedAtUtc: new Date().toISOString()
    });
    return;
  }

  if (pathname === "/src/main.tsx") {
    response.writeHead(200, {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "no-store"
    });
    response.end(mainModule);
    return;
  }

  if (resolveLegacyRouteCatchup(pathname).isKnownLegacyRoute || pathname === "/") {
    response.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store"
    });
    response.end(renderIndexForRoute(pathname));
    return;
  }

  response.writeHead(404, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end(renderIndexForRoute(pathname));
});

server.listen(port, "127.0.0.1", () => {
  console.log(`[web-runtime] ${mode} server listening at http://127.0.0.1:${String(port)}`);
});

const shutdown = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
