import {
  createLegacyShellNavItem,
  resolveLegacyMotionTokens
} from "../../../packages/ui/src/index.ts";
import { LEGACY_WEB_ROUTES } from "../../../packages/contracts/route-map.ts";

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
      createLegacyShellNavItem("home", LEGACY_WEB_ROUTES.root, "Home"),
      createLegacyShellNavItem("profile", LEGACY_WEB_ROUTES.profile, "Profile")
    ],
    motion: resolveLegacyMotionTokens(prefersReducedMotion),
    source: "legacyTopLevelLayout"
  };
}
