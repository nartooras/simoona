import {
  employeeRows,
  legacyLeftMenuGroups,
  normalizePath,
  wallFeedPosts
} from "../runtime-shared";
import { resolveAuthBoundary } from "../../shell/auth-boundary";
import { resolveLegacyRouteCatchup } from "../../shell/legacy-route-catchup";
import { resolveTenantRoute } from "../../shell/tenant-route-container";
import {
  createBaseRuntimeData,
  createDefaultEmployeeListPayload,
  createDefaultTenantLoginPayload,
  createDefaultWallFeedPayload
} from "../../app/runtime-payload";
import type { RuntimeData } from "./contracts";
import {
  adminCustomizationCards,
  adminLotteryRows,
  adminNavigation,
  adminUsersRows,
  appNavItems,
  booksRows,
  clientFeatureNavigationTemplate,
  committeeRows,
  eventReportRows,
  eventRows,
  kudosBasketDonations,
  kudosLogRows,
  profileDetailsModel,
  projectRows,
  serviceRequestRows,
  settingsModel,
  vacationRows,
  wallDiscoverRows,
  wallMembersRows
} from "./fixtures";

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
