import {
  Building2,
  MapPin,
  Users,
  UserCheck,
  Wallet,
  ShoppingCart,
  Package,
  BarChart3,
  Receipt,
  FileBadge,
  LayoutDashboard,
  LineChart,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export interface ProductModule {
  icon: LucideIcon;
  title: string;
  description: string;
  highlights: string[];
}

export const PRODUCT_MODULES: ProductModule[] = [
  {
    icon: Building2,
    title: "Projects",
    description:
      "Create and manage construction projects with budgets, timelines, milestones, and progress tracking across your portfolio.",
    highlights: ["Project hierarchy", "Budget vs actual", "Milestone tracking"],
  },
  {
    icon: MapPin,
    title: "Sites",
    description:
      "Organize multiple worksites under each project. Track site-level activity, supervisors, and daily operations in one place.",
    highlights: ["Multi-site support", "Site supervisors", "Daily site logs"],
  },
  {
    icon: Users,
    title: "Labour Management",
    description:
      "Maintain worker profiles, assign labour to projects, track contractor agreements, and manage workforce costs.",
    highlights: ["Worker profiles", "Contractor management", "Role assignments"],
  },
  {
    icon: UserCheck,
    title: "Attendance",
    description:
      "Mark daily attendance with present, absent, and half-day options. GPS-tagged attendance available on higher plans.",
    highlights: ["Daily attendance", "GPS tagging (Pro+)", "Attendance reports"],
  },
  {
    icon: Wallet,
    title: "Expenses",
    description:
      "Capture site expenses with receipt photos, categorize spending, and monitor project-level profitability.",
    highlights: ["Receipt capture", "Expense categories", "Approval workflows (Premium)"],
  },
  {
    icon: ShoppingCart,
    title: "Purchase",
    description:
      "Manage supplier relationships, link bills to purchases, and generate purchase orders on Premium plans.",
    highlights: ["Supplier directory", "Purchase orders", "Bill linkage"],
  },
  {
    icon: Package,
    title: "Inventory",
    description:
      "Track materials and stock levels across project sites with low-stock alerts and inventory reports.",
    highlights: ["Stock tracking", "Low-stock alerts", "Site-wise inventory"],
  },
  {
    icon: BarChart3,
    title: "Reports",
    description:
      "Generate project, labour, expense, and financial reports. Export to PDF and Excel on supported plans.",
    highlights: ["PDF / Excel export", "Portfolio reports", "Custom report views"],
  },
  {
    icon: Receipt,
    title: "Billing",
    description:
      "Manage material bills, site expenses, and subscription invoices. View payment history within the app.",
    highlights: ["Bill management", "Payment history", "Subscription invoices"],
  },
  {
    icon: FileBadge,
    title: "GST",
    description:
      "Record GST-applicable transactions and maintain compliant billing documentation for Indian construction businesses.",
    highlights: ["GST-ready records", "Tax documentation", "Invoice support"],
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description:
      "Get a real-time overview of projects, attendance, expenses, and key KPIs from a unified command center.",
    highlights: ["KPI overview", "Project snapshots", "Quick actions"],
  },
  {
    icon: LineChart,
    title: "Analytics",
    description:
      "Analyze profitability, cash flow, and budget performance with financial analytics on Pro and Premium plans.",
    highlights: ["P&L analytics", "Budget tracking", "Portfolio insights"],
  },
  {
    icon: ShieldCheck,
    title: "Role Based Access",
    description:
      "Control who sees and edits data with admin, supervisor, and employee roles. Secure OTP and biometric login.",
    highlights: ["RBAC", "OTP login", "Biometric auth"],
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    description:
      "Field-optimized Android and iOS apps with multilingual support (English, Hindi, Tamil) for on-site teams.",
    highlights: ["Mobile-first UX", "Cloud sync", "EN / HI / TA"],
  },
];
