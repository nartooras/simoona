#!/usr/bin/env node

import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";

const parityRoot = process.cwd();
const appRoot = path.resolve(parityRoot, "..", "..");
const apiRuntimeScript = path.join(appRoot, "api", "scripts", "api-runtime-check.mjs");
const port = Number(process.env.API_RUNTIME_PORT ?? "4310");
const baseUrl = `http://127.0.0.1:${String(port)}`;
const authHeaders = { "x-legacy-user-id": "legacy-user" };

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHealthz(attempts = 40) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await request("GET", "/healthz");
      if (response.statusCode === 200) {
        return;
      }
    } catch {
      // Wait and retry while runtime starts.
    }
    await sleep(250);
  }

  throw new Error(`Timed out waiting for API runtime at ${baseUrl}`);
}

function request(method, routePath, body = undefined, headers = {}) {
  return new Promise((resolve, reject) => {
    const requestUrl = new URL(routePath, baseUrl);
    const payload = body ? JSON.stringify(body) : "";

    const req = http.request(
      requestUrl,
      {
        method,
        headers: {
          accept: "application/json",
          ...(payload
            ? {
                "content-type": "application/json",
                "content-length": Buffer.byteLength(payload)
              }
            : {}),
          ...headers
        }
      },
      (res) => {
        let raw = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          let parsedBody = {};
          try {
            parsedBody = raw ? JSON.parse(raw) : {};
          } catch {
            parsedBody = { raw };
          }
          resolve({
            statusCode: res.statusCode ?? 0,
            body: parsedBody
          });
        });
      }
    );

    req.on("error", reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runAssertions() {
  const unauthorizedWallList = await request("GET", "/Wall/List");
  assert(unauthorizedWallList.statusCode === 401, "Wall/List should require auth and return 401.");
  assert(
    unauthorizedWallList.body.errorCode === "UNAUTHORIZED",
    "Wall/List unauthorized response must include UNAUTHORIZED code."
  );

  const wallList = await request("GET", "/Wall/List", undefined, authHeaders);
  assert(wallList.statusCode === 200, "Wall/List should return 200 for authenticated requests.");
  assert(wallList.body.compatibility === "Wall/List", "Wall/List compatibility marker mismatch.");
  assert(Array.isArray(wallList.body.items) && wallList.body.items.length >= 1, "Wall/List should return wall items.");

  const postsValidation = await request("GET", "/Wall/Posts", undefined, authHeaders);
  assert(postsValidation.statusCode === 400, "Wall/Posts without wallId should return 400.");
  assert(
    postsValidation.body.errorCode === "VALIDATION_ERROR",
    "Wall/Posts validation error code mismatch."
  );

  const wallPosts = await request("GET", "/Wall/Posts?wallId=wall-1", undefined, authHeaders);
  assert(wallPosts.statusCode === 200, "Wall/Posts should return 200 for valid wallId.");
  assert(wallPosts.body.compatibility === "Wall/Posts", "Wall/Posts compatibility marker mismatch.");
  assert(Array.isArray(wallPosts.body.items) && wallPosts.body.items.length >= 1, "Wall/Posts should return at least one post.");

  const postCreate = await request(
    "POST",
    "/Post/Create",
    { wallId: "wall-1", text: "Runtime-created parity post." },
    authHeaders
  );
  assert(postCreate.statusCode === 200, "Post/Create should return 200 for valid payload.");
  assert(postCreate.body.compatibility === "Post/Create", "Post/Create compatibility marker mismatch.");
  assert(typeof postCreate.body.post?.id === "string", "Post/Create should return created post id.");

  const postCreateNotFound = await request(
    "POST",
    "/Post/Create",
    { wallId: "missing-wall", text: "Invalid wall reference." },
    authHeaders
  );
  assert(postCreateNotFound.statusCode === 404, "Post/Create should return 404 for missing wall.");
  assert(
    postCreateNotFound.body.errorCode === "WALL_NOT_FOUND",
    "Post/Create missing wall error code mismatch."
  );

  const commentCreate = await request(
    "POST",
    "/Comment/Create",
    { postId: postCreate.body.post.id, text: "Runtime-created parity comment." },
    authHeaders
  );
  assert(commentCreate.statusCode === 200, "Comment/Create should return 200 for valid payload.");
  assert(commentCreate.body.compatibility === "Comment/Create", "Comment/Create compatibility marker mismatch.");
  assert(typeof commentCreate.body.comment?.id === "string", "Comment/Create should return created comment id.");

  const commentValidation = await request(
    "POST",
    "/Comment/Create",
    { postId: postCreate.body.post.id, text: "" },
    authHeaders
  );
  assert(commentValidation.statusCode === 400, "Comment/Create should return 400 for empty text.");
  assert(
    commentValidation.body.errorCode === "VALIDATION_ERROR",
    "Comment/Create validation error code mismatch."
  );
}

const runtimeProcess = spawn("node", [apiRuntimeScript, "start"], {
  cwd: appRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    API_RUNTIME_PORT: String(port)
  }
});

const shutdown = () => {
  if (!runtimeProcess.killed) {
    runtimeProcess.kill("SIGTERM");
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

try {
  await waitForHealthz();
  await runAssertions();
  console.log("[runtime-api-wall-feed] Runtime assertions passed.");
} catch (error) {
  shutdown();
  throw error;
} finally {
  shutdown();
  await new Promise((resolve) => {
    runtimeProcess.once("exit", () => resolve(undefined));
    setTimeout(resolve, 2500);
  });
}
