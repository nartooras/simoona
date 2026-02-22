import { useEffect } from "react";
import type { RuntimeData } from "./runtime-data";
import { FallbackView } from "../features/fallback/FallbackView";
import { AppShell } from "./layout/AppShell";
import {
  EmployeeListView,
  ProfileView,
  SettingsView,
  WallFeedView
} from "../features/core/CoreFeatureViews";
import {
  AdminView,
  AuthUtilityView,
  ClientFeatureView
} from "../features/extended/ExtendedFeatureViews";
import "../shared/styles/legacy-runtime.css";

declare global {
  interface Window {
    __SIMOONA_RUNTIME_DATA__?: RuntimeData;
  }
}

export function App({ initialData }: { initialData: RuntimeData }) {
  const runtimeData = initialData;

  useEffect(() => {
    window.__SIMOONA_RUNTIME_DATA__ = runtimeData;
  }, [runtimeData]);

  let mainContent = <FallbackView runtimeData={runtimeData} />;

  if (runtimeData.authUtilityPage) {
    mainContent = <AuthUtilityView runtimeData={runtimeData} />;
  } else if (runtimeData.clientFeaturePage) {
    mainContent = <ClientFeatureView runtimeData={runtimeData} />;
  } else if (runtimeData.employeeList) {
    mainContent = <EmployeeListView runtimeData={runtimeData} />;
  } else if (runtimeData.adminPage) {
    mainContent = <AdminView runtimeData={runtimeData} />;
  } else if (runtimeData.profilePage) {
    mainContent = <ProfileView runtimeData={runtimeData} />;
  } else if (runtimeData.settingsPage) {
    mainContent = <SettingsView runtimeData={runtimeData} />;
  } else if (runtimeData.wallFeed) {
    mainContent = <WallFeedView runtimeData={runtimeData} />;
  }

  return (
    <>
      <AppShell runtimeData={runtimeData}>{mainContent}</AppShell>
    </>
  );
}
