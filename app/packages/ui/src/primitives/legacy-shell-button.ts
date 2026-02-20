export interface LegacyShellButtonSpec {
  variant: "primary" | "secondary";
  label: string;
  source: string;
}

export function createLegacyShellButton(
  label: string,
  variant: LegacyShellButtonSpec["variant"] = "primary"
): LegacyShellButtonSpec {
  return {
    variant,
    label,
    source: "legacyShellButton"
  };
}
