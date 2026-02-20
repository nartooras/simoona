export interface TopLevelLayoutState {
  title: string;
  navRegion: string;
  contentRegion: string;
  source: string;
}

export function createTopLevelLayoutState(): TopLevelLayoutState {
  return {
    title: "Simoona",
    navRegion: "legacyTopNavFrame",
    contentRegion: "legacyMainContentFrame",
    source: "legacyTopLevelLayout"
  };
}
