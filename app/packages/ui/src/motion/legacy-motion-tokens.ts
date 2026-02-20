export interface LegacyMotionTokens {
  pageTransitionMs: number;
  microInteractionMs: number;
  reducedMotionEnabled: boolean;
  source: string;
}

export function resolveLegacyMotionTokens(
  prefersReducedMotion: boolean
): LegacyMotionTokens {
  if (prefersReducedMotion) {
    return {
      pageTransitionMs: 0,
      microInteractionMs: 0,
      reducedMotionEnabled: true,
      source: "legacyReducedMotionMode"
    };
  }

  return {
    pageTransitionMs: 160,
    microInteractionMs: 120,
    reducedMotionEnabled: false,
    source: "legacyReducedMotionMode"
  };
}
