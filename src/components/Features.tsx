import { 
  FolderKanban, 
  Users, 
  Package, 
  Truck,
  Wallet,
  FileText,
  Wifi,
  Globe
} from "lucide-react";

const features = [
  {
    icon: FolderKanban,
    title: "Project Management & Tracking",
    description: "Track project progress, milestones, and timelines with real-time updates from the field.",
  },
  {
    icon: Users,
    title: "Labour Attendance & Workforce",
    description: "Manage worker attendance, shifts, and workforce allocation across multiple sites.",
  },
  {
    icon: Package,
    title: "Material Procurement & Inventory",
    description: "Track materials, manage stock levels, and streamline procurement workflows.",
  },
  {
    icon: Truck,
    title: "Vendor & Supplier Management",
    description: "Manage vendor relationships, purchase orders, and supplier performance.",
  },
  {
    icon: Wallet,
    title: "Expense Tracking & Budgeting",
    description: "Monitor project expenses, manage budgets, and track cost overruns in real-time.",
  },
  {
    icon: FileText,
    title: "Site Reports & Documentation",
    description: "Generate daily reports, capture site photos, and maintain project documentation.",
  },
  {
    icon: Wifi,
    title: "Offline-First Architecture",
    description: "Works seamlessly in low-network construction sites with automatic data sync.",
  },
  {
    icon: Globe,
    title: "Multilingual Interface",
    description: "Available in multiple languages for diverse field teams across India.",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative bg-secondary/30 py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Features
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Everything You Need to{" "}
            <span className="text-gradient">Run Construction Sites</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A complete ERP solution designed specifically for the unique challenges of construction management.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group premium-card p-6 transition-all duration-300 hover:border-primary/30"
            >
              {/* Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              
              {/* Content */}
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;