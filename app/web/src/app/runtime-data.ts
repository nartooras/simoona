import {
  employeeRows,
  legacyLeftMenuGroups,
  normalizePath,
  wallFeedPosts
} from "../runtime/runtime-shared.js";
import { resolveAuthBoundary } from "../shell/auth-boundary";
import { resolveLegacyRouteCatchup } from "../shell/legacy-route-catchup";
import { resolveTenantRoute } from "../shell/tenant-route-container";
import {
  createBaseRuntimeData,
  createDefaultEmployeeListPayload,
  createDefaultTenantLoginPayload,
  createDefaultWallFeedPayload
} from "./runtime-payload.js";

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

const appNavItems: RuntimeNavItem[] = [
  { id: "home", title: "Home", path: "/default/Wall/Feed" },
  { id: "profile", title: "Profile", path: "/default/Profiles/1" }
];

const profileDetailsModel = {
  id: "1",
  displayName: "Arturas Nikoncukas",
  username: "anikoncukas",
  pictureId: "avatar-1",
  jobTitle: "Full-Stack Developer",
  qualificationLevel: "Senior",
  email: "arturas.nikoncukas@example.com",
  phoneNumber: "+37060000001",
  birthdayAdmin: "1990-05-07",
  birthdayPublic: "05-07",
  employmentDate: "2022-09-01",
  fullTime: "Yes",
  partTimeHours: "N/A",
  workingHours: "08:00 - 17:00",
  lunch: "12:00 - 13:00",
  manager: "Vardenis Pavardenis",
  projects: ["Modernization", "Intranet Platform", "Office Map"],
  location: "Vilnius Office / Floor 2 / Room 214",
  skills: ["TypeScript", "React", "Node.js"],
  bio: "Building parity-first modernization deliveries while preserving legacy behavior.",
  certificates: ["AWS Practitioner", "Scrum Master"],
  exams: ["AZ-204", "ISTQB"],
  roles: ["User", "Project Admin"],
  blacklist: {
    endDate: "2026-03-01",
    reason: "Policy cooldown period",
    createdBy: "Jona Jonaite",
    modifiedBy: "Tomas Tomasaitis"
  }
};

const settingsModel = {
  tabs: [
    { id: "general", label: "General", path: "/default/Settings/General" },
    { id: "notifications", label: "Notifications", path: "/default/Settings/Notifications" },
    { id: "providers", label: "Providers", path: "/default/Settings/Providers" }
  ],
  general: {
    languageCode: "en",
    timeZoneId: "Europe/Vilnius",
    languages: [
      { code: "en", label: "English" },
      { code: "lt", label: "Lithuanian" }
    ],
    timeZones: [
      { id: "Europe/Vilnius", label: "(GMT+02:00) Vilnius" },
      { id: "Europe/Riga", label: "(GMT+02:00) Riga" },
      { id: "Europe/Helsinki", label: "(GMT+02:00) Helsinki" }
    ]
  },
  notifications: {
    walls: [
      { id: "wall-main", name: "twoday Buzz", isMainWall: true, app: true, email: true },
      { id: "wall-official", name: "Official", isMainWall: false, app: true, email: false },
      { id: "wall-tech", name: "Techies", isMainWall: false, app: false, email: false }
    ],
    eventsApp: true,
    eventsEmail: true,
    projectsApp: true,
    projectsEmail: false
  },
  providers: {
    items: [
      { name: "Internal", linked: true, email: "arturas.nikoncukas@example.com", canUnlink: false },
      { name: "Google", linked: true, email: "arturas.nikoncukas@gmail.com", canUnlink: true },
      { name: "Facebook", linked: false, email: null, canUnlink: false },
      { name: "Microsoft", linked: false, email: null, canUnlink: false }
    ]
  }
};

const adminNavigation = [
  { id: "users", label: "Users", path: "/default/Admin/Users" },
  { id: "roles", label: "Roles", path: "/default/Admin/Roles" },
  { id: "roomtypes", label: "Room types", path: "/default/Admin/RoomTypes" },
  { id: "offices", label: "Offices", path: "/default/Admin/Offices" },
  { id: "customization", label: "Customization", path: "/default/Admin/Customization" },
  { id: "lotteries", label: "Lotteries", path: "/default/Admin/Lotteries/List" },
  { id: "kudosbasket", label: "Kudos basket", path: "/default/Admin/KudosBasket" }
];

const adminUsersRows = [
  {
    id: "usr-1",
    fullName: "Arturas Nikoncukas",
    fullNamePath: "/default/Profiles/1",
    userName: "anikoncukas",
    jobTitle: "Full-Stack Developer",
    skills: "TypeScript, React, Node.js",
    projects: "Modernization, Intranet",
    hasRoom: "Yes",
    waitingConfirmation: "No",
    actions: [
      { label: "Edit", path: "/default/Profiles/1/Edit/personal" },
      { label: "Delete", kind: "danger" }
    ]
  },
  {
    id: "usr-2",
    fullName: "Vardenis Pavardenis",
    fullNamePath: "/default/Profiles/2",
    userName: "vpavardenis",
    jobTitle: "Finance manager",
    skills: "Forecasting",
    projects: "Budget 2026",
    hasRoom: "No",
    waitingConfirmation: "No",
    actions: [{ label: "Edit", path: "/default/Profiles/2/Edit/personal" }]
  },
  {
    id: "usr-3",
    fullName: "Margarita Morke",
    fullNamePath: "/default/Profiles/3",
    userName: "mmorke",
    jobTitle: "QA Engineer",
    skills: "Playwright, API Testing",
    projects: "Parity QA",
    hasRoom: "Yes",
    waitingConfirmation: "No",
    actions: [{ label: "Edit", path: "/default/Profiles/3/Edit/personal" }]
  },
  {
    id: "usr-4",
    fullName: "Nikolajus Rimka",
    fullNamePath: "/default/Profiles/4",
    userName: "nrimka",
    jobTitle: "Support Specialist",
    skills: "Service Desk",
    projects: "Support",
    hasRoom: "Yes",
    waitingConfirmation: "Yes",
    actions: [{ label: "Edit", path: "/default/Profiles/4/Edit/personal" }]
  },
  {
    id: "usr-5",
    fullName: "Monika Radzeviciute",
    fullNamePath: "/default/Profiles/5",
    userName: "mradzeviciute",
    jobTitle: "People Partner",
    skills: "Recruitment, HR",
    projects: "People Ops",
    hasRoom: "No",
    waitingConfirmation: "No",
    actions: [{ label: "Edit", path: "/default/Profiles/5/Edit/personal" }]
  },
  {
    id: "usr-6",
    fullName: "Rytis Kvedaras",
    fullNamePath: "/default/Profiles/6",
    userName: "rkvedaras",
    jobTitle: ".NET developer",
    skills: ".NET, SQL",
    projects: "API parity",
    hasRoom: "Yes",
    waitingConfirmation: "No",
    actions: [{ label: "Edit", path: "/default/Profiles/6/Edit/personal" }]
  },
  {
    id: "usr-7",
    fullName: "Petra Petraitis",
    fullNamePath: "/default/Profiles/7",
    userName: "ppetraitis",
    jobTitle: "UI Designer",
    skills: "Design systems",
    projects: "UI parity",
    hasRoom: "Yes",
    waitingConfirmation: "No",
    actions: [{ label: "Edit", path: "/default/Profiles/7/Edit/personal" }]
  },
  {
    id: "usr-8",
    fullName: "Ausris Kiela",
    fullNamePath: "/default/Profiles/8",
    userName: "akiela",
    jobTitle: "Accountant",
    skills: "Accounting",
    projects: "Expense workflows",
    hasRoom: "No",
    waitingConfirmation: "No",
    actions: [{ label: "Edit", path: "/default/Profiles/8/Edit/personal" }]
  }
];

const adminCustomizationCards = [
  { id: "eventtypes", title: "Event types", subtitle: "Manage event categories.", path: "/default/Admin/Customization/EventTypes", icon: "*" },
  { id: "jobtitles", title: "Job titles", subtitle: "Manage job title dictionary.", path: "/default/Admin/Customization/JobTitles", icon: "J" },
  { id: "kudostypes", title: "Kudos types", subtitle: "Define kudos badges.", path: "/default/Admin/Customization/KudosTypes", icon: "K" },
  { id: "kudosshop", title: "Kudos shop", subtitle: "Configure reward catalog.", path: "/default/Admin/Customization/KudosShop", icon: "$" },
  { id: "servicerequests", title: "Service request types", subtitle: "Configure support categories.", path: "/default/Admin/Customization/ServiceRequestsTypes", icon: "S" },
  { id: "orgsettings", title: "Organization settings", subtitle: "Maintain organization defaults.", path: "/default/Admin/Customization/OrganizationSettings", icon: "O" },
  { id: "externallinks", title: "External links", subtitle: "Manage external sidebar links.", path: "/default/Admin/Customization/ExternalLinks", icon: "E" }
];

const adminLotteryRows = [
  {
    id: "lottery-1",
    title: "Kudos lottery iPad A16",
    status: "Started",
    endDate: "2026-02-13, 10:00",
    actions: [
      { label: "Edit", path: "/default/Admin/Lotteries/lottery-1/Edit" },
      { label: "Refund", path: "/default/Admin/Lotteries/lottery-1/Refunding" }
    ]
  },
  {
    id: "lottery-2",
    title: "Gift basket",
    status: "Ended",
    endDate: "2026-01-30, 18:00",
    actions: [{ label: "Edit", path: "/default/Admin/Lotteries/lottery-2/Edit" }]
  }
];

const kudosBasketDonations = [
  { id: "don-1", fullName: "Arturas Nikoncukas", amount: "10", date: "2026-02-12, 09:12" },
  { id: "don-2", fullName: "Vardenis Pavardenis", amount: "5", date: "2026-02-12, 09:18" },
  { id: "don-3", fullName: "Jona Jonaite", amount: "3", date: "2026-02-12, 09:24" }
];

const clientFeatureNavigationTemplate = [
  { id: "wall", label: "Walls", path: "/default/Wall/List" },
  { id: "events", label: "Events", path: "/default/Events/List" },
  { id: "kudos", label: "Kudos", path: "/default/Kudos" },
  { id: "books", label: "Books", path: "/default/Books/List" },
  { id: "projects", label: "Projects", path: "/default/Projects/List" },
  { id: "requests", label: "Service Requests", path: "/default/ServiceRequests/List" },
  { id: "vacation", label: "Vacation", path: "/default/Vacation/List" },
  { id: "committees", label: "Committees", path: "/default/Committees/List" },
  { id: "office", label: "Office Map", path: "/default/Office" },
  { id: "structure", label: "Org Structure", path: "/default/OrganizationalStructure" },
  { id: "ticket", label: "Submit Ticket", path: "/default/SubmitTicket" }
];

const wallDiscoverRows = [
  { id: "wall-1", name: "Official", members: "459", posts: "1612", privacy: "Public", actions: [{ label: "Follow" }, { label: "Open", path: "/default/Wall/Feed?wall=official" }] },
  { id: "wall-2", name: "Techies", members: "312", posts: "918", privacy: "Public", actions: [{ label: "Follow" }, { label: "Open", path: "/default/Wall/Feed?wall=techies" }] },
  { id: "wall-3", name: "Vilnius Geeks", members: "227", posts: "604", privacy: "Public", actions: [{ label: "Follow" }, { label: "Open", path: "/default/Wall/Feed?wall=vilnius-geeks" }] },
  { id: "wall-4", name: "DANK MEMES", members: "178", posts: "1240", privacy: "Public", actions: [{ label: "Follow" }, { label: "Open", path: "/default/Wall/Feed?wall=dank-memes" }] },
  { id: "wall-5", name: "Private Leadership", members: "12", posts: "188", privacy: "Private", actions: [{ label: "Request invite" }] }
];

const wallMembersRows = [
  { id: "wm-1", fullName: "Arturas Nikoncukas", fullNamePath: "/default/Profiles/1", role: "Owner", joined: "2024-01-10", actions: [{ label: "Profile", path: "/default/Profiles/1" }] },
  { id: "wm-2", fullName: "Jona Jonaite", fullNamePath: "/default/Profiles/9", role: "Moderator", joined: "2024-02-11", actions: [{ label: "Profile", path: "/default/Profiles/9" }] },
  { id: "wm-3", fullName: "Rytis Kvedaras", fullNamePath: "/default/Profiles/6", role: "Member", joined: "2024-06-08", actions: [{ label: "Profile", path: "/default/Profiles/6" }] }
];

const eventRows = [
  { id: "event-1", title: "FPV drone workshop", type: "Leisure", office: "Vilnius", startDate: "2026-02-25 17:30", actions: [{ label: "Open", path: "/default/Events/EventContent/event-1" }, { label: "Edit", path: "/default/Events/Edit/event-1" }] },
  { id: "event-2", title: "ISTQB Advanced hub", type: "Hub", office: "Vilnius", startDate: "2026-02-26 12:00", actions: [{ label: "Open", path: "/default/Events/EventContent/event-2" }, { label: "Edit", path: "/default/Events/Edit/event-2" }] },
  { id: "event-3", title: "Kids celebration", type: "Leisure", office: "Kaunas", startDate: "2026-05-16 10:00", actions: [{ label: "Open", path: "/default/Events/EventContent/event-3" }, { label: "Edit", path: "/default/Events/Edit/event-3" }] }
];

const eventReportRows = [
  { id: "report-1", eventTitle: "FPV drone workshop", participants: "46", attendance: "39", completion: "85%", actions: [{ label: "Open report", path: "/default/Events/Report/Report/Event/event-1" }] },
  { id: "report-2", eventTitle: "ISTQB Advanced hub", participants: "31", attendance: "27", completion: "87%", actions: [{ label: "Open report", path: "/default/Events/Report/Report/Event/event-2" }] }
];

const kudosLogRows = [
  { id: "kudos-log-1", date: "2026-02-18", from: "Jona Jonaite", to: "Arturas Nikoncukas", amount: "+3", reason: "Great mentoring" },
  { id: "kudos-log-2", date: "2026-02-14", from: "Vardenis Pavardenis", to: "Arturas Nikoncukas", amount: "+2", reason: "Documentation help" },
  { id: "kudos-log-3", date: "2026-02-09", from: "Monika Radzeviciute", to: "Arturas Nikoncukas", amount: "+1", reason: "Interview support" }
];

const booksRows = [
  { id: "book-1", title: "Domain-Driven Design", author: "Eric Evans", office: "Vilnius", status: "Available", actions: [{ label: "Edit", path: "/default/Books/Edit/book-1/office-1" }] },
  { id: "book-2", title: "Clean Architecture", author: "Robert C. Martin", office: "Kaunas", status: "Borrowed", actions: [{ label: "Edit", path: "/default/Books/Edit/book-2/office-2" }] },
  { id: "book-3", title: "Refactoring", author: "Martin Fowler", office: "Vilnius", status: "Available", actions: [{ label: "Edit", path: "/default/Books/Edit/book-3/office-1" }] }
];

const projectRows = [
  { id: "project-1", name: "Simoona modernization", owner: "Arturas Nikoncukas", state: "Active", dueDate: "2026-06-30", actions: [{ label: "Details", path: "/default/Projects/Details/project-1" }, { label: "Edit", path: "/default/Projects/Edit/project-1" }] },
  { id: "project-2", name: "Office map redesign", owner: "Jona Jonaite", state: "Planning", dueDate: "2026-05-15", actions: [{ label: "Details", path: "/default/Projects/Details/project-2" }, { label: "Edit", path: "/default/Projects/Edit/project-2" }] },
  { id: "project-3", name: "Kudos campaigns", owner: "Monika Radzeviciute", state: "On hold", dueDate: "2026-08-01", actions: [{ label: "Details", path: "/default/Projects/Details/project-3" }, { label: "Edit", path: "/default/Projects/Edit/project-3" }] }
];

const serviceRequestRows = [
  { id: "sr-1001", type: "IT support", priority: "High", status: "In progress", created: "2026-02-18", assignee: "Rytis Kvedaras" },
  { id: "sr-1002", type: "Office access", priority: "Medium", status: "Open", created: "2026-02-17", assignee: "Jona Jonaite" },
  { id: "sr-1003", type: "Equipment", priority: "Low", status: "Resolved", created: "2026-02-12", assignee: "Ausris Kiela" }
];

const vacationRows = [
  { id: "vac-1", period: "2026-07-01 - 2026-07-10", days: "8", status: "Approved", approver: "Vardenis Pavardenis" },
  { id: "vac-2", period: "2026-08-14 - 2026-08-21", days: "6", status: "Pending", approver: "Vardenis Pavardenis" }
];

const committeeRows = [
  { id: "com-1", name: "Kudos Committee", members: "9", lead: "Jona Jonaite", nextMeeting: "2026-02-28" },
  { id: "com-2", name: "Culture Committee", members: "7", lead: "Monika Radzeviciute", nextMeeting: "2026-03-03" }
];

function isPathIn(pathname: string, ...expected: string[]) {
  const normalized = normalizePath(pathname).toLowerCase();
  return expected.some((path) => {
    const token = path.toLowerCase();
    return normalized === token || normalized.startsWith(`${token}/`);
  });
}

function buildAuthUtilityPagePayload(pathname: string) {
  const normalized = normalizePath(pathname);
  const lower = normalized.toLowerCase();

  if (normalized === "/" || lower === "/login") {
    return {
      shellMode: "auth",
      view: "public-login",
      title: "Sign in",
      subtitle: "Enter your organization name",
      form: {
        id: "auth-public-login-form",
        submitLabel: "Continue",
        submitSuccessMessage: "Organization found.",
        fields: [
          {
            id: "organizationName",
            label: "Organization",
            type: "text",
            placeholder: "default",
            required: true,
            value: ""
          }
        ]
      },
      links: [{ label: "Tenant login", path: "/default/Login", kind: "secondary" }]
    };
  }

  if (lower.startsWith("/redirectto/")) {
    return {
      shellMode: "auth",
      view: "redirect",
      title: "Redirect",
      subtitle: "Switching route",
      message: "Preparing legacy redirect target..."
    };
  }

  if (lower === "/default" || lower === "/default/login") {
    return {
      ...createDefaultTenantLoginPayload(),
      shellMode: "auth",
      providers: [
        { id: "google", label: "Google" },
        { id: "facebook", label: "Facebook" },
        { id: "microsoft", label: "Microsoft" }
      ]
    };
  }

  if (lower === "/default/register") {
    return {
      shellMode: "auth",
      view: "register",
      title: "Register",
      subtitle: "Create your account",
      form: {
        id: "auth-register-form",
        submitLabel: "Register",
        submitSuccessMessage: "Registration request submitted.",
        fields: [
          { id: "firstName", label: "First name", type: "text", required: true, value: "" },
          { id: "lastName", label: "Last name", type: "text", required: true, value: "" },
          { id: "email", label: "Email", type: "email", required: true, value: "" },
          { id: "password", label: "Password", type: "password", required: true, value: "" },
          {
            id: "repeatedPassword",
            label: "Repeat password",
            type: "password",
            required: true,
            value: ""
          }
        ]
      }
    };
  }

  if (lower === "/default/forgot") {
    return {
      shellMode: "auth",
      view: "forgot",
      title: "Forgot password",
      subtitle: "Request reset",
      form: {
        id: "auth-forgot-form",
        submitLabel: "Send",
        submitSuccessMessage: "Password reset email sent.",
        fields: [{ id: "email", label: "Email", type: "email", required: true, value: "" }]
      }
    };
  }

  if (lower === "/default/reset") {
    return {
      shellMode: "auth",
      view: "reset",
      title: "Reset password",
      subtitle: "Set a new password",
      form: {
        id: "auth-reset-form",
        submitLabel: "Update password",
        submitSuccessMessage: "Password changed successfully.",
        fields: [
          { id: "password", label: "Password", type: "password", required: true, value: "" },
          {
            id: "confirmPassword",
            label: "Confirm password",
            type: "password",
            required: true,
            value: ""
          }
        ]
      }
    };
  }

  if (lower === "/default/verify") {
    return {
      shellMode: "auth",
      view: "verify",
      title: "Verification",
      alert: { kind: "success", message: "Email verified successfully." }
    };
  }

  if (lower === "/default/logoff") {
    return {
      shellMode: "auth",
      view: "logoff",
      title: "Log off",
      alert: { kind: "success", message: "You are now logged off." }
    };
  }

  if (lower === "/default/accessdenied") {
    return {
      shellMode: "auth",
      view: "access-denied",
      title: "Access denied",
      subtitle: "You do not have permissions for this route."
    };
  }

  if (lower === "/default/pagenotfound") {
    return {
      shellMode: "auth",
      view: "page-not-found",
      title: "404",
      subtitle: "Page not found"
    };
  }

  if (isPathIn(pathname, "/default/error")) {
    return {
      shellMode: "auth",
      view: "error",
      title: "Unexpected error",
      subtitle: "Please try again later."
    };
  }

  return null;
}

function buildProfilePagePayload(pathname: string) {
  if (!isPathIn(pathname, "/default/profiles")) {
    return null;
  }

  const segments = normalizePath(pathname).split("/").filter(Boolean);
  const profileIdSegment = segments[2] || "1";
  const isEdit = String(segments[3] || "").toLowerCase() === "edit";
  const activeTab = String(segments[4] || "personal").toLowerCase();

  if (isEdit) {
    return {
      mode: "edit",
      profileId: profileIdSegment,
      edit: {
        activeTab,
        tabs: [
          { id: "personal", label: "Personal" },
          { id: "job", label: "Job" },
          { id: "office", label: "Office" },
          { id: "blacklist", label: "Blacklist" }
        ],
        personal: {
          firstName: "Arturas",
          lastName: "Nikoncukas",
          email: profileDetailsModel.email,
          phoneNumber: profileDetailsModel.phoneNumber,
          birthday: "1990-05-07",
          bio: profileDetailsModel.bio
        },
        job: {
          manager: profileDetailsModel.manager,
          projects: profileDetailsModel.projects,
          jobTitle: profileDetailsModel.jobTitle,
          qualification: profileDetailsModel.qualificationLevel,
          workingHoursFrom: "08:00",
          workingHoursTo: "17:00",
          lunchFrom: "12:00",
          lunchTo: "13:00"
        },
        office: {
          office: "Vilnius Office",
          floor: "2",
          room: "214"
        },
        blacklist: {
          endDate: profileDetailsModel.blacklist.endDate,
          reason: profileDetailsModel.blacklist.reason,
          createdBy: profileDetailsModel.blacklist.createdBy,
          modifiedBy: profileDetailsModel.blacklist.modifiedBy
        }
      }
    };
  }

  return {
    mode: "details",
    profileId: profileIdSegment,
    details: profileDetailsModel
  };
}

function buildSettingsPagePayload(pathname: string) {
  if (!isPathIn(pathname, "/default/settings")) {
    return null;
  }

  const segments = normalizePath(pathname).split("/").filter(Boolean);
  const tabSegment = String(segments[2] || "general").toLowerCase();
  const activeTab = ["general", "notifications", "providers"].includes(tabSegment)
    ? tabSegment
    : "general";

  return {
    ...settingsModel,
    activeTab
  };
}

function buildClientFeaturePagePayload(pathname: string, searchParams: URLSearchParams) {
  const lower = normalizePath(pathname).toLowerCase();

  const base = {
    navigation: clientFeatureNavigationTemplate
  };

  if (lower === "/default/wall/list") {
    return {
      ...base,
      view: "wall-list",
      title: "Discover walls",
      filterPlaceholder: "Search walls...",
      table: {
        columns: [
          { key: "name", label: "Wall", sortable: true, link: true },
          { key: "members", label: "Members", sortable: true },
          { key: "posts", label: "Posts", sortable: true },
          { key: "privacy", label: "Privacy", sortable: true, badge: true },
          { key: "actions", label: "Actions" }
        ],
        rows: wallDiscoverRows,
        pageSize: 8,
        defaultSort: { key: "name", direction: "asc" }
      }
    };
  }

  if (isPathIn(pathname, "/default/wall/create", "/default/wall/edit")) {
    return {
      ...base,
      view: "wall-manage",
      title: "Discover walls",
      form: {
        id: "client-wall-form",
        saveLabel: "Save",
        fields: [
          { id: "wall-name", label: "Wall name", type: "text", required: true, value: "" },
          {
            id: "wall-description",
            label: "Description",
            type: "textarea",
            required: false,
            value: ""
          }
        ]
      }
    };
  }

  if (lower === "/default/wall/members") {
    return {
      ...base,
      view: "wall-members",
      title: "Wall members",
      table: {
        columns: [
          { key: "fullName", label: "Name", sortable: true, link: true },
          { key: "role", label: "Role", sortable: true },
          { key: "joined", label: "Joined", sortable: true },
          { key: "actions", label: "Actions" }
        ],
        rows: wallMembersRows,
        pageSize: 8,
        defaultSort: { key: "fullName", direction: "asc" }
      }
    };
  }

  if (lower === "/default/events" || lower === "/default/events/list") {
    return {
      ...base,
      view: "events-list",
      title: "Events",
      table: {
        columns: [
          { key: "title", label: "Title", sortable: true },
          { key: "type", label: "Type", sortable: true },
          { key: "office", label: "Office", sortable: true },
          { key: "startDate", label: "Start", sortable: true },
          { key: "actions", label: "Actions" }
        ],
        rows: eventRows,
        pageSize: 8,
        defaultSort: { key: "startDate", direction: "asc" }
      }
    };
  }

  if (isPathIn(pathname, "/default/events/list/leisure")) {
    return {
      ...base,
      view: "events-list-filtered",
      title: "Events",
      subtitle: `Filtered by office=${searchParams.get("office") || "Vilnius"}`,
      table: {
        columns: [
          { key: "title", label: "Title", sortable: true },
          { key: "type", label: "Type", sortable: true },
          { key: "office", label: "Office", sortable: true },
          { key: "startDate", label: "Start", sortable: true },
          { key: "actions", label: "Actions" }
        ],
        rows: eventRows,
        pageSize: 8,
        defaultSort: { key: "startDate", direction: "asc" }
      }
    };
  }

  if (isPathIn(pathname, "/default/events/addevent", "/default/events/edit")) {
    return {
      ...base,
      view: "events-manage",
      title: "Events",
      form: {
        id: "client-events-form",
        saveLabel: "Save",
        fields: [
          { id: "event-title", label: "Title", type: "text", required: true, value: "" },
          { id: "event-type", label: "Type", type: "select", value: "Leisure", options: [{ value: "Leisure", label: "Leisure" }, { value: "Hub", label: "Hub" }] },
          { id: "event-notes", label: "Notes", type: "textarea", required: false, value: "" }
        ]
      }
    };
  }

  if (isPathIn(pathname, "/default/events/eventcontent")) {
    return {
      ...base,
      view: "events-content",
      title: "Event details",
      details: {
        sections: [
          { label: "Event", value: "FPV drone workshop" },
          { label: "Office", value: "Vilnius" },
          { label: "Date", value: "2026-02-25" }
        ]
      }
    };
  }

  if (lower === "/default/events/report") {
    return {
      ...base,
      view: "events-report-list",
      title: "Event reports",
      table: {
        columns: [
          { key: "eventTitle", label: "Event", sortable: true },
          { key: "participants", label: "Participants", sortable: true },
          { key: "attendance", label: "Attendance", sortable: true },
          { key: "completion", label: "Completion", sortable: true },
          { key: "actions", label: "Actions" }
        ],
        rows: eventReportRows,
        pageSize: 8,
        defaultSort: { key: "eventTitle", direction: "asc" }
      }
    };
  }

  if (isPathIn(pathname, "/default/events/report/report/event")) {
    return {
      ...base,
      view: "events-report-details",
      title: "Event report",
      details: {
        sections: [
          { label: "Attended", value: "39 / 46" },
          { label: "Completion", value: "85%" },
          { label: "Feedback", value: "Strong sentiment" }
        ]
      }
    };
  }

  if (lower === "/default/kudos") {
    return {
      ...base,
      view: "kudos-dashboard",
      title: "Kudos",
      cards: [
        { title: "Received this month", subtitle: "17" },
        { title: "Given this month", subtitle: "12" }
      ]
    };
  }

  if (lower === "/default/kudos/kudosachievementboard") {
    return {
      ...base,
      view: "kudos-achievement-board",
      title: "Kudos achievement board",
      cards: [
        { title: "Top giver", subtitle: "Arturas Nikoncukas" },
        { title: "Top receiver", subtitle: "Jona Jonaite" }
      ]
    };
  }

  if (isPathIn(pathname, "/default/kudos/kudosloglist")) {
    return {
      ...base,
      view: "kudos-log-list",
      title: "Kudos log",
      table: {
        columns: [
          { key: "date", label: "Date", sortable: true },
          { key: "from", label: "From", sortable: true },
          { key: "to", label: "To", sortable: true },
          { key: "amount", label: "Amount", sortable: true },
          { key: "reason", label: "Reason", sortable: true }
        ],
        rows: kudosLogRows,
        pageSize: 8,
        defaultSort: { key: "date", direction: "desc" }
      }
    };
  }

  if (isPathIn(pathname, "/default/kudos/kudosuserinformation")) {
    return {
      ...base,
      view: "kudos-user-information",
      title: "Kudos user information",
      details: {
        sections: [
          { label: "Balance", value: "124" },
          { label: "Lifetime received", value: "478" },
          { label: "Lifetime given", value: "355" }
        ]
      }
    };
  }

  if (lower === "/default/books" || lower === "/default/books/list") {
    return {
      ...base,
      view: "books-list",
      title: "Books",
      table: {
        columns: [
          { key: "title", label: "Title", sortable: true },
          { key: "author", label: "Author", sortable: true },
          { key: "office", label: "Office", sortable: true },
          { key: "status", label: "Status", sortable: true, badge: true },
          { key: "actions", label: "Actions" }
        ],
        rows: booksRows,
        pageSize: 8,
        defaultSort: { key: "title", direction: "asc" }
      }
    };
  }

  if (isPathIn(pathname, "/default/books/add", "/default/books/edit")) {
    return {
      ...base,
      view: "books-manage",
      title: "Books",
      form: {
        id: "client-books-form",
        saveLabel: "Save",
        fields: [
          { id: "book-title", label: "Title", type: "text", required: true, value: "" },
          { id: "book-author", label: "Author", type: "text", required: true, value: "" }
        ]
      }
    };
  }

  if (lower === "/default/projects" || lower === "/default/projects/list") {
    return {
      ...base,
      view: "projects-list",
      title: "Projects",
      table: {
        columns: [
          { key: "name", label: "Name", sortable: true },
          { key: "owner", label: "Owner", sortable: true },
          { key: "state", label: "State", sortable: true, badge: true },
          { key: "dueDate", label: "Due", sortable: true },
          { key: "actions", label: "Actions" }
        ],
        rows: projectRows,
        pageSize: 8,
        defaultSort: { key: "name", direction: "asc" }
      }
    };
  }

  if (isPathIn(pathname, "/default/projects/create", "/default/projects/edit")) {
    return {
      ...base,
      view: "projects-manage",
      title: "Projects",
      form: {
        id: "client-projects-form",
        saveLabel: "Save",
        fields: [
          { id: "project-name", label: "Project name", type: "text", required: true, value: "" },
          { id: "project-owner", label: "Owner", type: "text", required: true, value: "" }
        ]
      }
    };
  }

  if (isPathIn(pathname, "/default/projects/details")) {
    return {
      ...base,
      view: "projects-details",
      title: "Project details",
      details: {
        sections: [
          { label: "Name", value: "Simoona modernization" },
          { label: "Owner", value: "Arturas Nikoncukas" },
          { label: "State", value: "Active" }
        ]
      }
    };
  }

  if (lower === "/default/servicerequests/list") {
    return {
      ...base,
      view: "service-requests-list",
      title: "Service requests",
      table: {
        columns: [
          { key: "id", label: "ID", sortable: true },
          { key: "type", label: "Type", sortable: true },
          { key: "priority", label: "Priority", sortable: true, badge: true },
          { key: "status", label: "Status", sortable: true, badge: true },
          { key: "created", label: "Created", sortable: true },
          { key: "assignee", label: "Assignee", sortable: true }
        ],
        rows: serviceRequestRows,
        pageSize: 8,
        defaultSort: { key: "id", direction: "asc" }
      }
    };
  }

  if (lower === "/default/vacation/list") {
    return {
      ...base,
      view: "vacation-list",
      title: "Vacation requests",
      table: {
        columns: [
          { key: "period", label: "Period", sortable: true },
          { key: "days", label: "Days", sortable: true },
          { key: "status", label: "Status", sortable: true, badge: true },
          { key: "approver", label: "Approver", sortable: true }
        ],
        rows: vacationRows,
        pageSize: 8,
        defaultSort: { key: "period", direction: "asc" }
      }
    };
  }

  if (lower === "/default/committees/list") {
    return {
      ...base,
      view: "committees-list",
      title: "Committees",
      table: {
        columns: [
          { key: "name", label: "Name", sortable: true },
          { key: "members", label: "Members", sortable: true },
          { key: "lead", label: "Lead", sortable: true },
          { key: "nextMeeting", label: "Next meeting", sortable: true }
        ],
        rows: committeeRows,
        pageSize: 8,
        defaultSort: { key: "name", direction: "asc" }
      }
    };
  }

  if (lower === "/default/office") {
    return {
      ...base,
      view: "office-map",
      title: "Office map",
      details: {
        sections: [
          { label: "Office", value: "Vilnius" },
          { label: "Floor", value: searchParams.get("floorId") || "2" },
          { label: "Room", value: searchParams.get("roomId") || "214" }
        ]
      }
    };
  }

  if (lower === "/default/organizationalstructure") {
    return {
      ...base,
      view: "organizational-structure",
      title: "Organizational structure",
      details: {
        sections: [
          { label: "Departments", value: "14" },
          { label: "Leads", value: "31" },
          { label: "Employees", value: "424" }
        ]
      }
    };
  }

  if (lower === "/default/submitticket") {
    return {
      ...base,
      view: "submit-ticket",
      title: "Submit ticket",
      form: {
        id: "client-submit-ticket-form",
        saveLabel: "Submit",
        fields: [
          { id: "ticket-subject", label: "Subject", type: "text", required: true, value: "" },
          {
            id: "ticket-description",
            label: "Description",
            type: "textarea",
            required: true,
            value: ""
          }
        ]
      }
    };
  }

  return null;
}

function buildAdminPagePayload(pathname: string) {
  const lower = normalizePath(pathname).toLowerCase();
  if (!isPathIn(pathname, "/default/admin")) {
    return null;
  }

  const base = {
    navigation: adminNavigation,
    breadcrumbs: [{ label: "Admin", path: "/default/Admin" }]
  };

  if (lower === "/default/admin/users") {
    return {
      ...base,
      view: "users-list",
      title: "Application users",
      filterPlaceholder: "Search users...",
      table: {
        columns: [
          { key: "fullName", label: "Name", sortable: true, link: true },
          { key: "userName", label: "Username", sortable: true },
          { key: "jobTitle", label: "Job title", sortable: true },
          { key: "skills", label: "Skills", sortable: true },
          { key: "projects", label: "Projects", sortable: true },
          { key: "hasRoom", label: "Has room", sortable: true, badge: true },
          { key: "waitingConfirmation", label: "Waiting confirmation", sortable: true, badge: true },
          { key: "actions", label: "Actions" }
        ],
        rows: adminUsersRows,
        pageSize: 8,
        defaultSort: { key: "fullName", direction: "asc" }
      }
    };
  }

  if (lower === "/default/admin/roles") {
    return {
      ...base,
      view: "roles-list",
      title: "Roles",
      primaryAction: { label: "Create new", path: "/default/Admin/Roles/Create" },
      table: {
        columns: [
          { key: "name", label: "Name", sortable: true },
          { key: "usersCount", label: "Users", sortable: true },
          { key: "actions", label: "Actions" }
        ],
        rows: [
          { id: "role-1", name: "Administrator", usersCount: "4", actions: [{ label: "Edit", path: "/default/Admin/Roles/role-1/Edit" }] },
          { id: "role-2", name: "Wall moderator", usersCount: "7", actions: [{ label: "Edit", path: "/default/Admin/Roles/role-2/Edit" }] },
          { id: "role-3", name: "Office admin", usersCount: "3", actions: [{ label: "Edit", path: "/default/Admin/Roles/role-3/Edit" }] }
        ],
        pageSize: 8,
        defaultSort: { key: "name", direction: "asc" }
      }
    };
  }

  if (isPathIn(pathname, "/default/admin/roles/create", "/default/admin/roles/role")) {
    return {
      ...base,
      view: "roles-manage",
      title: "Roles",
      form: {
        id: "admin-form",
        saveLabel: "Save",
        cancelPath: "/default/Admin/Roles",
        fields: [
          { id: "role-name", label: "Role name", type: "text", required: true, value: "" },
          {
            id: "role-description",
            label: "Description",
            type: "textarea",
            required: false,
            value: ""
          }
        ]
      }
    };
  }

  if (lower === "/default/admin/customization") {
    return {
      ...base,
      view: "customization-grid",
      title: "Customization",
      cards: adminCustomizationCards
    };
  }

  if (lower === "/default/admin/kudosbasket") {
    return {
      ...base,
      view: "kudosbasket-manage",
      title: "Kudos basket administration",
      form: {
        id: "admin-form",
        saveLabel: "Save",
        fields: [
          {
            id: "kudos-basket-title",
            label: "Basket title",
            type: "text",
            required: true,
            value: "Donation basket"
          },
          {
            id: "kudos-basket-description",
            label: "Description",
            type: "textarea",
            required: false,
            value: "Support good causes"
          }
        ]
      },
      donationsTable: {
        columns: [
          { label: "Employee" },
          { label: "Amount" },
          { label: "Date" }
        ],
        rows: kudosBasketDonations
      }
    };
  }

  if (lower === "/default/admin/lotteries/list") {
    return {
      ...base,
      view: "lotteries-list",
      title: "Lotteries",
      primaryAction: { label: "Create new", path: "/default/Admin/Lotteries/Create" },
      table: {
        columns: [
          { key: "title", label: "Title", sortable: true },
          { key: "status", label: "Status", sortable: true, badge: true },
          { key: "endDate", label: "End date", sortable: true },
          { key: "actions", label: "Actions" }
        ],
        rows: adminLotteryRows,
        pageSize: 8,
        defaultSort: { key: "endDate", direction: "desc" }
      }
    };
  }

  if (isPathIn(pathname, "/default/admin/lotteries/lottery-1/refunding")) {
    return {
      ...base,
      view: "lotteries-refunding",
      title: "Lotteries",
      refund: {
        message: "Refund completed",
        failedMessage: "Refund failed",
        actionLabel: "Try refund again",
        cancelPath: "/default/Admin/Lotteries/List"
      }
    };
  }

  return {
    ...base,
    view: "admin-generic",
    title: "Administration",
    subtitle: "Admin route is known but detailed parity for this subsection is in progress."
  };
}

function shouldRenderWallFeed(pathname: string) {
  const lower = normalizePath(pathname).toLowerCase();
  return (
    lower === "/default/wall/feed" ||
    lower === "/default/wall" ||
    lower === "/default/wall/all" ||
    lower === "/wall/feed"
  );
}

function shouldRenderEmployeeList(pathname: string) {
  const lower = normalizePath(pathname).toLowerCase();
  return lower === "/default/employee" || lower === "/default/employee/list";
}

function mergeRuntimeData(base: RuntimeData, override: Partial<RuntimeData>): RuntimeData {
  return {
    ...base,
    ...override,
    auth: {
      ...base.auth,
      ...override.auth
    },
    routeMatch: {
      ...base.routeMatch,
      ...override.routeMatch
    },
    tenantRoute: {
      ...base.tenantRoute,
      ...override.tenantRoute
    },
    shell: {
      ...base.shell,
      ...override.shell
    },
    leftMenu: {
      ...base.leftMenu,
      ...override.leftMenu
    }
  };
}

export function resolveRuntimeDataForUrl(pathnameWithSearch: string): RuntimeData {
  const parsedUrl = new URL(pathnameWithSearch, "http://127.0.0.1");
  const pathname = normalizePath(parsedUrl.pathname || "/");
  const route = `${pathname}${parsedUrl.search}`;
  const routeMatch = resolveLegacyRouteCatchup(pathname);
  const tenantRoute = resolveTenantRoute(pathname, "default");

  const baseRuntimeData = mergeRuntimeData(createBaseRuntimeData() as RuntimeData, {
    route,
    title: "Simoona",
    status: routeMatch.isKnownLegacyRoute ? "ready" : "not_found",
    routeMatch,
    tenantRoute,
    auth: resolveAuthBoundary(true),
    navItems: appNavItems,
    leftMenu: {
      groups: legacyLeftMenuGroups
    },
    shell: {
      userName: "Arturas Nikoncukas",
      notificationCount: 3,
      unreadMessages: 2
    },
    shellMode: "app"
  });

  const authUtilityPage = buildAuthUtilityPagePayload(pathname);
  if (authUtilityPage) {
    return {
      ...baseRuntimeData,
      status: "ready",
      shellMode: "auth",
      authUtilityPage,
      wallFeed: null,
      employeeList: null,
      profilePage: null,
      settingsPage: null,
      clientFeaturePage: null,
      adminPage: null
    };
  }

  const profilePage = buildProfilePagePayload(pathname);
  if (profilePage) {
    return {
      ...baseRuntimeData,
      profilePage
    };
  }

  const settingsPage = buildSettingsPagePayload(pathname);
  if (settingsPage) {
    return {
      ...baseRuntimeData,
      settingsPage
    };
  }

  const adminPage = buildAdminPagePayload(pathname);
  if (adminPage) {
    return {
      ...baseRuntimeData,
      adminPage
    };
  }

  const clientFeaturePage = buildClientFeaturePagePayload(pathname, parsedUrl.searchParams);
  if (clientFeaturePage) {
    return {
      ...baseRuntimeData,
      clientFeaturePage
    };
  }

  if (shouldRenderEmployeeList(pathname)) {
    return {
      ...baseRuntimeData,
      employeeList: createDefaultEmployeeListPayload(employeeRows)
    };
  }

  if (shouldRenderWallFeed(pathname)) {
    return {
      ...baseRuntimeData,
      wallFeed: createDefaultWallFeedPayload(wallFeedPosts)
    };
  }

  return baseRuntimeData;
}

export function readRuntimeDataFromDocument(pathnameWithSearch: string): RuntimeData {
  const fallback = resolveRuntimeDataForUrl(pathnameWithSearch);
  const payloadElement = document.getElementById("simoona-runtime-data");

  if (!(payloadElement instanceof HTMLScriptElement)) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(payloadElement.textContent || "{}") as Partial<RuntimeData>;
    return mergeRuntimeData(fallback, parsed);
  } catch {
    return fallback;
  }
}

export function injectRuntimeDataIntoIndex(indexTemplate: string, runtimeData: RuntimeData): string {
  const payloadJson = JSON.stringify(runtimeData);
  const scriptTag = `<script id="simoona-runtime-data" type="application/json">${payloadJson}</script>`;
  const marker = '<script id="simoona-runtime-data" type="application/json"></script>';

  if (indexTemplate.includes(marker)) {
    return indexTemplate.replace(marker, scriptTag);
  }

  return indexTemplate.replace("</body>", `${scriptTag}\n  </body>`);
}
