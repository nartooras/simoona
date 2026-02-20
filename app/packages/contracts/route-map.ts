export const LEGACY_API_ROUTES = {
  token: "token",
  account: {
    userInfo: "Account/UserInfo",
    register: "Account/Register",
    registerExternal: "Account/RegisterExternal",
    requestPasswordReset: "Account/RequestPasswordReset",
    resetPassword: "Account/ResetPassword",
    verifyEmail: "Account/VerifyEmail",
    externalLogins: "Account/ExternalLogins",
    internalLogins: "Account/InternalLogins",
    externalLogin: "Account/ExternalLogin",
    logout: "Account/Logout"
  },
  comment: {
    create: "Comment/Create",
    edit: "Comment/Edit",
    delete: "Comment/Delete",
    hide: "Comment/Hide",
    like: "Comment/Like"
  }
} as const;

export const LEGACY_WEB_ROUTES = {
  root: "/",
  profile: "/profile",
  wallFeed: "/Wall/Feed",
  settingsNotifications: "/Settings/Notifications",
  accountLogin: "/account/login"
} as const;

export type LegacyApiRoute =
  | (typeof LEGACY_API_ROUTES)["token"]
  | (typeof LEGACY_API_ROUTES)["account"][keyof (typeof LEGACY_API_ROUTES)["account"]]
  | (typeof LEGACY_API_ROUTES)["comment"][keyof (typeof LEGACY_API_ROUTES)["comment"]];

export type LegacyWebRoute =
  (typeof LEGACY_WEB_ROUTES)[keyof typeof LEGACY_WEB_ROUTES];
