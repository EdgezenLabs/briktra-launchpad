import { useState } from "react";
import {
  Users,
  Wallet,
  FileText,
  Briefcase,
  UserCheck,
  Building2,
  CalendarDays,
  CreditCard,
  FileBadge,
  Globe,
  ShieldCheck,
  Newspaper,
  LayoutGrid
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Labour Management",
    description: "Manage workers assigned to projects with detailed profiles and histories.",
  },
  {
    icon: FileBadge,
    title: "Contracts Management",
    description: "Create, manage, and track all contractor agreements and terms.",
  },
  {
    icon: CalendarDays,
    title: "Milestone Tracking",
    description: "Set start and end dates to visualize progress and prevent project delays.",
  },
  {
    icon: LayoutGrid,
    title: "Unit Management",
    description: "Track sales and construction status for every individual plot or apartment unit.",
  },
  {
    icon: Briefcase,
    title: "Salary & Payroll",
    description: "Manage complex employee salaries and disburse payments directly.",
  },
  {
    icon: CreditCard,
    title: "Advance Tracking",
    description: "Record and auto-deduct employee salary advances accurately.",
  },
  {
    icon: Building2,
    title: "Supplier Relations",
    description: "Maintain supplier databases and manage material billing.",
  },
  {
    icon: Newspaper,
    title: "Daily Updates & Notes",
    description: "Stay in sync with daily site photos, activity feeds, and progress notes.",
  },
  {
    icon: FileText,
    title: "Document Wallet",
    description: "Securely store and share all vital project and company documents.",
  },
  {
    icon: UserCheck,
    title: "Attendance Management",
    description: "Digitally mark and track employee attendance with geo-tagging.",
  },
  {
    icon: FileText,
    title: "Bills Management",
    description: "Manage and verify material bills and site expenses with status tracking.",
  },
  {
    icon: LayoutGrid, // Stock use Package usually, but I'll use LayoutGrid or check ModuleExplore
    title: "Stock Management",
    description: "Keep track of materials and inventory levels across all your project sites.",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative bg-secondary/30 py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="mx-auto mb-20 max-w-3xl text-center">

          {/* Section Marker */}
          <span className="mb-6 flex items-center justify-center gap-2 mx-auto w-fit rounded-full border-2 border-primary/30 bg-primary/10 px-6 py-2.5 text-lg md:text-xl font-bold uppercase tracking-wider text-primary shadow-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            <LayoutGrid className="h-5 w-5 md:h-6 md:w-6" />
            Construction ERP Features
          </span>

          {/* Main Title */}
          <h2 className="mb-6 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Everything You Need, Built In
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground">
            A comprehensive suite of tools mapping directly to your on-site workflows. Hover, tap, or focus a card to reveal more.
          </p>

        </div>

        {/* Features grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

// WEB-006: the flip reveal was hover-only (CSS :hover), so touch and
// keyboard users could never see a card's description. This tracks an
// explicit flipped state toggled by click/tap or Enter/Space when
// focused, in addition to keeping the hover flip for desktop mouse
// users -- so every input method can reach the same content.
const FeatureCard = ({
  feature,
}: {
  feature: { icon: typeof Users; title: string; description: string };
}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={flipped}
      aria-label={`${feature.title}: ${flipped ? feature.description : "activate to reveal description"}`}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((f) => !f);
        }
      }}
      className="group relative h-auto min-h-[220px] w-full cursor-pointer [perspective:1000px] motion-reduce:[perspective:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
    >
      <div
        className={`relative h-full w-full rounded-2xl motion-reduce:[transform:none] transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)] motion-reduce:group-hover:[transform:none] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >

        {/* Front Face */}
        <div className="premium-card absolute inset-0 flex flex-col items-center justify-center p-6 text-center [backface-visibility:hidden] z-20">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300">
            <feature.icon className="h-8 w-8" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">
            {feature.title}
          </h3>
        </div>

        {/* Back Face — visible on mobile without hover */}
        <div className="premium-card absolute inset-0 flex flex-col items-center justify-center p-6 text-center [transform:rotateY(180deg)] [backface-visibility:hidden] bg-primary/5 border-primary/30 shadow-inner z-10 motion-reduce:static motion-reduce:[transform:none] motion-reduce:opacity-100 md:motion-reduce:static">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <feature.icon className="h-5 w-5" />
          </div>
          <h3 className="mb-2 font-display text-base font-bold text-foreground">
            {feature.title}
          </h3>
          <p className="text-sm text-foreground/80 leading-relaxed font-medium">
            {feature.description}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Features;