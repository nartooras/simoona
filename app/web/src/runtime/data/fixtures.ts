import type { RuntimeNavItem } from "./contracts";

export const appNavItems: RuntimeNavItem[] = [
  { id: "home", title: "Home", path: "/default/Wall/Feed" },
  { id: "profile", title: "Profile", path: "/default/Profiles/1" }
];

export const profileDetailsModel = {
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

export const settingsModel = {
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

export const adminNavigation = [
  { id: "users", label: "Users", path: "/default/Admin/Users" },
  { id: "roles", label: "Roles", path: "/default/Admin/Roles" },
  { id: "roomtypes", label: "Room types", path: "/default/Admin/RoomTypes" },
  { id: "offices", label: "Offices", path: "/default/Admin/Offices" },
  { id: "customization", label: "Customization", path: "/default/Admin/Customization" },
  { id: "lotteries", label: "Lotteries", path: "/default/Admin/Lotteries/List" },
  { id: "kudosbasket", label: "Kudos basket", path: "/default/Admin/KudosBasket" }
];

export const adminUsersRows = [
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

export const adminCustomizationCards = [
  { id: "eventtypes", title: "Event types", subtitle: "Manage event categories.", path: "/default/Admin/Customization/EventTypes", icon: "*" },
  { id: "jobtitles", title: "Job titles", subtitle: "Manage job title dictionary.", path: "/default/Admin/Customization/JobTitles", icon: "J" },
  { id: "kudostypes", title: "Kudos types", subtitle: "Define kudos badges.", path: "/default/Admin/Customization/KudosTypes", icon: "K" },
  { id: "kudosshop", title: "Kudos shop", subtitle: "Configure reward catalog.", path: "/default/Admin/Customization/KudosShop", icon: "$" },
  { id: "servicerequests", title: "Service request types", subtitle: "Configure support categories.", path: "/default/Admin/Customization/ServiceRequestsTypes", icon: "S" },
  { id: "orgsettings", title: "Organization settings", subtitle: "Maintain organization defaults.", path: "/default/Admin/Customization/OrganizationSettings", icon: "O" },
  { id: "externallinks", title: "External links", subtitle: "Manage external sidebar links.", path: "/default/Admin/Customization/ExternalLinks", icon: "E" }
];

export const adminLotteryRows = [
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

export const kudosBasketDonations = [
  { id: "don-1", fullName: "Arturas Nikoncukas", amount: "10", date: "2026-02-12, 09:12" },
  { id: "don-2", fullName: "Vardenis Pavardenis", amount: "5", date: "2026-02-12, 09:18" },
  { id: "don-3", fullName: "Jona Jonaite", amount: "3", date: "2026-02-12, 09:24" }
];

export const clientFeatureNavigationTemplate = [
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

export const wallDiscoverRows = [
  { id: "wall-1", name: "Official", members: "459", posts: "1612", privacy: "Public", actions: [{ label: "Follow" }, { label: "Open", path: "/default/Wall/Feed?wall=official" }] },
  { id: "wall-2", name: "Techies", members: "312", posts: "918", privacy: "Public", actions: [{ label: "Follow" }, { label: "Open", path: "/default/Wall/Feed?wall=techies" }] },
  { id: "wall-3", name: "Vilnius Geeks", members: "227", posts: "604", privacy: "Public", actions: [{ label: "Follow" }, { label: "Open", path: "/default/Wall/Feed?wall=vilnius-geeks" }] },
  { id: "wall-4", name: "DANK MEMES", members: "178", posts: "1240", privacy: "Public", actions: [{ label: "Follow" }, { label: "Open", path: "/default/Wall/Feed?wall=dank-memes" }] },
  { id: "wall-5", name: "Private Leadership", members: "12", posts: "188", privacy: "Private", actions: [{ label: "Request invite" }] }
];

export const wallMembersRows = [
  { id: "wm-1", fullName: "Arturas Nikoncukas", fullNamePath: "/default/Profiles/1", role: "Owner", joined: "2024-01-10", actions: [{ label: "Profile", path: "/default/Profiles/1" }] },
  { id: "wm-2", fullName: "Jona Jonaite", fullNamePath: "/default/Profiles/9", role: "Moderator", joined: "2024-02-11", actions: [{ label: "Profile", path: "/default/Profiles/9" }] },
  { id: "wm-3", fullName: "Rytis Kvedaras", fullNamePath: "/default/Profiles/6", role: "Member", joined: "2024-06-08", actions: [{ label: "Profile", path: "/default/Profiles/6" }] }
];

export const eventRows = [
  { id: "event-1", title: "FPV drone workshop", type: "Leisure", office: "Vilnius", startDate: "2026-02-25 17:30", actions: [{ label: "Open", path: "/default/Events/EventContent/event-1" }, { label: "Edit", path: "/default/Events/Edit/event-1" }] },
  { id: "event-2", title: "ISTQB Advanced hub", type: "Hub", office: "Vilnius", startDate: "2026-02-26 12:00", actions: [{ label: "Open", path: "/default/Events/EventContent/event-2" }, { label: "Edit", path: "/default/Events/Edit/event-2" }] },
  { id: "event-3", title: "Kids celebration", type: "Leisure", office: "Kaunas", startDate: "2026-05-16 10:00", actions: [{ label: "Open", path: "/default/Events/EventContent/event-3" }, { label: "Edit", path: "/default/Events/Edit/event-3" }] }
];

export const eventReportRows = [
  { id: "report-1", eventTitle: "FPV drone workshop", participants: "46", attendance: "39", completion: "85%", actions: [{ label: "Open report", path: "/default/Events/Report/Report/Event/event-1" }] },
  { id: "report-2", eventTitle: "ISTQB Advanced hub", participants: "31", attendance: "27", completion: "87%", actions: [{ label: "Open report", path: "/default/Events/Report/Report/Event/event-2" }] }
];

export const kudosLogRows = [
  { id: "kudos-log-1", date: "2026-02-18", from: "Jona Jonaite", to: "Arturas Nikoncukas", amount: "+3", reason: "Great mentoring" },
  { id: "kudos-log-2", date: "2026-02-14", from: "Vardenis Pavardenis", to: "Arturas Nikoncukas", amount: "+2", reason: "Documentation help" },
  { id: "kudos-log-3", date: "2026-02-09", from: "Monika Radzeviciute", to: "Arturas Nikoncukas", amount: "+1", reason: "Interview support" }
];

export const booksRows = [
  { id: "book-1", title: "Domain-Driven Design", author: "Eric Evans", office: "Vilnius", status: "Available", actions: [{ label: "Edit", path: "/default/Books/Edit/book-1/office-1" }] },
  { id: "book-2", title: "Clean Architecture", author: "Robert C. Martin", office: "Kaunas", status: "Borrowed", actions: [{ label: "Edit", path: "/default/Books/Edit/book-2/office-2" }] },
  { id: "book-3", title: "Refactoring", author: "Martin Fowler", office: "Vilnius", status: "Available", actions: [{ label: "Edit", path: "/default/Books/Edit/book-3/office-1" }] }
];

export const projectRows = [
  { id: "project-1", name: "Simoona modernization", owner: "Arturas Nikoncukas", state: "Active", dueDate: "2026-06-30", actions: [{ label: "Details", path: "/default/Projects/Details/project-1" }, { label: "Edit", path: "/default/Projects/Edit/project-1" }] },
  { id: "project-2", name: "Office map redesign", owner: "Jona Jonaite", state: "Planning", dueDate: "2026-05-15", actions: [{ label: "Details", path: "/default/Projects/Details/project-2" }, { label: "Edit", path: "/default/Projects/Edit/project-2" }] },
  { id: "project-3", name: "Kudos campaigns", owner: "Monika Radzeviciute", state: "On hold", dueDate: "2026-08-01", actions: [{ label: "Details", path: "/default/Projects/Details/project-3" }, { label: "Edit", path: "/default/Projects/Edit/project-3" }] }
];

export const serviceRequestRows = [
  { id: "sr-1001", type: "IT support", priority: "High", status: "In progress", created: "2026-02-18", assignee: "Rytis Kvedaras" },
  { id: "sr-1002", type: "Office access", priority: "Medium", status: "Open", created: "2026-02-17", assignee: "Jona Jonaite" },
  { id: "sr-1003", type: "Equipment", priority: "Low", status: "Resolved", created: "2026-02-12", assignee: "Ausris Kiela" }
];

export const vacationRows = [
  { id: "vac-1", period: "2026-07-01 - 2026-07-10", days: "8", status: "Approved", approver: "Vardenis Pavardenis" },
  { id: "vac-2", period: "2026-08-14 - 2026-08-21", days: "6", status: "Pending", approver: "Vardenis Pavardenis" }
];

export const committeeRows = [
  { id: "com-1", name: "Kudos Committee", members: "9", lead: "Jona Jonaite", nextMeeting: "2026-02-28" },
  { id: "com-2", name: "Culture Committee", members: "7", lead: "Monika Radzeviciute", nextMeeting: "2026-03-03" }
];

