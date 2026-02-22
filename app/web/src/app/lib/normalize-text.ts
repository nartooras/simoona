export function normalizeText(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}
