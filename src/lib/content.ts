// Every product claim on the site lives here, so pages never drift apart.
// Each item names something the app does today. Not on the site until built:
// wage slips, offline use, an iOS app, Tally export, client billing for
// non-BOQ sites.

export type ShotKey =
  | "attendance"
  | "payRun"
  | "siteCash"
  | "dailyUpdates"
  | "purchase"
  | "stock"
  | "boq"
  | "raBill"
  | "units"
  | "customerApp"
  | "dashboard"
  | "reports"
  | "reportProfit"
  | "reportCash"
  | "reportStatus";

export interface FeatureSection {
  title: string;
  points: string[];
}

export interface FeatureGroup {
  slug: string;
  name: string;
  /** One line for cards and the menu. */
  summary: string;
  headline: string;
  intro: string;
  /** The points shown on the homepage block. */
  highlights: string[];
  sections: FeatureSection[];
  shots: { phone?: ShotKey; web?: ShotKey };
  seoTitle: string;
  seoDescription: string;
}

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    slug: "labour-payroll",
    name: "Labour & Payroll",
    summary: "Attendance, pay runs, advances and overtime for daily-wage and salaried crews.",
    headline: "Attendance and payroll for every type of worker",
    intro:
      "Record attendance on site. Briktra calculates pay for every worker, recovers advances and records each payment by cash, UPI or bank transfer.",
    highlights: [
      "Daily attendance with self check-in and supervisor approval",
      "Weekly, fortnightly or monthly pay runs",
      "Daily, hourly, monthly and fixed-pay workers",
      "Advances and kharchi recovered in instalments",
      "Overtime, holidays and week offs worked out for you",
      "A worker is never paid twice for the same day",
    ],
    sections: [
      {
        title: "Attendance",
        points: [
          "Present, Half Day, Absent, leave, holiday and week off",
          "Worker self check-in with location, approved by the supervisor",
          "Overtime hours recorded on the same day's mark",
          "Attendance corrections that never upset wages already paid",
          "Roster and history for every worker and site",
        ],
      },
      {
        title: "Pay runs",
        points: [
          "Daily, hourly, monthly and fixed-pay workers in one company",
          "Weekly, fortnightly or monthly cycles, your choice",
          "Every worker paid correctly across all your sites, with cost shown per site",
          "Approve, then pay in cash, UPI or bank transfer, in full or in part",
          "Late changes are never lost, even after pay day",
        ],
      },
      {
        title: "Advances and deductions",
        points: [
          "Advances and kharchi recovered in instalments",
          "Recoveries kept within legal limits",
          "Holiday list with paid and unpaid days, per site",
          "Food and room charges deducted the same way",
        ],
      },
      {
        title: "Your company, your rules",
        points: [
          "Pay cycle, week off, overtime rate and rounding are settings",
          "Choose who approves and who records payments",
          "Change your rules any time without disturbing past pay",
        ],
      },
    ],
    shots: { phone: "attendance", web: "payRun" },
    seoTitle: "Labour Attendance & Payroll App for Contractors",
    seoDescription:
      "Mark daily-wage attendance on site and run weekly or monthly pay with advances, overtime and holidays worked out. Built for Indian contractors.",
  },
  {
    slug: "site-management",
    name: "Site & Cash",
    summary: "Site cash with an imprest limit, expenses, daily photos and progress.",
    headline: "Complete visibility of every site, every day",
    intro:
      "Photos, notes, site cash and progress are recorded by the site team and available to the office the same day.",
    highlights: [
      "Site cash book with an imprest limit per site",
      "Expenses with bill photos and approvals",
      "Daily photos and notes from every site",
      "Stages and milestones from your own templates",
      "Budget against actual for every site",
    ],
    sections: [
      {
        title: "Site cash",
        points: [
          "Site cash book with an imprest limit for each site",
          "Expenses with bill photos and categories",
          "Approval before money goes out",
        ],
      },
      {
        title: "Progress",
        points: [
          "Daily photos and notes from site",
          "Stages and milestones from your own templates",
          "Budget against actual for every site",
          "Blocks and phases under one site",
        ],
      },
      {
        title: "Documents and contractors",
        points: [
          "Document wallet for drawings, approvals and agreements",
          "Sub-contractors and their contracts per site",
        ],
      },
    ],
    shots: { phone: "dailyUpdates", web: "siteCash" },
    seoTitle: "Construction Site Management & Site Cash App",
    seoDescription:
      "Run every construction site from your phone: site cash with an imprest limit, expenses with bill photos, daily progress photos and budget against actual.",
  },
  {
    slug: "purchase-stock",
    name: "Purchase & Stock",
    summary: "Purchase orders, supplier bills, approvals and stock across sites.",
    headline: "Purchase orders, supplier bills and stock in one place",
    intro:
      "Raise purchase orders, link supplier bills, route them for approval and track stock at every site and store.",
    highlights: [
      "Purchase orders with approval",
      "Supplier bills linked to orders, with GST",
      "Stock at every site and store",
      "Low stock shown on the dashboard",
    ],
    sections: [
      {
        title: "Purchase",
        points: [
          "Supplier list",
          "Purchase orders with approval",
          "Supplier bills linked to orders, with GST",
          "Purchase bill register",
        ],
      },
      {
        title: "Stock",
        points: [
          "Stock for every site and store location",
          "Material added and used at site",
          "Low stock shown on the dashboard",
          "Stock reports",
        ],
      },
    ],
    shots: { phone: "stock", web: "purchase" },
    seoTitle: "Construction Purchase Order & Stock Software",
    seoDescription:
      "Raise purchase orders, record supplier bills with GST, approve spending and track material stock across all your construction sites in one app.",
  },
  {
    slug: "boq-billing",
    name: "BOQ & Billing",
    summary: "BOQ, measurements, RA bills, client bills, retention and margin.",
    headline: "From BOQ to RA bills, with margin on every project",
    intro:
      "Price the project once in the BOQ. Measure and certify work, pay contractors through RA bills and bill your client, with retention, TDS and GST calculated.",
    highlights: [
      "BOQ with revisions and estimates",
      "Measurement books: submit, certify or return",
      "Contractor RA bills with retention, TDS and GST",
      "Client bills and tax invoices",
      "Margin today and at completion",
    ],
    sections: [
      {
        title: "Plan",
        points: [
          "BOQ with revisions and estimates",
          "Share BOQs with clients without revealing your margins",
          "Apply the estimate to the site budget",
        ],
      },
      {
        title: "Execute",
        points: [
          "Work orders with each contractor's rate",
          "Measurement books: submit, certify or return with a reason",
          "Variations for extra quantity or new items",
          "Bill per block or tower, or for the whole site",
        ],
      },
      {
        title: "Bill and pay",
        points: [
          "Contractor RA bills with retention, TDS, advance and material recovery, and GST",
          "Client bills with client deductions and a tax invoice",
          "Track what your client actually certified",
          "GST worked out correctly on every bill",
        ],
      },
      {
        title: "Know where you stand",
        points: [
          "Margin today and at completion",
          "Contractor, client and retention statements as PDF or CSV",
          "Overdue client payments visible at a glance",
          "Reminders when retention falls due",
        ],
      },
    ],
    shots: { phone: "raBill", web: "boq" },
    seoTitle: "BOQ, Measurement & RA Billing Software",
    seoDescription:
      "BOQ with revisions, measurement books, contractor RA bills with retention, TDS and GST, client bills and the margin on every construction project.",
  },
  {
    slug: "customers",
    name: "Customers & Units",
    summary: "Units, instalments and a customer app for your home buyers.",
    headline: "A dedicated app for your home buyers",
    intro:
      "For builders selling flats, villas or plots. Track every unit, link instalments to construction stages and give buyers visibility of their home's progress.",
    highlights: [
      "Every flat or plot with its status",
      "Instalments linked to construction stages",
      "Buyers see progress, instalments and photos",
    ],
    sections: [
      {
        title: "Units",
        points: [
          "Units grid: every flat or plot with its status",
          "Payment instalments linked to construction stages",
        ],
      },
      {
        title: "Customer app",
        points: [
          "Construction progress for their home",
          "Instalments due and paid",
          "Site photos",
          "Fewer status enquiries to your team",
        ],
      },
    ],
    shots: { phone: "customerApp", web: "units" },
    seoTitle: "Home Buyer App & Unit Sales Tracking for Builders",
    seoDescription:
      "Track every flat or plot you sell, link instalments to construction stages and give home buyers their own app showing progress, photos and instalments due.",
  },
  {
    slug: "control-reports",
    name: "Reports & Control",
    summary: "13 reports, dashboards, roles and approvals across all your sites.",
    headline: "13 reports and company-wide control, from one app",
    intro:
      "One dashboard across every site, 13 ready-made reports in PDF and CSV, and permissions that control who sees financial information.",
    highlights: [
      "Owner dashboard across all sites",
      "Permissions for each role",
      "Second approver for bills, if you want one",
      "13 ready-made reports, PDF and CSV",
    ],
    sections: [
      {
        title: "Control",
        points: [
          "Owner, Manager, Supervisor, Worker and Customer logins",
          "Module permissions for each role",
          "Second approver for bills, if you want one",
          "Invite your team by link",
          "OTP and fingerprint login",
        ],
      },
      {
        title: "Reports",
        points: [
          "Profitability, cash forecast, receivables and payables, budget variance",
          "Project status, margin and forecast",
          "Salaries, payroll and manpower",
          "Stock, materials and procurement exceptions",
          "Statements, retention and month file",
          "Scheduled reports, PDF and CSV export (opens in Excel)",
        ],
      },
      {
        title: "Team",
        points: [
          "Announcements to the whole team",
          "Notifications for approvals and reminders",
          "Search across everything",
          "Step-by-step in-app guide for every role",
        ],
      },
    ],
    shots: { phone: "dashboard", web: "reports" },
    seoTitle: "Construction Reports, Dashboards & Permissions",
    seoDescription:
      "One dashboard across every site, 13 ready-made reports in PDF and CSV, role-based permissions and approvals, built for Indian construction companies of any size.",
  },
];

export const featureBySlug = (slug: string) => FEATURE_GROUPS.find((g) => g.slug === slug);

export const PAINS = [
  "Attendance kept in paper registers",
  "Wages calculated manually every week",
  "Site cash without a clear record",
  "Bills delayed in approval",
  "No clear view of project margin",
];

/** Specific money rules: the proof that the product understands a site. */
export const PROOF_POINTS = [
  {
    title: "Never pay a day twice",
    body: "Even when workers move between sites or attendance is corrected, every working day is paid exactly once.",
  },
  {
    title: "Deductions within legal limits",
    body: "Advances and charges are recovered within the limits the Code on Wages sets, so deductions stay fair and lawful.",
  },
  {
    title: "Retention tracked to release",
    body: "You're reminded when a contractor's retention is due back, and when your client still holds yours.",
  },
  {
    title: "Short certification made visible",
    body: "When a client certifies less than you billed, you see it at once, and your margin shows the real number.",
  },
  {
    title: "Approved means locked",
    body: "Approved pay runs and bills can't be changed quietly, so your records stay trustworthy.",
  },
];

export const PATHS = [
  {
    name: "Site Management",
    tag: "No BOQ needed",
    body: "Attendance, pay runs, site cash, expenses, supplier bills, stock and daily updates.",
    href: "/site-management",
  },
  {
    name: "BOQ Commercial",
    tag: "For BOQ contracts",
    body: "BOQ, work orders, measurement books, RA bills, client bills, retention and margin.",
    href: "/boq-billing",
  },
];

/** Sold by job; each card says which login the person uses. */
export const ROLES = [
  { role: "Owners", does: "Every site and every rupee, with approvals from your phone.", login: "Owner login, included free" },
  { role: "Project Managers", does: "Budget against actual, milestones, BOQ and bills.", login: "Manager login" },
  { role: "Purchase Teams", does: "Purchase orders, supplier bills and stock across sites.", login: "Manager login" },
  { role: "Accounts & Finance", does: "Pay runs, site cash, bill approvals and statements.", login: "Manager login" },
  { role: "Site Supervisors", does: "Attendance, check-in approvals, daily photos and stock use.", login: "Supervisor login" },
  { role: "Workers", does: "Self check-in, their own attendance and salary.", login: "Worker login" },
  { role: "Your Home Buyers", does: "Progress, instalments and photos of their home.", login: "Home buyer login" },
];

export const FAQS: { q: string; a: string }[] = [
  {
    q: "Do I need a BOQ to use Briktra?",
    a: "No. Each site chooses how it works. Without a BOQ you get attendance, pay runs, site cash, expenses, supplier bills, stock and daily updates. Add BOQ, measurements, RA bills and client bills to any site when you need them.",
  },
  {
    q: "How does the free trial work?",
    a: "Sign up and your company gets 30 days free with Basic's limits: 3 sites, 75 workers and 4 managers or supervisors. No card is needed. Choose a plan when you are ready.",
  },
  {
    q: "Is every feature included in every plan?",
    a: "Yes. Plans differ only in how many sites, workers and logins you can have.",
  },
  {
    q: "Does the owner count as a login?",
    a: "No. The owner's login is always free. Managers and supervisors you invite count as team logins.",
  },
  {
    q: "Which devices does Briktra work on?",
    a: "Android phones through the Briktra app on Google Play, and any computer through the web app at app.briktra.com.",
  },
  {
    q: "Is Briktra available in Hindi or Tamil?",
    a: "The app's menus are available in Hindi and Tamil, and more screens are being translated.",
  },
  {
    q: "Is my data safe?",
    a: "Data is sent over encrypted connections and every company's data is kept separate from every other company's. Each role sees only what you allow.",
  },
  {
    q: "Can I move from Excel?",
    a: "Yes. Add your sites and workers, and bring your worker list in from a spreadsheet. Your team can start marking attendance the same day.",
  },
  {
    q: "What is the Anniversary Offer?",
    a: "Briktra turns 2. The next 25 companies to subscribe pay the offer price, and keep it for as long as they stay subscribed.",
  },
  {
    q: "What payment methods are accepted?",
    a: "UPI, cards and net banking, through Cashfree Payments. Prices include GST, and you get a GST invoice for every payment.",
  },
  {
    q: "Can I cancel?",
    a: "Yes. Cancelling stops the next renewal, and you keep access until the end of the period you paid for. Unused time is not refunded in cash.",
  },
  {
    q: "How do I reach support?",
    a: "Inside the app, the User Guide walks you through every task for your role, step by step. For anything else, call or WhatsApp us, email us, or use the contact form. We reply during business hours, Monday to Friday.",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  city: string;
}

/**
 * Real customer words only, given with permission. The section stays hidden
 * while this list is empty.
 */
export const TESTIMONIALS: Testimonial[] = [];

/** The reports in the app, grouped as its Reports menu groups them. */
export interface ReportItem {
  name: string;
  /** The question an owner asks that this report answers. */
  question: string;
  shows: string;
  /** A screenshot of the report, when the site has one. */
  shot?: ShotKey;
}

export const REPORT_GROUPS: { title: string; reports: ReportItem[] }[] = [
  {
    title: "Money",
    reports: [
      { name: "Profitability", question: "Which sites are making money?", shows: "Revenue, costs, gross and net profit, and where the money went.", shot: "reportProfit" },
      { name: "Cash Requirement Forecast", question: "How much cash will I need, and when?", shows: "Week-by-week receipts, payments and any shortfall.", shot: "reportCash" },
      { name: "Receivables & Payables", question: "Who owes me, and whom do I owe?", shows: "Outstanding amounts by how many days overdue." },
      { name: "Budget Variance", question: "Which projects are over budget?", shows: "Budget, spent and remaining for every project." },
    ],
  },
  {
    title: "Projects",
    reports: [
      { name: "General Overview", question: "How is the whole company doing?", shows: "Revenue, margin, cash and every project's progress on one page." },
      { name: "Project Status", question: "Is this site on schedule?", shows: "Progress by stage, key dates and risks.", shot: "reportStatus" },
      { name: "Margin & Forecast", question: "What will this job earn at the end?", shows: "Work done, margin today and cost to complete." },
    ],
  },
  {
    title: "People",
    reports: [
      { name: "Salaries & Payroll", question: "What did we pay on this site?", shows: "Earned, paid and advances, worker by worker." },
      { name: "Manpower", question: "How many people actually worked?", shows: "Man-days, crew size each day and days per worker." },
    ],
  },
  {
    title: "Materials",
    reports: [
      { name: "Stock & Materials", question: "What material is left on site?", shows: "Allocated, used and remaining for each material." },
      { name: "Procurement Exceptions", question: "Which orders need chasing?", shows: "Late deliveries and goods received but not billed." },
    ],
  },
  {
    title: "BOQ & Billing",
    reports: [
      { name: "Statements & Retention", question: "Where does each contractor account stand?", shows: "Billed, paid, retention held and balance due." },
      { name: "Month File", question: "What came in and went out this month?", shows: "A project's collections and costs for any period." },
    ],
  },
];

export const REPORT_COUNT = REPORT_GROUPS.reduce((n, g) => n + g.reports.length, 0);
