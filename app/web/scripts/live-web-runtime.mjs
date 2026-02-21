#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, "..");

const mode = process.argv[2] ?? "dev";
const port = Number(
  process.env.WEB_RUNTIME_PORT ?? (mode === "preview" ? "4173" : "5173")
);

const requiredFiles = [
  path.join(webRoot, "index.html"),
  path.join(webRoot, "vite.config.ts"),
  path.join(webRoot, "src/main.tsx"),
  path.join(webRoot, "src/shell/auth-boundary.ts"),
  path.join(webRoot, "src/shell/legacy-route-catchup.ts"),
  path.join(webRoot, "src/shell/tenant-route-container.ts"),
  path.join(webRoot, "src/shell/top-level-layout.ts")
];

for (const filePath of requiredFiles) {
  if (!fs.existsSync(filePath)) {
    console.error(`[web-runtime] Missing required file: ${filePath}`);
    process.exit(1);
  }
}

if (mode === "build") {
  console.log("[web-runtime] Build/runtime contract checks passed.");
  process.exit(0);
}

const { resolveAuthBoundary } = await import(path.join(webRoot, "src/shell/auth-boundary.ts"));
const { resolveLegacyRouteCatchup } = await import(
  path.join(webRoot, "src/shell/legacy-route-catchup.ts")
);
const { resolveTenantRoute } = await import(
  path.join(webRoot, "src/shell/tenant-route-container.ts")
);
const { createTopLevelLayoutState } = await import(
  path.join(webRoot, "src/shell/top-level-layout.ts")
);

const indexTemplate = fs.readFileSync(path.join(webRoot, "index.html"), "utf8");
const mainModule = fs.readFileSync(path.join(webRoot, "src/main.tsx"), "utf8");

const legacyLeftMenuGroups = [
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

const wallFeedPosts = [
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

const employeeRows = [
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
    weeklyEventsApp: false,
    weeklyEventsEmail: true,
    projectsApp: true,
    projectsEmail: false,
    myPostsApp: true,
    myPostsEmail: true,
    followingPostsApp: true,
    followingPostsEmail: true,
    mentionEmail: true,
    lotteryEmail: false
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
    actions: [
      { label: "Edit", path: "/default/Profiles/2/Edit/personal" },
      { label: "Delete", kind: "danger" }
    ]
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
    actions: [
      { label: "Edit", path: "/default/Profiles/3/Edit/personal" },
      { label: "Delete", kind: "danger" }
    ]
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
    actions: [
      { label: "Edit", path: "/default/Profiles/4/Edit/personal" },
      { label: "Delete", kind: "danger" }
    ]
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
    actions: [
      { label: "Edit", path: "/default/Profiles/5/Edit/personal" },
      { label: "Delete", kind: "danger" }
    ]
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
    actions: [
      { label: "Edit", path: "/default/Profiles/6/Edit/personal" },
      { label: "Delete", kind: "danger" }
    ]
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
    actions: [
      { label: "Edit", path: "/default/Profiles/7/Edit/personal" },
      { label: "Delete", kind: "danger" }
    ]
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
    actions: [
      { label: "Edit", path: "/default/Profiles/8/Edit/personal" },
      { label: "Delete", kind: "danger" }
    ]
  },
  {
    id: "usr-9",
    fullName: "Jona Jonaite",
    fullNamePath: "/default/Profiles/9",
    userName: "jjonaite",
    jobTitle: "Office Coordinator",
    skills: "Office ops",
    projects: "Office map refresh",
    hasRoom: "Yes",
    waitingConfirmation: "No",
    actions: [
      { label: "Edit", path: "/default/Profiles/9/Edit/personal" },
      { label: "Delete", kind: "danger" }
    ]
  },
  {
    id: "usr-10",
    fullName: "Darius Vaitkus",
    fullNamePath: "/default/Profiles/10",
    userName: "dvaitkus",
    jobTitle: "Infrastructure Engineer",
    skills: "Cloudflare, CI/CD",
    projects: "Deploy pipeline",
    hasRoom: "Yes",
    waitingConfirmation: "No",
    actions: [
      { label: "Edit", path: "/default/Profiles/10/Edit/personal" },
      { label: "Delete", kind: "danger" }
    ]
  }
];

const adminRolesRows = [
  {
    id: "role-1",
    name: "Administrator",
    usersCount: "4",
    actions: [
      { label: "Edit", path: "/default/Admin/Roles/role-1/Edit" },
      { label: "Delete", kind: "danger" }
    ]
  },
  {
    id: "role-2",
    name: "Wall moderator",
    usersCount: "7",
    actions: [
      { label: "Edit", path: "/default/Admin/Roles/role-2/Edit" },
      { label: "Delete", kind: "danger" }
    ]
  },
  {
    id: "role-3",
    name: "Office admin",
    usersCount: "3",
    actions: [
      { label: "Edit", path: "/default/Admin/Roles/role-3/Edit" },
      { label: "Delete", kind: "danger" }
    ]
  },
  {
    id: "role-4",
    name: "HR manager",
    usersCount: "5",
    actions: [
      { label: "Edit", path: "/default/Admin/Roles/role-4/Edit" },
      { label: "Delete", kind: "danger" }
    ]
  }
];

const adminRoomTypeRows = [
  {
    id: "rt-1",
    name: "Meeting room",
    color: "#1e9ad7",
    isWorkingRoom: "Yes",
    actions: [
      { label: "Edit", path: "/default/Admin/RoomTypes/rt-1/Edit" },
      { label: "Delete", kind: "danger" }
    ]
  },
  {
    id: "rt-2",
    name: "Quiet zone",
    color: "#53a653",
    isWorkingRoom: "Yes",
    actions: [
      { label: "Edit", path: "/default/Admin/RoomTypes/rt-2/Edit" },
      { label: "Delete", kind: "danger" }
    ]
  },
  {
    id: "rt-3",
    name: "Kitchen",
    color: "#f0ad4e",
    isWorkingRoom: "No",
    actions: [
      { label: "Edit", path: "/default/Admin/RoomTypes/rt-3/Edit" },
      { label: "Delete", kind: "danger" }
    ]
  }
];

const adminOfficeRows = [
  {
    id: "office-1",
    name: "Vilnius HQ",
    country: "Lithuania",
    city: "Vilnius",
    address: "Lvivo g. 37",
    totals: "4/14/120",
    actions: [
      { label: "Floors", path: "/default/Admin/Offices/office-1/Floors" },
      { label: "Edit", path: "/default/Admin/Offices/office-1/Edit" },
      { label: "Delete", kind: "danger" }
    ]
  },
  {
    id: "office-2",
    name: "Kaunas Office",
    country: "Lithuania",
    city: "Kaunas",
    address: "Laisves al. 61",
    totals: "2/8/58",
    actions: [
      { label: "Floors", path: "/default/Admin/Offices/office-2/Floors" },
      { label: "Edit", path: "/default/Admin/Offices/office-2/Edit" },
      { label: "Delete", kind: "danger" }
    ]
  }
];

const adminFloorRowsByOffice = {
  "office-1": [
    {
      id: "floor-1",
      name: "Floor 1",
      map: "Uploaded",
      roomsUsers: "8/65",
      actions: [
        { label: "Rooms", path: "/default/Admin/Offices/office-1/Floors/floor-1/Rooms" },
        { label: "Edit", path: "/default/Admin/Offices/office-1/Floors/floor-1/Edit" },
        { label: "Delete", kind: "danger" }
      ]
    },
    {
      id: "floor-2",
      name: "Floor 2",
      map: "Uploaded",
      roomsUsers: "6/55",
      actions: [
        { label: "Rooms", path: "/default/Admin/Offices/office-1/Floors/floor-2/Rooms" },
        { label: "Edit", path: "/default/Admin/Offices/office-1/Floors/floor-2/Edit" },
        { label: "Delete", kind: "danger" }
      ]
    }
  ],
  "office-2": [
    {
      id: "floor-3",
      name: "Floor A",
      map: "Uploaded",
      roomsUsers: "5/31",
      actions: [
        { label: "Rooms", path: "/default/Admin/Offices/office-2/Floors/floor-3/Rooms" },
        { label: "Edit", path: "/default/Admin/Offices/office-2/Floors/floor-3/Edit" },
        { label: "Delete", kind: "danger" }
      ]
    }
  ]
};

const adminRoomRowsByFloor = {
  "floor-1": [
    { id: "room-1", nameNumber: "Aster 101", employees: "8", actions: [{ label: "Edit" }, { label: "Delete", kind: "danger" }] },
    { id: "room-2", nameNumber: "Basil 104", employees: "6", actions: [{ label: "Edit" }, { label: "Delete", kind: "danger" }] }
  ],
  "floor-2": [
    { id: "room-3", nameNumber: "Cedar 201", employees: "10", actions: [{ label: "Edit" }, { label: "Delete", kind: "danger" }] }
  ],
  "floor-3": [
    { id: "room-4", nameNumber: "Dune A1", employees: "12", actions: [{ label: "Edit" }, { label: "Delete", kind: "danger" }] }
  ]
};

const adminCustomizationCards = [
  { id: "eventtypes", title: "Event types", subtitle: "Manage event categories and visibility.", path: "/default/Admin/Customization/EventTypes", icon: "*" },
  { id: "jobtitles", title: "Job titles", subtitle: "Create and edit job title dictionary.", path: "/default/Admin/Customization/JobTitles", icon: "J" },
  { id: "kudostypes", title: "Kudos types", subtitle: "Define kudos badges and permissions.", path: "/default/Admin/Customization/KudosTypes", icon: "K" },
  { id: "kudosshop", title: "Kudos shop", subtitle: "Configure reward catalog items.", path: "/default/Admin/Customization/KudosShop", icon: "$" },
  { id: "servicerequeststypes", title: "Service request types", subtitle: "Control support categories and SLA labels.", path: "/default/Admin/Customization/ServiceRequestsTypes", icon: "S" },
  { id: "organizationsettings", title: "Organization settings", subtitle: "Maintain organization profile and defaults.", path: "/default/Admin/Customization/OrganizationSettings", icon: "O" },
  { id: "externallinks", title: "External links", subtitle: "Manage sidebar external links and labels.", path: "/default/Admin/Customization/ExternalLinks", icon: "E" }
];

const adminCustomizationRows = {
  eventtypes: [
    {
      id: "evt-1",
      name: "Leisure",
      description: "Company leisure and free-time events",
      actions: [{ label: "Edit", path: "/default/Admin/Customization/EventTypes/Edit/evt-1" }, { label: "Delete", kind: "danger" }]
    },
    {
      id: "evt-2",
      name: "Training",
      description: "Learning and certification sessions",
      actions: [{ label: "Edit", path: "/default/Admin/Customization/EventTypes/Edit/evt-2" }, { label: "Delete", kind: "danger" }]
    }
  ],
  jobtitles: [
    {
      id: "job-1",
      name: "Full-Stack Developer",
      description: "Engineering role",
      actions: [{ label: "Edit", path: "/default/Admin/Customization/JobTitles/Edit/job-1" }, { label: "Delete", kind: "danger" }]
    }
  ],
  kudostypes: [
    {
      id: "kudos-1",
      name: "Team player",
      description: "Collaboration recognition",
      actions: [{ label: "Edit", path: "/default/Admin/Customization/KudosTypes/Edit/kudos-1" }, { label: "Delete", kind: "danger" }]
    }
  ],
  kudosshop: [
    {
      id: "shop-1",
      name: "Gift card 20 EUR",
      description: "General reward",
      actions: [{ label: "Edit", path: "/default/Admin/Customization/KudosShop/Edit/shop-1" }, { label: "Delete", kind: "danger" }]
    }
  ],
  servicerequeststypes: [
    {
      id: "sr-1",
      name: "IT support",
      description: "Hardware and software requests",
      actions: [{ label: "Edit", path: "/default/Admin/Customization/ServiceRequestsTypes/Edit/sr-1" }, { label: "Delete", kind: "danger" }]
    }
  ],
  organizationsettings: [
    {
      id: "org-1",
      name: "Main organization profile",
      description: "Branding, locale, and defaults",
      actions: [{ label: "Edit", path: "/default/Admin/Customization/OrganizationSettings" }]
    }
  ],
  externallinks: [
    {
      id: "ext-1",
      name: "The Box",
      description: "Main external repository",
      actions: [{ label: "Edit", path: "/default/Admin/Customization/ExternalLinks/Edit/ext-1" }, { label: "Delete", kind: "danger" }]
    }
  ]
};

const adminLotteryRows = [
  {
    id: "lottery-1",
    title: "Kudos lottery iPad A16",
    status: "Started",
    endDate: "2026-02-13, 10:00",
    actions: [{ label: "Edit", path: "/default/Admin/Lotteries/lottery-1/Edit" }, { label: "Refund", path: "/default/Admin/Lotteries/lottery-1/Refunding" }]
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

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function normalizePath(pathname) {
  const value = pathname?.trim() || "/";
  const collapsed = value.replace(/\/{2,}/g, "/");
  if (collapsed === "/") {
    return "/";
  }
  return collapsed.endsWith("/") ? collapsed.slice(0, -1) : collapsed;
}

function isEmployeeListRoute(pathname) {
  const normalized = normalizePath(pathname).toLowerCase();
  return normalized.endsWith("/employee") || normalized.endsWith("/employee/list");
}

function isWallFeedRoute(pathname) {
  const normalized = normalizePath(pathname);
  const lower = normalized.toLowerCase();

  if (
    lower.includes("/login") ||
    lower.includes("/register") ||
    lower.includes("/forgot") ||
    lower.includes("/reset")
  ) {
    return false;
  }

  return (
    lower.includes("/wall/feed") ||
    lower.endsWith("/wall") ||
    lower.endsWith("/wall/all") ||
    lower.endsWith("/home")
  );
}

function findSegmentIndex(segments, match) {
  return segments.findIndex((segment) => segment.toLowerCase() === match.toLowerCase());
}

function getPathSegments(pathname) {
  return normalizePath(pathname)
    .split("/")
    .filter(Boolean);
}

function buildWallFeedPayload(pathname) {
  if (!isWallFeedRoute(pathname)) {
    return null;
  }

  return {
    posts: wallFeedPosts,
    rightSidebar: {
      quickActions: [
        { id: "create-post", symbol: "+", title: "Create post" },
        { id: "apps", symbol: "\u25a6", title: "Apps" },
        { id: "basket", symbol: "\u{1F6D2}", title: "Kudos basket" }
      ],
      kudosFeed: [
        { score: "+2", date: "02-18", fullName: "Vardenis Pavardenis", reason: "Saldainiai" },
        { score: "+1", date: "02-17", fullName: "Vardenis Pavardenis 2", reason: "Sokoladas" },
        { score: "+3", date: "02-17", fullName: "Vardenis Pavardenis 3", reason: "Lauktuves" },
        { score: "+5", date: "02-13", fullName: "Vardenis Pavardenis 4", reason: "Naminis tinginys" },
        { score: "+1", date: "02-13", fullName: "Vardenis Pavardenis", reason: "Sausainiai" }
      ],
      widgets: [
        {
          title: "Upcoming events",
          items: [
            "FPV dronu surinkimo workshop'as Nr1 (Leisure)",
            "ISTQB Advanced hub (Hub)",
            "Vaiku Svente 2026 (Leisure)"
          ]
        },
        {
          title: "Most Kudos in 3 months",
          items: ["Vardenis Pavardenis (459)", "Vardenis Pavardenis (250)", "Jona Jonaite (195)"]
        },
        {
          title: "Most Kudos in 12 months",
          items: [
            "Vardenis Pavardenis (741)",
            "Reda Redaitiene (719)",
            "Rytienis Pavardenis (489)"
          ]
        },
        {
          title: "Birthdays",
          items: ["Vanesa - 2026-02-18 (Wednesday)"]
        }
      ]
    }
  };
}

function buildEmployeeListPayload(pathname) {
  if (!isEmployeeListRoute(pathname)) {
    return null;
  }

  return {
    title: "Employee List",
    pageSize: 10,
    rows: employeeRows
  };
}

function buildProfilePagePayload(pathname) {
  const segments = getPathSegments(pathname);
  const profilesSegmentIndex = findSegmentIndex(segments, "Profiles");
  if (profilesSegmentIndex < 0) {
    return null;
  }

  const profileIdSegment = segments[profilesSegmentIndex + 1];
  const profileId =
    profileIdSegment && profileIdSegment.toLowerCase() !== "list" ? profileIdSegment : "1";

  const isEditRoute =
    typeof segments[profilesSegmentIndex + 2] === "string" &&
    segments[profilesSegmentIndex + 2].toLowerCase() === "edit";
  const tabSegment = (segments[profilesSegmentIndex + 3] || "personal").toLowerCase();
  const activeTab = ["personal", "job", "office", "blacklist"].includes(tabSegment)
    ? tabSegment
    : "personal";

  return {
    mode: isEditRoute ? "edit" : "details",
    profileId,
    details: profileDetailsModel,
    edit: {
      activeTab,
      tabs: [
        { id: "personal", label: "User info" },
        { id: "job", label: "Job info" },
        { id: "office", label: "Office info" },
        { id: "blacklist", label: "Blacklist info" }
      ],
      personal: {
        firstName: "Arturas",
        lastName: "Nikoncukas",
        email: "arturas.nikoncukas@example.com",
        phoneNumber: "37060000001",
        birthday: "1990-05-07",
        bio: profileDetailsModel.bio
      },
      job: {
        manager: "Vardenis Pavardenis",
        projects: ["Modernization", "Intranet Platform"],
        jobTitle: "Full-Stack Developer",
        qualification: "Senior",
        fullTime: "Yes",
        workingHoursFrom: "08:00",
        workingHoursTo: "17:00",
        lunchFrom: "12:00",
        lunchTo: "13:00",
        employmentDate: "2022-09-01",
        exams: ["AZ-204", "ISTQB"]
      },
      office: {
        office: "Vilnius Office",
        floor: "2",
        room: "214"
      },
      blacklist: {
        endDate: "2026-03-01",
        reason: "Policy cooldown period",
        createdBy: profileDetailsModel.blacklist.createdBy,
        modifiedBy: profileDetailsModel.blacklist.modifiedBy
      }
    }
  };
}

function buildSettingsPagePayload(pathname) {
  const segments = getPathSegments(pathname);
  const settingsSegmentIndex = findSegmentIndex(segments, "Settings");
  if (settingsSegmentIndex < 0) {
    return null;
  }

  const tabSegment = (segments[settingsSegmentIndex + 1] || "general").toLowerCase();
  const activeTab = ["general", "notifications", "providers"].includes(tabSegment)
    ? tabSegment
    : "general";

  return {
    activeTab,
    tabs: settingsModel.tabs,
    general: settingsModel.general,
    notifications: settingsModel.notifications,
    providers: settingsModel.providers
  };
}

function buildAuthUtilityPagePayload(pathname, routeMatch) {
  const normalized = normalizePath(pathname);
  const lower = normalized.toLowerCase();
  const segments = getPathSegments(pathname);
  const tenantId = segments[0] || "default";
  const isTenantHome =
    segments.length === 1 &&
    !["login", "account", "redirectto"].includes((segments[0] || "").toLowerCase());
  const tenantRouteHead = (segments[1] || "").toLowerCase();
  const tenantAuthBase = `/${tenantId}`;

  if (normalized === "/" || lower === "/login") {
    return {
      shellMode: "auth",
      view: "public-login",
      title: "Sign in",
      subtitle: "Continue with your organization name",
      form: {
        id: "auth-public-login-form",
        submitLabel: "Continue",
        submitSuccessMessage: "Organization found. Redirecting to sign in page...",
        fields: [
          {
            id: "organizationName",
            label: "Organization",
            type: "text",
            placeholder: "Enter organization name",
            required: true,
            value: ""
          }
        ]
      }
    };
  }

  if (lower.startsWith("/redirectto/")) {
    return {
      shellMode: "auth",
      view: "redirect",
      title: "Redirecting",
      subtitle: "Switching route",
      message: `Redirect target: ${decodeURIComponent(segments[1] || "home")}`,
      links: [{ label: "Go to wall feed", path: "/default/Wall/Feed", kind: "primary" }]
    };
  }

  if (
    isTenantHome ||
    tenantRouteHead === "login" ||
    routeMatch?.routeKey === "tenant.root" ||
    routeMatch?.routeKey === "tenant.home" ||
    routeMatch?.routeKey === "client.root"
  ) {
    return {
      shellMode: "auth",
      view: "tenant-login",
      title: `Sign in to ${tenantId}`,
      subtitle: "Use your internal account or provider",
      organizationName: tenantId,
      form: {
        id: "auth-tenant-login-form",
        submitLabel: "Login",
        submitSuccessMessage: "Login validated. Redirecting...",
        fields: [
          {
            id: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter email address",
            required: true,
            value: ""
          },
          {
            id: "password",
            label: "Password",
            type: "password",
            placeholder: "Enter password",
            required: true,
            value: ""
          }
        ]
      },
      links: [
        { label: "Forgot password", path: `${tenantAuthBase}/Forgot`, kind: "link" },
        { label: "Register", path: `${tenantAuthBase}/Register`, kind: "secondary" }
      ],
      providers: [
        { id: "google", label: "Sign in with Google" },
        { id: "microsoft", label: "Sign in with Microsoft" }
      ]
    };
  }

  if (tenantRouteHead === "register") {
    return {
      shellMode: "auth",
      view: "register",
      title: "Register",
      subtitle: `Create account in ${tenantId}`,
      form: {
        id: "auth-register-form",
        submitLabel: "Register",
        submitSuccessMessage: "Registration request submitted.",
        fields: [
          { id: "firstName", label: "First name", type: "text", placeholder: "Enter first name", required: true, value: "" },
          { id: "lastName", label: "Last name", type: "text", placeholder: "Enter last name", required: true, value: "" },
          { id: "email", label: "Email", type: "email", placeholder: "Enter email address", required: true, value: "" },
          { id: "password", label: "Password", type: "password", placeholder: "Enter password", required: true, value: "" },
          {
            id: "repeatedPassword",
            label: "Confirm password",
            type: "password",
            placeholder: "Confirm password",
            required: true,
            value: ""
          }
        ]
      },
      links: [{ label: "Back to login", path: `${tenantAuthBase}/Login`, kind: "secondary" }]
    };
  }

  if (tenantRouteHead === "forgot") {
    return {
      shellMode: "auth",
      view: "forgot",
      title: "Password reset",
      subtitle: "Enter email to receive password reset instructions",
      form: {
        id: "auth-forgot-form",
        submitLabel: "Reset",
        submitSuccessMessage: "Password reset email sent.",
        fields: [
          { id: "email", label: "Email", type: "email", placeholder: "Enter email address", required: true, value: "" }
        ]
      },
      links: [{ label: "Back to login", path: `${tenantAuthBase}/Login`, kind: "secondary" }]
    };
  }

  if (tenantRouteHead === "reset") {
    return {
      shellMode: "auth",
      view: "reset",
      title: "Change password",
      subtitle: "Set a new password for your account",
      form: {
        id: "auth-reset-form",
        submitLabel: "Change password",
        submitSuccessMessage: "Password changed successfully.",
        fields: [
          { id: "password", label: "New password", type: "password", placeholder: "New password", required: true, value: "" },
          {
            id: "confirmPassword",
            label: "Confirm password",
            type: "password",
            placeholder: "Confirm password",
            required: true,
            value: ""
          }
        ]
      },
      links: [{ label: "Back to login", path: `${tenantAuthBase}/Login`, kind: "secondary" }]
    };
  }

  if (tenantRouteHead === "verify") {
    return {
      shellMode: "auth",
      view: "verify",
      title: "Email verification",
      subtitle: "Verification complete",
      alert: {
        kind: "success",
        message: "Email verified successfully. You can sign in now."
      },
      links: [{ label: "Continue to login", path: `${tenantAuthBase}/Login`, kind: "primary" }]
    };
  }

  if (tenantRouteHead === "logoff") {
    return {
      shellMode: "auth",
      view: "logoff",
      title: "Signed out",
      subtitle: "Session ended successfully",
      alert: {
        kind: "info",
        message: "You have been logged off."
      },
      links: [{ label: "Sign in again", path: `${tenantAuthBase}/Login`, kind: "primary" }]
    };
  }

  if (tenantRouteHead === "accessdenied") {
    return {
      shellMode: "auth",
      view: "access-denied",
      title: "Access denied",
      subtitle: "You do not have enough permissions to open this page.",
      alert: {
        kind: "danger",
        message: "Request was denied by authorization rules."
      },
      links: [{ label: "Back to wall feed", path: `${tenantAuthBase}/Wall/Feed`, kind: "secondary" }]
    };
  }

  if (tenantRouteHead === "pagenotfound") {
    return {
      shellMode: "auth",
      view: "page-not-found",
      title: "404",
      subtitle: "Requested page not found.",
      links: [{ label: "Back to wall feed", path: `${tenantAuthBase}/Wall/Feed`, kind: "secondary" }]
    };
  }

  if (tenantRouteHead === "error") {
    const errorCode = segments[2] || "500";
    return {
      shellMode: "auth",
      view: "error",
      title: "Unexpected error",
      subtitle: `Error code: ${errorCode}`,
      alert: {
        kind: "danger",
        message: "The requested operation failed."
      },
      links: [{ label: "Back to wall feed", path: `${tenantAuthBase}/Wall/Feed`, kind: "secondary" }]
    };
  }

  return null;
}

function buildAdminPagePayload(pathname) {
  const segments = getPathSegments(pathname);
  const adminSegmentIndex = findSegmentIndex(segments, "Admin");
  if (adminSegmentIndex < 0) {
    return null;
  }

  const tenantSegment = segments[0] || "default";
  const adminBasePath = `/${tenantSegment}/Admin`;
  const sectionSegment = (segments[adminSegmentIndex + 1] || "").toLowerCase();
  const defaults = {
    navigation: adminNavigation.map((item) => ({
      ...item,
      path: item.path.replace("/default/", `/${tenantSegment}/`)
    }))
  };

  if (!sectionSegment) {
    return {
      ...defaults,
      section: "root",
      view: "dashboard",
      title: "Administration",
      subtitle: "Manage users, organization settings, and admin modules.",
      breadcrumbs: [{ label: "Admin" }],
      cards: defaults.navigation.map((item) => ({
        id: item.id,
        title: item.label,
        subtitle: `Open ${item.label.toLowerCase()} administration`,
        path: item.path,
        icon: "+"
      }))
    };
  }

  if (sectionSegment === "users") {
    return {
      ...defaults,
      section: "users",
      view: "users-list",
      title: "Application users",
      breadcrumbs: [{ label: "Admin", path: adminBasePath }, { label: "Users" }],
      filterPlaceholder: "Type to filter list...",
      primaryAction: {
        label: "Generate Excel",
        type: "button",
        id: "admin-generate-excel"
      },
      table: {
        columns: [
          { key: "fullName", label: "First name, Last name", sortable: true, link: true },
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

  if (sectionSegment === "roles") {
    const actionSegment = (segments[adminSegmentIndex + 2] || "").toLowerCase();
    const maybeId = segments[adminSegmentIndex + 2] || "role-1";
    const isEdit = (segments[adminSegmentIndex + 3] || "").toLowerCase() === "edit";

    if (actionSegment === "create" || isEdit) {
      return {
        ...defaults,
        section: "roles",
        view: "roles-manage",
        mode: actionSegment === "create" ? "create" : "edit",
        title: "Roles",
        subtitle: actionSegment === "create" ? "Create role" : `Edit role: ${maybeId}`,
        breadcrumbs: [
          { label: "Admin", path: adminBasePath },
          { label: "Roles", path: `${adminBasePath}/Roles` },
          { label: actionSegment === "create" ? "Create" : "Edit" }
        ],
        form: {
          saveLabel: "Save",
          cancelPath: `${adminBasePath}/Roles`,
          fields: [
            {
              id: "role-name",
              label: "Name",
              type: "text",
              required: true,
              value: actionSegment === "create" ? "" : "Administrator"
            },
            {
              id: "role-permission-scope",
              label: "Default permission scope",
              type: "select",
              value: "admin",
              options: [
                { value: "admin", label: "Administration permissions" },
                { value: "basic", label: "Basic permissions" },
                { value: "none", label: "No permissions" }
              ]
            },
            {
              id: "role-users",
              label: "Users",
              type: "text",
              value: "Arturas Nikoncukas, Vardenis Pavardenis"
            }
          ]
        }
      };
    }

    return {
      ...defaults,
      section: "roles",
      view: "roles-list",
      title: "Roles",
      breadcrumbs: [{ label: "Admin", path: adminBasePath }, { label: "Roles" }],
      filterPlaceholder: "Type to filter list...",
      primaryAction: { label: "Create new", path: `${adminBasePath}/Roles/Create` },
      table: {
        columns: [
          { key: "name", label: "Role name", sortable: true },
          { key: "usersCount", label: "Users", sortable: true },
          { key: "actions", label: "Actions" }
        ],
        rows: adminRolesRows,
        pageSize: 8,
        defaultSort: { key: "name", direction: "asc" }
      }
    };
  }

  if (sectionSegment === "roomtypes") {
    const actionSegment = (segments[adminSegmentIndex + 2] || "").toLowerCase();
    const isEdit = (segments[adminSegmentIndex + 3] || "").toLowerCase() === "edit";
    if (actionSegment === "create" || isEdit) {
      return {
        ...defaults,
        section: "roomtypes",
        view: "roomtypes-manage",
        mode: actionSegment === "create" ? "create" : "edit",
        title: "Room types",
        subtitle: actionSegment === "create" ? "Create room type" : "Edit room type",
        breadcrumbs: [
          { label: "Admin", path: adminBasePath },
          { label: "Room types", path: `${adminBasePath}/RoomTypes` },
          { label: actionSegment === "create" ? "Create" : "Edit" }
        ],
        form: {
          saveLabel: "Save",
          cancelPath: `${adminBasePath}/RoomTypes`,
          fields: [
            {
              id: "roomtype-name",
              label: "Name",
              type: "text",
              required: true,
              value: actionSegment === "create" ? "" : "Meeting room"
            },
            { id: "roomtype-color", label: "Color", type: "color", value: "#1e9ad7" },
            {
              id: "roomtype-working",
              label: "Is working room",
              type: "checkbox",
              checked: true
            }
          ]
        }
      };
    }

    return {
      ...defaults,
      section: "roomtypes",
      view: "roomtypes-list",
      title: "Room types",
      breadcrumbs: [{ label: "Admin", path: adminBasePath }, { label: "Room types" }],
      filterPlaceholder: "Type to filter list...",
      primaryAction: { label: "Create new", path: `${adminBasePath}/RoomTypes/Create` },
      table: {
        columns: [
          { key: "name", label: "Name", sortable: true },
          { key: "color", label: "Color", sortable: true, colorSwatch: true },
          { key: "isWorkingRoom", label: "Is working room", sortable: true, badge: true },
          { key: "actions", label: "Actions" }
        ],
        rows: adminRoomTypeRows,
        pageSize: 8,
        defaultSort: { key: "name", direction: "asc" }
      }
    };
  }

  if (sectionSegment === "offices") {
    const pathA = (segments[adminSegmentIndex + 2] || "").toLowerCase();
    const pathB = (segments[adminSegmentIndex + 3] || "").toLowerCase();
    const pathC = (segments[adminSegmentIndex + 4] || "").toLowerCase();
    const pathD = (segments[adminSegmentIndex + 5] || "").toLowerCase();
    const officeId = segments[adminSegmentIndex + 2] || "office-1";
    const floorId = segments[adminSegmentIndex + 4] || "floor-1";

    if (pathA === "create" || pathB === "edit") {
      return {
        ...defaults,
        section: "offices",
        view: "offices-manage",
        mode: pathA === "create" ? "create" : "edit",
        title: "Offices",
        subtitle: pathA === "create" ? "Create office" : "Edit office",
        breadcrumbs: [
          { label: "Admin", path: adminBasePath },
          { label: "Offices", path: `${adminBasePath}/Offices` },
          { label: pathA === "create" ? "Create" : "Edit" }
        ],
        form: {
          saveLabel: "Save",
          cancelPath: `${adminBasePath}/Offices`,
          fields: [
            { id: "office-name", label: "Name", type: "text", required: true, value: "Vilnius HQ" },
            { id: "office-country", label: "Country", type: "text", required: true, value: "Lithuania" },
            { id: "office-city", label: "City", type: "text", value: "Vilnius" },
            { id: "office-street", label: "Street", type: "text", value: "Lvivo g." },
            { id: "office-building", label: "Building", type: "text", value: "37A" },
            { id: "office-default", label: "Is default", type: "checkbox", checked: true }
          ]
        }
      };
    }

    if (pathB === "floors" && (pathC === "create" || pathD === "edit")) {
      return {
        ...defaults,
        section: "offices",
        view: "floors-manage",
        mode: pathC === "create" ? "create" : "edit",
        title: "Floors",
        subtitle: pathC === "create" ? "Create floor" : "Edit floor",
        breadcrumbs: [
          { label: "Admin", path: adminBasePath },
          { label: "Offices", path: `${adminBasePath}/Offices` },
          { label: "Floors", path: `${adminBasePath}/Offices/${officeId}/Floors` },
          { label: pathC === "create" ? "Create" : "Edit" }
        ],
        form: {
          saveLabel: "Save",
          cancelPath: `${adminBasePath}/Offices/${officeId}/Floors`,
          fields: [
            { id: "floor-name", label: "Name", type: "text", required: true, value: "Floor 2" },
            {
              id: "floor-map",
              label: "Map",
              type: "text",
              value: "office-floor-2-map.png",
              required: pathC === "create"
            }
          ]
        }
      };
    }

    if (pathB === "floors" && pathD === "rooms") {
      const rows = adminRoomRowsByFloor[floorId] || adminRoomRowsByFloor["floor-1"];
      return {
        ...defaults,
        section: "offices",
        view: "rooms-list",
        title: "Rooms",
        subtitle: `Office ${officeId} / Floor ${floorId}`,
        breadcrumbs: [
          { label: "Admin", path: adminBasePath },
          { label: "Offices", path: `${adminBasePath}/Offices` },
          { label: "Floors", path: `${adminBasePath}/Offices/${officeId}/Floors` },
          { label: "Rooms" }
        ],
        filterPlaceholder: "Type to filter list...",
        primaryAction: { label: "Create new", type: "button", id: "admin-room-create" },
        table: {
          columns: [
            { key: "nameNumber", label: "Name / Number", sortable: true },
            { key: "employees", label: "Employees", sortable: true },
            { key: "actions", label: "Actions" }
          ],
          rows,
          pageSize: 8,
          defaultSort: { key: "nameNumber", direction: "asc" }
        }
      };
    }

    if (pathB === "floors") {
      const rows = adminFloorRowsByOffice[officeId] || adminFloorRowsByOffice["office-1"];
      return {
        ...defaults,
        section: "offices",
        view: "floors-list",
        title: "Floors",
        subtitle: `Office ${officeId}`,
        breadcrumbs: [
          { label: "Admin", path: adminBasePath },
          { label: "Offices", path: `${adminBasePath}/Offices` },
          { label: "Floors" }
        ],
        filterPlaceholder: "Type to filter list...",
        primaryAction: { label: "Create new", path: `${adminBasePath}/Offices/${officeId}/Floors/Create` },
        table: {
          columns: [
            { key: "name", label: "Name", sortable: true },
            { key: "map", label: "Map", sortable: true },
            { key: "roomsUsers", label: "Rooms/Employees", sortable: true },
            { key: "actions", label: "Actions" }
          ],
          rows,
          pageSize: 8,
          defaultSort: { key: "name", direction: "asc" }
        }
      };
    }

    return {
      ...defaults,
      section: "offices",
      view: "offices-list",
      title: "Offices",
      breadcrumbs: [{ label: "Admin", path: adminBasePath }, { label: "Offices" }],
      filterPlaceholder: "Type to filter list...",
      primaryAction: { label: "Create new", path: `${adminBasePath}/Offices/Create` },
      table: {
        columns: [
          { key: "name", label: "Name", sortable: true },
          { key: "country", label: "Country", sortable: true },
          { key: "city", label: "City", sortable: true },
          { key: "address", label: "Street / Building", sortable: true },
          { key: "totals", label: "Floors/Rooms/Employees", sortable: true },
          { key: "actions", label: "Actions" }
        ],
        rows: adminOfficeRows,
        pageSize: 8,
        defaultSort: { key: "name", direction: "asc" }
      }
    };
  }

  if (sectionSegment === "customization") {
    const subSection = (segments[adminSegmentIndex + 2] || "").toLowerCase();
    const actionSegment = (segments[adminSegmentIndex + 3] || "").toLowerCase();
    const entityId = segments[adminSegmentIndex + 4] || "";

    if (!subSection) {
      return {
        ...defaults,
        section: "customization",
        view: "customization-list",
        title: "Customization",
        breadcrumbs: [{ label: "Admin", path: adminBasePath }, { label: "Customization" }],
        cards: adminCustomizationCards.map((item) => ({
          ...item,
          path: item.path.replace("/default/", `/${tenantSegment}/`)
        }))
      };
    }

    const selectedCard =
      adminCustomizationCards.find((item) => item.id === subSection) || adminCustomizationCards[0];
    const listRows =
      adminCustomizationRows[subSection] || adminCustomizationRows[selectedCard.id] || [];

    if (actionSegment === "create" || actionSegment === "edit") {
      const selectedRow =
        listRows.find((row) => row.id === entityId) || listRows[0] || { name: "", description: "" };
      return {
        ...defaults,
        section: "customization",
        view: "customization-manage",
        mode: actionSegment === "create" ? "create" : "edit",
        title: selectedCard.title,
        subtitle: actionSegment === "create" ? "Create item" : "Edit item",
        breadcrumbs: [
          { label: "Admin", path: adminBasePath },
          { label: "Customization", path: `${adminBasePath}/Customization` },
          { label: selectedCard.title, path: `${adminBasePath}/Customization/${segments[adminSegmentIndex + 2] || ""}` },
          { label: actionSegment === "create" ? "Create" : "Edit" }
        ],
        form: {
          saveLabel: "Save",
          cancelPath: `${adminBasePath}/Customization/${segments[adminSegmentIndex + 2] || ""}`,
          fields: [
            {
              id: "customization-name",
              label: "Name",
              type: "text",
              required: true,
              value: actionSegment === "create" ? "" : selectedRow.name
            },
            {
              id: "customization-description",
              label: "Description",
              type: "textarea",
              value: actionSegment === "create" ? "" : selectedRow.description
            },
            {
              id: "customization-active",
              label: "Visible",
              type: "checkbox",
              checked: true
            }
          ]
        }
      };
    }

    return {
      ...defaults,
      section: "customization",
      view: "customization-items-list",
      title: selectedCard.title,
      subtitle: selectedCard.subtitle,
      breadcrumbs: [
        { label: "Admin", path: adminBasePath },
        { label: "Customization", path: `${adminBasePath}/Customization` },
        { label: selectedCard.title }
      ],
      filterPlaceholder: "Type to filter list...",
      primaryAction: {
        label: "Create new",
        path: `${adminBasePath}/Customization/${segments[adminSegmentIndex + 2] || ""}/Create`
      },
      table: {
        columns: [
          { key: "name", label: "Name", sortable: true },
          { key: "description", label: "Description", sortable: true },
          { key: "actions", label: "Actions" }
        ],
        rows: listRows,
        pageSize: 8,
        defaultSort: { key: "name", direction: "asc" }
      }
    };
  }

  if (sectionSegment === "kudosbasket") {
    return {
      ...defaults,
      section: "kudosbasket",
      view: "kudosbasket-manage",
      title: "Kudos basket administration",
      breadcrumbs: [{ label: "Admin", path: adminBasePath }, { label: "Kudos basket" }],
      form: {
        saveLabel: "Save",
        cancelPath: `${adminBasePath}`,
        dangerActionLabel: "Delete",
        fields: [
          { id: "kudos-basket-title", label: "Title", type: "text", required: true, value: "Donation basket" },
          {
            id: "kudos-basket-description",
            label: "Description",
            type: "textarea",
            value: "Share kudos to support social initiatives."
          },
          {
            id: "kudos-basket-active",
            label: "Widget is active",
            type: "checkbox",
            checked: true
          }
        ]
      },
      donationsTable: {
        columns: [
          { key: "fullName", label: "Name surname" },
          { key: "amount", label: "Amount" },
          { key: "date", label: "Date" }
        ],
        rows: kudosBasketDonations
      }
    };
  }

  if (sectionSegment === "lotteries") {
    const routeA = (segments[adminSegmentIndex + 2] || "").toLowerCase();
    const routeB = (segments[adminSegmentIndex + 3] || "").toLowerCase();
    const lotteryId = segments[adminSegmentIndex + 2] || "lottery-1";

    if (routeA === "create" || routeB === "edit") {
      return {
        ...defaults,
        section: "lotteries",
        view: "lotteries-manage",
        mode: routeA === "create" ? "create" : "edit",
        title: "Lotteries",
        subtitle: routeA === "create" ? "Create lottery" : `Edit lottery ${lotteryId}`,
        breadcrumbs: [
          { label: "Admin", path: adminBasePath },
          { label: "Lotteries", path: `${adminBasePath}/Lotteries/List` },
          { label: routeA === "create" ? "Create" : "Edit" }
        ],
        form: {
          saveLabel: routeA === "create" ? "Start" : "Update",
          cancelPath: `${adminBasePath}/Lotteries/List`,
          fields: [
            { id: "lottery-title", label: "Lottery title", type: "text", required: true, value: "Kudos lottery iPad A16" },
            { id: "lottery-entry-fee", label: "Entry fee", type: "number", required: true, value: "2" },
            { id: "lottery-end-date", label: "End date", type: "date", required: true, value: "2026-03-01" },
            { id: "lottery-end-time", label: "End time", type: "time", required: true, value: "10:00" },
            {
              id: "lottery-description",
              label: "Description",
              type: "textarea",
              value: "Lottery entry with kudos points."
            },
            {
              id: "lottery-gifting",
              label: "Allow gifting tickets",
              type: "checkbox",
              checked: true
            }
          ]
        }
      };
    }

    if (routeB === "refunding") {
      return {
        ...defaults,
        section: "lotteries",
        view: "lotteries-refund",
        title: "Lotteries",
        subtitle: "Refunding",
        breadcrumbs: [
          { label: "Admin", path: adminBasePath },
          { label: "Lotteries", path: `${adminBasePath}/Lotteries/List` },
          { label: "Refunding" }
        ],
        refund: {
          message: "Refund completed successfully.",
          failedMessage: "Refund failed. Please retry.",
          actionLabel: "Refund",
          cancelPath: `${adminBasePath}/Lotteries/List`
        }
      };
    }

    return {
      ...defaults,
      section: "lotteries",
      view: "lotteries-list",
      title: "Lotteries",
      breadcrumbs: [{ label: "Admin", path: adminBasePath }, { label: "Lotteries" }],
      filterPlaceholder: "Type to filter list...",
      primaryAction: { label: "Create new", path: `${adminBasePath}/Lotteries/Create` },
      table: {
        columns: [
          { key: "title", label: "Lottery title", sortable: true },
          { key: "status", label: "Status", sortable: true },
          { key: "endDate", label: "End date", sortable: true },
          { key: "actions", label: "Actions" }
        ],
        rows: adminLotteryRows,
        pageSize: 8,
        defaultSort: { key: "title", direction: "asc" }
      }
    };
  }

  return {
    ...defaults,
    section: "unknown",
    view: "unknown",
    title: "Administration",
    subtitle: "Admin route is known but detailed parity for this subsection is in progress.",
    breadcrumbs: [{ label: "Admin", path: adminBasePath }, { label: "Unknown route" }]
  };
}

function renderIndexForRoute(pathname) {
  const isAuthenticated = pathname.toLowerCase() !== "/account/login";
  const layout = createTopLevelLayoutState(false);
  const auth = resolveAuthBoundary(isAuthenticated);
  const routeMatch = resolveLegacyRouteCatchup(pathname);
  const tenantRoute = resolveTenantRoute(pathname, "default");
  const wallFeed = buildWallFeedPayload(pathname);
  const employeeList = buildEmployeeListPayload(pathname);
  const profilePage = buildProfilePagePayload(pathname);
  const settingsPage = buildSettingsPagePayload(pathname);
  const adminPage = buildAdminPagePayload(pathname);
  const authUtilityPage = buildAuthUtilityPagePayload(pathname, routeMatch);
  const shellMode = authUtilityPage?.shellMode || "app";
  const runtimePayload = {
    route: pathname,
    title: layout.title,
    status: routeMatch.isKnownLegacyRoute ? "ready" : "not_found",
    navItems: shellMode === "auth" ? [] : layout.navItems,
    auth,
    routeMatch,
    tenantRoute,
    shellMode,
    motion: layout.motion,
    shell: {
      userName: shellMode === "auth" ? "" : "Arturas Nikoncukas",
      notificationCount: shellMode === "auth" ? 0 : 18,
      unreadMessages: shellMode === "auth" ? 0 : 1
    },
    leftMenu: {
      groups: shellMode === "auth" ? [] : legacyLeftMenuGroups
    },
    wallFeed,
    employeeList,
    profilePage,
    settingsPage,
    adminPage,
    authUtilityPage
  };

  return indexTemplate.replace(
    '<script id="simoona-runtime-data" type="application/json"></script>',
    `<script id="simoona-runtime-data" type="application/json">${JSON.stringify(
      runtimePayload
    )}</script>`
  );
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://127.0.0.1:${String(port)}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === "/healthz" || pathname === "/readyz") {
    sendJson(response, 200, {
      status: "ok",
      service: "simoona-web-runtime",
      checkedAtUtc: new Date().toISOString()
    });
    return;
  }

  if (pathname === "/src/main.tsx") {
    response.writeHead(200, {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "no-store"
    });
    response.end(mainModule);
    return;
  }

  if (resolveLegacyRouteCatchup(pathname).isKnownLegacyRoute || pathname === "/") {
    response.writeHead(200, {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store"
    });
    response.end(renderIndexForRoute(pathname));
    return;
  }

  response.writeHead(404, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end(renderIndexForRoute(pathname));
});

server.listen(port, "127.0.0.1", () => {
  console.log(`[web-runtime] ${mode} server listening at http://127.0.0.1:${String(port)}`);
});

const shutdown = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
