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
  path.join(webRoot, "src/runtime/runtime-shared.js"),
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
  const distDir = path.join(webRoot, "dist");
  const srcDir = path.join(webRoot, "src");
  const sourceIndexPath = path.join(webRoot, "index.html");
  const sourceMainPath = path.join(webRoot, "src/main.tsx");
  const targetIndexPath = path.join(distDir, "index.html");
  const targetMainPath = path.join(distDir, "main.js");
  const redirectsPath = path.join(distDir, "_redirects");

  const sourceIndex = fs.readFileSync(sourceIndexPath, "utf8");
  const sourceMain = fs.readFileSync(sourceMainPath, "utf8");
  const builtIndex = sourceIndex.replace(
    'src="/src/main.tsx"',
    'src="/main.js"'
  );

  fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(targetIndexPath, builtIndex, "utf8");
  fs.writeFileSync(targetMainPath, sourceMain, "utf8");
  fs.writeFileSync(redirectsPath, "/* /index.html 200\n", "utf8");

  function copyRuntimeModules(sourceDir, targetDir) {
    for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
      const sourcePath = path.join(sourceDir, entry.name);
      const relativePath = path.relative(srcDir, sourcePath);
      const targetPath = path.join(targetDir, relativePath);

      if (entry.isDirectory()) {
        copyRuntimeModules(sourcePath, targetDir);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      if (!entry.name.endsWith(".js") && !entry.name.endsWith(".mjs")) {
        continue;
      }

      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.copyFileSync(sourcePath, targetPath);
    }
  }

  copyRuntimeModules(srcDir, distDir);

  console.log(
    `[web-runtime] Build/runtime contract checks passed. Exported static bundle + runtime modules to ${distDir}.`
  );
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
const runtimeSharedModule = await import(path.join(webRoot, "src/runtime/runtime-shared.js"));
const {
  legacyLeftMenuGroups,
  wallFeedPosts,
  employeeRows,
  normalizePath
} = runtimeSharedModule;

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

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
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

function withTenantPath(path, tenantSegment) {
  if (!path) {
    return path;
  }

  return path.replace(/^\/default(?=\/|$)/, `/${tenantSegment}`);
}

function withTenantNavigation(tenantSegment) {
  return clientFeatureNavigationTemplate.map((item) => ({
    ...item,
    path: withTenantPath(item.path, tenantSegment)
  }));
}

function withTenantActions(actions, tenantSegment) {
  if (!Array.isArray(actions)) {
    return [];
  }

  return actions.map((action) => ({
    ...action,
    path: withTenantPath(action.path, tenantSegment)
  }));
}

function withTenantRows(rows, tenantSegment) {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows.map((row) => {
    const next = { ...row };
    if (row.actions) {
      next.actions = withTenantActions(row.actions, tenantSegment);
    }
    for (const key of Object.keys(next)) {
      if (key.endsWith("Path") && typeof next[key] === "string") {
        next[key] = withTenantPath(next[key], tenantSegment);
      }
    }
    return next;
  });
}

function buildClientFeaturePagePayload(pathname) {
  const segments = getPathSegments(pathname);
  if (segments.length < 2) {
    return null;
  }

  const tenantSegment = segments[0] || "default";
  const basePath = `/${tenantSegment}`;
  const section = (segments[1] || "").toLowerCase();
  const subSection = (segments[2] || "").toLowerCase();
  const defaults = {
    shellMode: "app",
    navigation: withTenantNavigation(tenantSegment)
  };

  if (section === "wall") {
    if (subSection === "create" || (subSection === "edit" && segments[3])) {
      return {
        ...defaults,
        domain: "wall",
        view: "wall-manage",
        title: "Discover walls",
        subtitle: subSection === "create" ? "Create wall" : `Edit wall ${segments[3]}`,
        form: {
          id: "client-wall-form",
          saveLabel: "Save",
          cancelPath: `${basePath}/Wall/List`,
          fields: [
            { id: "wall-name", label: "Wall name", type: "text", required: true, value: subSection === "create" ? "" : "Techies" },
            { id: "wall-description", label: "Description", type: "textarea", value: "Sharing engineering knowledge and community updates." },
            { id: "wall-privacy", label: "Private wall", type: "checkbox", checked: subSection !== "create" }
          ]
        }
      };
    }

    if (subSection === "members") {
      return {
        ...defaults,
        domain: "wall",
        view: "wall-members",
        title: "Wall members",
        subtitle: "Manage wall membership and visibility.",
        filterPlaceholder: "Type to filter members...",
        table: {
          columns: [
            { key: "fullName", label: "Name", sortable: true, link: true },
            { key: "role", label: "Role", sortable: true },
            { key: "joined", label: "Joined", sortable: true },
            { key: "actions", label: "Actions" }
          ],
          rows: withTenantRows(wallMembersRows, tenantSegment),
          pageSize: 8,
          defaultSort: { key: "fullName", direction: "asc" }
        }
      };
    }

    if (subSection === "list") {
      return {
        ...defaults,
        domain: "wall",
        view: "wall-list",
        title: "Discover walls",
        subtitle: "Browse, follow, and manage walls.",
        filterPlaceholder: "Type to filter walls...",
        primaryAction: { label: "Create new", path: `${basePath}/Wall/Create` },
        table: {
          columns: [
            { key: "name", label: "Wall", sortable: true },
            { key: "members", label: "Members", sortable: true },
            { key: "posts", label: "Posts", sortable: true },
            { key: "privacy", label: "Privacy", sortable: true },
            { key: "actions", label: "Actions" }
          ],
          rows: withTenantRows(wallDiscoverRows, tenantSegment),
          pageSize: 8,
          defaultSort: { key: "name", direction: "asc" }
        }
      };
    }
  }

  if (section === "events") {
    if (subSection === "addevent" || (subSection === "edit" && segments[3])) {
      return {
        ...defaults,
        domain: "events",
        view: "events-manage",
        title: "Events",
        subtitle: subSection === "addevent" ? "Create event" : `Edit event ${segments[3]}`,
        form: {
          id: "client-events-form",
          saveLabel: subSection === "addevent" ? "Create" : "Update",
          cancelPath: `${basePath}/Events/List`,
          fields: [
            { id: "event-title", label: "Title", type: "text", required: true, value: subSection === "addevent" ? "" : "FPV drone workshop" },
            {
              id: "event-type",
              label: "Type",
              type: "select",
              value: "Leisure",
              options: [
                { value: "Leisure", label: "Leisure" },
                { value: "Hub", label: "Hub" },
                { value: "Training", label: "Training" }
              ]
            },
            { id: "event-start-date", label: "Start date", type: "date", required: true, value: "2026-02-25" },
            { id: "event-start-time", label: "Start time", type: "time", required: true, value: "17:30" },
            { id: "event-description", label: "Description", type: "textarea", value: "Event details and participation conditions." }
          ]
        }
      };
    }

    if (subSection === "eventcontent" && segments[3]) {
      return {
        ...defaults,
        domain: "events",
        view: "events-content",
        title: "Event details",
        subtitle: `Event id: ${segments[3]}`,
        details: {
          sections: [
            { label: "Title", value: "FPV drone workshop" },
            { label: "Type", value: "Leisure" },
            { label: "Office", value: "Vilnius" },
            { label: "Date", value: "2026-02-25 17:30" },
            { label: "Description", value: "Hands-on workshop for FPV drone assembly and flying basics." }
          ]
        },
        links: [
          { label: "Edit event", path: `${basePath}/Events/Edit/${segments[3]}`, kind: "primary" },
          { label: "Back to list", path: `${basePath}/Events/List`, kind: "secondary" }
        ]
      };
    }

    if (subSection === "report" && (segments[3] || "").toLowerCase() === "report") {
      return {
        ...defaults,
        domain: "events",
        view: "events-report-details",
        title: "Event report",
        subtitle: `Event id: ${segments[5] || "event-1"}`,
        details: {
          sections: [
            { label: "Participants", value: "46" },
            { label: "Attendance", value: "39" },
            { label: "Completion", value: "85%" },
            { label: "Feedback", value: "Most participants rated workshop as very useful." }
          ]
        },
        links: [{ label: "Back to reports", path: `${basePath}/Events/Report`, kind: "secondary" }]
      };
    }

    if (subSection === "report") {
      return {
        ...defaults,
        domain: "events",
        view: "events-report-list",
        title: "Event reports",
        subtitle: "Participation and attendance summaries.",
        filterPlaceholder: "Type to filter reports...",
        table: {
          columns: [
            { key: "eventTitle", label: "Event", sortable: true },
            { key: "participants", label: "Participants", sortable: true },
            { key: "attendance", label: "Attendance", sortable: true },
            { key: "completion", label: "Completion", sortable: true },
            { key: "actions", label: "Actions" }
          ],
          rows: withTenantRows(eventReportRows, tenantSegment),
          pageSize: 8,
          defaultSort: { key: "eventTitle", direction: "asc" }
        }
      };
    }

    const filteredType = subSection === "list" ? segments[3] : "";
    const filteredOffice = (segments[4] || "").toLowerCase() === "office" ? segments[5] : "";
    const filteredRows = eventRows.filter((row) => {
      const typeOk = filteredType ? row.type.toLowerCase() === String(filteredType).toLowerCase() : true;
      const officeOk = filteredOffice ? row.office.toLowerCase() === String(filteredOffice).toLowerCase() : true;
      return typeOk && officeOk;
    });

    return {
      ...defaults,
      domain: "events",
      view: filteredType || filteredOffice ? "events-list-filtered" : "events-list",
      title: "Events",
      subtitle:
        filteredType || filteredOffice
          ? `Filtered view${filteredType ? `: ${filteredType}` : ""}${filteredOffice ? ` / ${filteredOffice}` : ""}`
          : "Browse all events.",
      filterPlaceholder: "Type to filter events...",
      primaryAction: { label: "Create new", path: `${basePath}/Events/AddEvent` },
      table: {
        columns: [
          { key: "title", label: "Title", sortable: true },
          { key: "type", label: "Type", sortable: true },
          { key: "office", label: "Office", sortable: true },
          { key: "startDate", label: "Start date", sortable: true },
          { key: "actions", label: "Actions" }
        ],
        rows: withTenantRows(filteredRows.length ? filteredRows : eventRows, tenantSegment),
        pageSize: 8,
        defaultSort: { key: "title", direction: "asc" }
      }
    };
  }

  if (section === "kudos") {
    if (subSection === "kudosachievementboard") {
      return {
        ...defaults,
        domain: "kudos",
        view: "kudos-achievement-board",
        title: "Kudos achievement board",
        subtitle: "Top recognition this quarter.",
        table: {
          columns: [
            { key: "user", label: "User", sortable: true },
            { key: "points", label: "Points", sortable: true },
            { key: "badge", label: "Badge", sortable: true }
          ],
          rows: [
            { id: "kb-1", user: "Arturas Nikoncukas", points: "100", badge: "Legend" },
            { id: "kb-2", user: "Jokubas Rimasovskis", points: "85", badge: "Champion" },
            { id: "kb-3", user: "Anglius Stanislovaitis", points: "74", badge: "Contributor" }
          ],
          pageSize: 8,
          defaultSort: { key: "points", direction: "desc" }
        }
      };
    }

    if (subSection === "kudosloglist") {
      return {
        ...defaults,
        domain: "kudos",
        view: "kudos-log-list",
        title: "Kudos log",
        subtitle: `History${segments[3] ? ` for user ${segments[3]}` : ""}.`,
        filterPlaceholder: "Type to filter logs...",
        table: {
          columns: [
            { key: "date", label: "Date", sortable: true },
            { key: "from", label: "From", sortable: true },
            { key: "to", label: "To", sortable: true },
            { key: "amount", label: "Kudos", sortable: true },
            { key: "reason", label: "Reason", sortable: true }
          ],
          rows: kudosLogRows,
          pageSize: 8,
          defaultSort: { key: "date", direction: "desc" }
        }
      };
    }

    if (subSection === "kudosuserinformation") {
      return {
        ...defaults,
        domain: "kudos",
        view: "kudos-user-information",
        title: "Kudos user information",
        subtitle: `User${segments[3] ? ` id: ${segments[3]}` : ""}`,
        details: {
          sections: [
            { label: "User", value: "Arturas Nikoncukas" },
            { label: "Current balance", value: "742" },
            { label: "Received this month", value: "31" },
            { label: "Given this month", value: "18" },
            { label: "Most common badge", value: "Team player" }
          ]
        },
        links: [
          { label: "Open kudos log", path: `${basePath}/Kudos/KudosLogList/${segments[3] || "1"}`, kind: "secondary" }
        ]
      };
    }

    return {
      ...defaults,
      domain: "kudos",
      view: "kudos-dashboard",
      title: "Kudos",
      subtitle: "Recognition feed and shortcuts.",
      cards: [
        { id: "dashboard-points", title: "Your points", subtitle: "742" },
        { id: "dashboard-given", title: "Given this month", subtitle: "18" },
        { id: "dashboard-received", title: "Received this month", subtitle: "31" }
      ],
      links: [
        { label: "Achievement board", path: `${basePath}/Kudos/KudosAchievementBoard`, kind: "primary" },
        { label: "Kudos log", path: `${basePath}/Kudos/KudosLogList`, kind: "secondary" }
      ]
    };
  }

  if (section === "books") {
    if (subSection === "add" || (subSection === "edit" && segments[3])) {
      return {
        ...defaults,
        domain: "books",
        view: "books-manage",
        title: "Books",
        subtitle: subSection === "add" ? "Add book" : `Edit book ${segments[3]}`,
        form: {
          id: "client-books-form",
          saveLabel: "Save",
          cancelPath: `${basePath}/Books/List`,
          fields: [
            { id: "book-title", label: "Title", type: "text", required: true, value: subSection === "add" ? "" : "Domain-Driven Design" },
            { id: "book-author", label: "Author", type: "text", required: true, value: subSection === "add" ? "" : "Eric Evans" },
            {
              id: "book-office",
              label: "Office",
              type: "select",
              value: "office-1",
              options: [
                { value: "office-1", label: "Vilnius" },
                { value: "office-2", label: "Kaunas" }
              ]
            },
            { id: "book-notes", label: "Notes", type: "textarea", value: "Available in office library." }
          ]
        }
      };
    }

    return {
      ...defaults,
      domain: "books",
      view: "books-list",
      title: "Books",
      subtitle: "Office library catalog.",
      filterPlaceholder: "Type to filter books...",
      primaryAction: { label: "Add new", path: `${basePath}/Books/Add` },
      table: {
        columns: [
          { key: "title", label: "Title", sortable: true },
          { key: "author", label: "Author", sortable: true },
          { key: "office", label: "Office", sortable: true },
          { key: "status", label: "Status", sortable: true, badge: true },
          { key: "actions", label: "Actions" }
        ],
        rows: withTenantRows(booksRows, tenantSegment),
        pageSize: 8,
        defaultSort: { key: "title", direction: "asc" }
      }
    };
  }

  if (section === "projects") {
    if (subSection === "create" || (subSection === "edit" && segments[3])) {
      return {
        ...defaults,
        domain: "projects",
        view: "projects-manage",
        title: "Projects",
        subtitle: subSection === "create" ? "Create project" : `Edit project ${segments[3]}`,
        form: {
          id: "client-projects-form",
          saveLabel: "Save",
          cancelPath: `${basePath}/Projects/List`,
          fields: [
            { id: "project-name", label: "Project name", type: "text", required: true, value: subSection === "create" ? "" : "Simoona modernization" },
            { id: "project-owner", label: "Owner", type: "text", required: true, value: "Arturas Nikoncukas" },
            {
              id: "project-state",
              label: "State",
              type: "select",
              value: "Active",
              options: [
                { value: "Active", label: "Active" },
                { value: "Planning", label: "Planning" },
                { value: "On hold", label: "On hold" }
              ]
            },
            { id: "project-due", label: "Due date", type: "date", value: "2026-06-30" },
            { id: "project-description", label: "Description", type: "textarea", value: "Parity implementation and release preparation." }
          ]
        }
      };
    }

    if (subSection === "details" && segments[3]) {
      return {
        ...defaults,
        domain: "projects",
        view: "projects-details",
        title: "Project details",
        subtitle: `Project id: ${segments[3]}`,
        details: {
          sections: [
            { label: "Name", value: "Simoona modernization" },
            { label: "Owner", value: "Arturas Nikoncukas" },
            { label: "State", value: "Active" },
            { label: "Due date", value: "2026-06-30" },
            { label: "Summary", value: "Deliver 1:1 parity across API and web with deploy readiness." }
          ]
        },
        links: [
          { label: "Edit project", path: `${basePath}/Projects/Edit/${segments[3]}`, kind: "primary" },
          { label: "Back to list", path: `${basePath}/Projects/List`, kind: "secondary" }
        ]
      };
    }

    return {
      ...defaults,
      domain: "projects",
      view: "projects-list",
      title: "Projects",
      subtitle: "Track cross-team project progress.",
      filterPlaceholder: "Type to filter projects...",
      primaryAction: { label: "Create new", path: `${basePath}/Projects/Create` },
      table: {
        columns: [
          { key: "name", label: "Name", sortable: true },
          { key: "owner", label: "Owner", sortable: true },
          { key: "state", label: "State", sortable: true, badge: true },
          { key: "dueDate", label: "Due date", sortable: true },
          { key: "actions", label: "Actions" }
        ],
        rows: withTenantRows(projectRows, tenantSegment),
        pageSize: 8,
        defaultSort: { key: "name", direction: "asc" }
      }
    };
  }

  if (section === "servicerequests") {
    return {
      ...defaults,
      domain: "service-requests",
      view: "service-requests-list",
      title: "Service requests",
      subtitle: "Track internal support requests and SLA states.",
      filterPlaceholder: "Type to filter service requests...",
      table: {
        columns: [
          { key: "id", label: "Ticket", sortable: true },
          { key: "type", label: "Type", sortable: true },
          { key: "priority", label: "Priority", sortable: true, badge: true },
          { key: "status", label: "Status", sortable: true, badge: true },
          { key: "created", label: "Created", sortable: true },
          { key: "assignee", label: "Assignee", sortable: true }
        ],
        rows: serviceRequestRows,
        pageSize: 8,
        defaultSort: { key: "created", direction: "desc" }
      }
    };
  }

  if (section === "vacation") {
    return {
      ...defaults,
      domain: "vacation",
      view: "vacation-list",
      title: "Vacation requests",
      subtitle: "Planned and approved vacation periods.",
      filterPlaceholder: "Type to filter vacations...",
      primaryAction: { label: "Request vacation", path: `${basePath}/Vacation/List` },
      table: {
        columns: [
          { key: "period", label: "Period", sortable: true },
          { key: "days", label: "Days", sortable: true },
          { key: "status", label: "Status", sortable: true, badge: true },
          { key: "approver", label: "Approver", sortable: true }
        ],
        rows: vacationRows,
        pageSize: 8,
        defaultSort: { key: "period", direction: "desc" }
      }
    };
  }

  if (section === "committees") {
    return {
      ...defaults,
      domain: "committees",
      view: "committees-list",
      title: "Committees",
      subtitle: "Committee ownership and upcoming meetings.",
      filterPlaceholder: "Type to filter committees...",
      table: {
        columns: [
          { key: "name", label: "Committee", sortable: true },
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

  if (section === "office") {
    return {
      ...defaults,
      domain: "office",
      view: "office-map",
      title: "Office map",
      subtitle: "Room occupancy and floor selection.",
      details: {
        sections: [
          { label: "Office", value: "Vilnius HQ" },
          { label: "Floor", value: "2" },
          { label: "Room", value: "214" },
          { label: "Coordinates", value: "x: 143 / y: 212" },
          { label: "Selected user", value: "Arturas Nikoncukas" }
        ]
      },
      table: {
        columns: [
          { key: "room", label: "Room", sortable: true },
          { key: "capacity", label: "Capacity", sortable: true },
          { key: "occupied", label: "Occupied", sortable: true },
          { key: "status", label: "Status", sortable: true, badge: true }
        ],
        rows: [
          { id: "rm-1", room: "214", capacity: "12", occupied: "8", status: "Open" },
          { id: "rm-2", room: "215", capacity: "8", occupied: "8", status: "Full" },
          { id: "rm-3", room: "220", capacity: "10", occupied: "3", status: "Open" }
        ],
        pageSize: 8,
        defaultSort: { key: "room", direction: "asc" }
      }
    };
  }

  if (section === "organizationalstructure") {
    return {
      ...defaults,
      domain: "organizational-structure",
      view: "organizational-structure",
      title: "Organizational structure",
      subtitle: "Reporting hierarchy and team composition.",
      details: {
        sections: [
          { label: "CEO", value: "Vardenis Pavardenis" },
          { label: "Technology", value: "Engineering, QA, Infrastructure" },
          { label: "Operations", value: "Finance, Office Management, Support" },
          { label: "People", value: "HR, Recruitment, Culture Committee" }
        ]
      },
      table: {
        columns: [
          { key: "team", label: "Team", sortable: true },
          { key: "lead", label: "Lead", sortable: true },
          { key: "members", label: "Members", sortable: true }
        ],
        rows: [
          { id: "team-1", team: "Engineering", lead: "Arturas Nikoncukas", members: "24" },
          { id: "team-2", team: "QA", lead: "Margarita Morke", members: "8" },
          { id: "team-3", team: "Support", lead: "Nikolajus Rimka", members: "12" }
        ],
        pageSize: 8,
        defaultSort: { key: "team", direction: "asc" }
      }
    };
  }

  if (section === "submitticket") {
    return {
      ...defaults,
      domain: "submit-ticket",
      view: "submit-ticket",
      title: "Submit ticket",
      subtitle: "Create support request for internal teams.",
      form: {
        id: "client-submit-ticket-form",
        saveLabel: "Submit",
        cancelPath: `${basePath}/Wall/Feed`,
        fields: [
          {
            id: "ticket-type",
            label: "Type",
            type: "select",
            value: "IT support",
            options: [
              { value: "IT support", label: "IT support" },
              { value: "Office access", label: "Office access" },
              { value: "Equipment", label: "Equipment" }
            ]
          },
          { id: "ticket-subject", label: "Subject", type: "text", required: true, value: "" },
          { id: "ticket-description", label: "Description", type: "textarea", required: true, value: "" },
          { id: "ticket-priority", label: "High priority", type: "checkbox", checked: false }
        ]
      }
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
  const clientFeaturePage = buildClientFeaturePagePayload(pathname);
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
    clientFeaturePage,
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

function resolveSourceContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".json") {
    return "application/json; charset=utf-8";
  }

  if (extension === ".html") {
    return "text/html; charset=utf-8";
  }

  if (extension === ".css") {
    return "text/css; charset=utf-8";
  }

  return "application/javascript; charset=utf-8";
}

function resolveSourcePath(pathname) {
  const normalizedPath = path.normalize(pathname).replace(/^[/\\]+/, "");
  const sourcePath = path.join(webRoot, normalizedPath);
  const relativeToRoot = path.relative(webRoot, sourcePath);
  if (relativeToRoot.startsWith("..")) {
    return null;
  }
  return sourcePath;
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

  if (pathname.startsWith("/src/")) {
    const sourcePath = resolveSourcePath(pathname);
    if (!sourcePath || !fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
      response.writeHead(404, {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store"
      });
      response.end("Not found.");
      return;
    }

    response.writeHead(200, {
      "content-type": resolveSourceContentType(sourcePath),
      "cache-control": "no-store"
    });
    response.end(fs.readFileSync(sourcePath, "utf8"));
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
