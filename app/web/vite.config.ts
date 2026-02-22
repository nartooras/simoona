import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type ViteDevServer, type Plugin } from "vite";
import {
  injectRuntimeDataIntoIndex,
  resolveRuntimeDataForUrl
} from "./src/app/runtime-data";

function isHtmlNavigationRequest(serverPath: string, requestHeaders: Record<string, unknown>) {
  if (
    serverPath.startsWith("/@") ||
    serverPath.startsWith("/__vite") ||
    serverPath.startsWith("/src/") ||
    serverPath.startsWith("/node_modules/")
  ) {
    return false;
  }

  if (
    /\.(?:js|mjs|cjs|css|map|json|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|txt|xml|webmanifest)$/i.test(
      serverPath
    )
  ) {
    return false;
  }

  const accept = String(requestHeaders.accept || "").toLowerCase();
  return accept.includes("text/html") || accept.includes("*/*") || accept.length === 0;
}

function runtimePayloadPlugin(): Plugin {
  const indexPath = path.resolve(__dirname, "index.html");
  const indexTemplate = fs.readFileSync(indexPath, "utf8");

  async function renderIndex(server: ViteDevServer, rawUrl: string) {
    const runtimeData = resolveRuntimeDataForUrl(rawUrl);
    const payloadIndex = injectRuntimeDataIntoIndex(indexTemplate, runtimeData);
    const transformed = await server.transformIndexHtml(rawUrl, payloadIndex);

    return {
      html: transformed,
      statusCode: runtimeData.status === "not_found" ? 404 : 200
    };
  }

  return {
    name: "simoona-runtime-payload",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const rawUrl = req.url || "/";
          const parsed = new URL(rawUrl, "http://127.0.0.1");
          const pathname = parsed.pathname;

          if (pathname === "/healthz" || pathname === "/readyz") {
            res.statusCode = 200;
            res.setHeader("content-type", "application/json; charset=utf-8");
            res.end(JSON.stringify({ status: "ok", mode: "vite-dev" }));
            return;
          }

          if (req.method !== "GET") {
            next();
            return;
          }

          if (!isHtmlNavigationRequest(pathname, req.headers as Record<string, unknown>)) {
            next();
            return;
          }

          const rendered = await renderIndex(server, rawUrl);
          res.statusCode = rendered.statusCode;
          res.setHeader("content-type", "text/html; charset=utf-8");
          res.end(rendered.html);
        } catch (error) {
          next(error as Error);
        }
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url || "/";
        const parsed = new URL(rawUrl, "http://127.0.0.1");
        if (parsed.pathname === "/healthz" || parsed.pathname === "/readyz") {
          res.statusCode = 200;
          res.setHeader("content-type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ status: "ok", mode: "vite-preview" }));
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), runtimePayloadPlugin()],
  server: {
    host: "127.0.0.1",
    port: 5173
  },
  preview: {
    host: "127.0.0.1",
    port: 4173
  }
});
