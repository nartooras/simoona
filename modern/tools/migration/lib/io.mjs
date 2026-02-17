import fs from "node:fs";
import path from "node:path";

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function readJsonFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

export function stableSortBy(items, keySelector) {
  return [...items].sort((a, b) => {
    const aKey = String(keySelector(a) ?? "");
    const bKey = String(keySelector(b) ?? "");
    return aKey.localeCompare(bKey, "en", { sensitivity: "base" });
  });
}

export function stableObject(value) {
  if (Array.isArray(value)) {
    return value.map((item) => stableObject(item));
  }

  if (value && typeof value === "object") {
    const sortedKeys = Object.keys(value).sort((a, b) => a.localeCompare(b));
    const result = {};
    for (const key of sortedKeys) {
      result[key] = stableObject(value[key]);
    }

    return result;
  }

  return value;
}

export function writeJsonFile(filePath, value) {
  ensureDir(path.dirname(filePath));
  const stable = stableObject(value);
  fs.writeFileSync(filePath, `${JSON.stringify(stable, null, 2)}\n`, "utf8");
}

export function writeTextFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

export function resolveFromCwd(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
}
