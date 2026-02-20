export interface LegacyShellNavItem {
  id: string;
  path: string;
  title: string;
  source: string;
}

export function createLegacyShellNavItem(
  id: string,
  path: string,
  title: string
): LegacyShellNavItem {
  return {
    id,
    path,
    title,
    source: "legacyShellNavItem"
  };
}
