export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function normalizePath(pathname: unknown): string {
  const value = String(pathname || "/").trim();
  const collapsed = value.replace(/\/{2,}/g, "/");
  if (collapsed === "/") {
    return "/";
  }
  return collapsed.endsWith("/") ? collapsed.slice(0, -1) : collapsed;
}

export function isPathActive(itemPath: unknown, routePath: unknown): boolean {
  if (typeof itemPath !== "string" || !itemPath || itemPath.startsWith("http")) {
    return false;
  }

  const normalizedItemPath = normalizePath(itemPath).toLowerCase();
  const normalizedRoutePath = normalizePath(routePath).toLowerCase();

  if (normalizedItemPath === normalizedRoutePath) {
    return true;
  }

  return normalizedRoutePath.startsWith(`${normalizedItemPath}/`);
}

export const legacyLeftMenuGroups = [
  {
    id: "walls",
    title: "Walls",
    items: [
      { id: "walls-my", label: "My walls", path: "/default/Wall/Feed" },
      { id: "walls-all", label: "All walls", path: "/default/Wall/All" },
      { id: "walls-official", label: "Official", path: "/default/Wall/Feed?wall=official" },
      { id: "walls-discover", label: "Discover walls", path: "/default/Wall/List" }
    ]
  },
  {
    id: "activities",
    title: "Activities",
    items: [
      { id: "activities-events", label: "Events", path: "/default/Events/List" },
      { id: "activities-kudos", label: "Kudos", path: "/default/Kudos" },
      { id: "activities-request", label: "Service Request", path: "/default/ServiceRequests/List" },
      { id: "activities-books", label: "Books", path: "/default/Books/List" },
      { id: "activities-vacation", label: "Vacation", path: "/default/Vacation" }
    ]
  },
  {
    id: "company",
    title: "Company",
    items: [
      { id: "company-employees", label: "Employees", path: "/default/Employee/List" },
      { id: "company-office", label: "Office Map", path: "/default/Office" },
      {
        id: "company-structure",
        label: "Organizational Structure",
        path: "/default/OrganizationalStructure"
      },
      { id: "company-projects", label: "Projects", path: "/default/Projects/List" },
      { id: "company-committees", label: "Committees", path: "/default/Committees/List" }
    ]
  },
  {
    id: "externals",
    title: "Externals",
    items: [
      { id: "externals-box", label: "The Box", path: "https://example.com/the-box", external: true },
      {
        id: "externals-whistle",
        label: "Whistleblowing kanalas",
        path: "https://example.com/whistleblowing",
        external: true
      },
      {
        id: "externals-guide",
        label: "Important docs",
        path: "https://example.com/docs",
        external: true
      }
    ]
  }
];

export const wallFeedPosts = [
  {
    id: "post-1",
    wallName: "twoday Buzz",
    author: "Vardenis Pavardenis",
    timestamp: "2026-02-17, 13:06",
    content:
      "Su Uzgavenemis! Kad ziema greiciau pasitrauktu, o pavasaris butu siltas ir sauletas, VRK komanda suorganizavo blynus.",
    hashtags: "#Wall #Community",
    likeSummary: "You and 12 others",
    replyCountLabel: "Show all 8 replies",
    likeCount: 12,
    commentCount: 8,
    hasImage: true
  },
  {
    id: "post-2",
    wallName: "twoday Buzz",
    author: "Vardenis Pavardenis",
    timestamp: "2026-02-05, 09:35",
    content:
      "KUDOS LOTERIJA! iPad A16 Wi-Fi, 128 GB. Bilieto kaina: 2 kudos. Bilietus isigyti galite iki 2026-02-13 10:00.",
    hashtags: "#KudosLoterija #KudosKomitetas",
    likeSummary: "You and 7 others",
    replyCountLabel: "Show all 8 replies",
    likeCount: 7,
    commentCount: 3,
    hasImage: false
  }
];

const employeeSeedRows = [
  {
    id: "emp-1",
    fullName: "dummy value",
    birthDate: "05-07",
    jobTitle: "Developer",
    workingHours: "08:00 - 17:00"
  },
  {
    id: "emp-2",
    fullName: "dummy value",
    birthDate: "01-06",
    jobTitle: "Accountant",
    workingHours: "08:00 - 17:00"
  },
  {
    id: "emp-3",
    fullName: "dummy value",
    birthDate: "04-01",
    jobTitle: "JAVA developer",
    workingHours: "08:00 - 17:00"
  },
  {
    id: "emp-4",
    fullName: "dummy value",
    birthDate: "06-02",
    jobTitle: "Finance manager",
    workingHours: "07:00 - 16:00"
  },
  {
    id: "emp-5",
    fullName: "dummy value",
    birthDate: "01-02",
    jobTitle: "Microsoft 365 Admin",
    workingHours: "08:00 - 17:00"
  },
  {
    id: "emp-6",
    fullName: "dummy value",
    birthDate: "11-11",
    jobTitle: "Accountant",
    workingHours: "08:00 - 17:00"
  },
  {
    id: "emp-7",
    fullName: "dummy value",
    birthDate: "07-10",
    jobTitle: "Full-Stack Developer",
    workingHours: "08:00 - 17:00"
  },
  {
    id: "emp-8",
    fullName: "dummy value",
    birthDate: "03-21",
    jobTitle: "QA",
    workingHours: "09:30 - 19:00"
  },
  {
    id: "emp-9",
    fullName: "dummy value",
    birthDate: "05-28",
    jobTitle: ".NET developer",
    workingHours: "00:00 - 00:00"
  },
  {
    id: "emp-10",
    fullName: "dummy value",
    birthDate: "01-22",
    jobTitle: ".NET developer",
    workingHours: "00:00 - 00:00"
  }
];

export const employeeRows = [
  ...employeeSeedRows,
  ...Array.from({ length: 40 }, (_, index) => {
    const rowNumber = index + 11;
    const month = String(((index * 3) % 12) + 1).padStart(2, "0");
    const day = String(((index * 5) % 28) + 1).padStart(2, "0");
    const hourStart = String((index % 3) + 7).padStart(2, "0");
    const hourEnd = String((index % 3) + 16).padStart(2, "0");
    return {
      id: `emp-${String(rowNumber)}`,
      fullName: `dummy value ${String(rowNumber)}`,
      birthDate: `${month}-${day}`,
      jobTitle: `Specialist ${String(rowNumber)}`,
      workingHours: `${hourStart}:00 - ${hourEnd}:00`
    };
  })
];
