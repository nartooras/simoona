import type { GeneralSettingsResult } from './generalSettings';

/**
 * Wave 1 migration stub for legacy GET /User/GeneralSettings.
 * Remove this adapter once modern API exposes /api/v1/user/general-settings.
 */
export async function fetchGeneralSettingsViaStub(): Promise<GeneralSettingsResult> {
    return { kind: 'apiGap' };
}
