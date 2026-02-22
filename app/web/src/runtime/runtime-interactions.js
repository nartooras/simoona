import { setupWallFeedInteractions } from "../features/wall-feed/interactions.js";
import { setupEmployeeListInteractions } from "../features/employee-list/interactions.js";
import { setupProfilePageInteractions } from "../features/profile/interactions.js";
import { setupSettingsPageInteractions } from "../features/settings/interactions.js";
import { setupAuthUtilityInteractions } from "../features/auth-utility/interactions.js";
import { setupClientFeatureInteractions } from "../features/client-feature/interactions.js";
import { setupAdminPageInteractions } from "../features/admin/interactions.js";

export function attachRuntimeInteractions(context) {
  const { root, runtimeData } = context;

  setupWallFeedInteractions(root);
  setupEmployeeListInteractions(root, runtimeData);
  setupProfilePageInteractions(root, runtimeData);
  setupSettingsPageInteractions(root, runtimeData);
  setupAuthUtilityInteractions(root, runtimeData);
  setupClientFeatureInteractions(root, runtimeData);
  setupAdminPageInteractions(root, runtimeData);
}
