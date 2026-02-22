export interface RuntimeNavItem {
  id: string;
  title: string;
  path: string;
}

export interface RuntimeFormField {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  checked?: boolean;
  options?: Array<{ value: string; label: string }>;
}

export interface RuntimeFormModel {
  id: string;
  submitLabel?: string;
  submitSuccessMessage?: string;
  fields: RuntimeFormField[];
  saveLabel?: string;
  cancelPath?: string;
  dangerActionLabel?: string;
}

export interface RuntimeTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  badge?: boolean;
  link?: boolean;
  colorSwatch?: boolean;
}

export interface RuntimeTableModel {
  columns: RuntimeTableColumn[];
  rows: Array<Record<string, unknown>>;
  pageSize?: number;
  defaultSort?: {
    key: string;
    direction?: "asc" | "desc";
  };
}

export interface RuntimeData {
  route: string;
  title: string;
  status: "ready" | "not_found";
  navItems: RuntimeNavItem[];
  auth: {
    requiresLogin: boolean;
    redirectPath: string;
    source?: string;
  };
  routeMatch: {
    routeKey: string;
    normalizedPath: string;
    isKnownLegacyRoute: boolean;
    source?: string;
  };
  tenantRoute: {
    tenantId: string;
    normalizedPath: string;
    source?: string;
  };
  shell: {
    userName: string;
    notificationCount: number;
    unreadMessages: number;
  };
  leftMenu: {
    groups: Array<{
      id: string;
      title: string;
      items: Array<{
        id: string;
        label: string;
        path: string;
        external?: boolean;
      }>;
    }>;
  };
  wallFeed: null | Record<string, unknown>;
  employeeList: null | Record<string, unknown>;
  profilePage: null | Record<string, unknown>;
  settingsPage: null | Record<string, unknown>;
  clientFeaturePage: null | Record<string, unknown>;
  adminPage: null | Record<string, unknown>;
  authUtilityPage: null | Record<string, unknown>;
  shellMode: "app" | "auth";
}

