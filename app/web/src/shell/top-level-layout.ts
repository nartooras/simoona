import {
  createLegacyShellNavItem,
  resolveLegacyMotionTokens
} from "../../../packages/ui/src/index.ts";

export interface TopLevelLayoutState {
  title: string;
  navRegion: string;
  contentRegion: string;
  navItems: Array<{
    id: string;
    path: string;
    title: string;
    source: string;
  }>;
  motion: {
    pageTransitionMs: number;
    microInteractionMs: number;
    reducedMotionEnabled: boolean;
    source: string;
  };
  source: string;
}

export function createTopLevelLayoutState(
  prefersReducedMotion: boolean = false
): TopLevelLayoutState {
  return {
    title: "Simoona",
    navRegion: "legacyTopNavFrame",
    contentRegion: "legacyMainContentFrame",
    navItems: [
      createLegacyShellNavItem("home", "/", "Home"),
      createLegacyShellNavItem("profile", "/profile", "Profile")
    ],
    motion: resolveLegacyMotionTokens(prefersReducedMotion),
    source: "legacyTopLevelLayout"
  };
}
