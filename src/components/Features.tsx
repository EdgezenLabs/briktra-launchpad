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
        <div className="mx-auto mb-20 max-w-3xl text-center">

          {/* FEATURES Heading - Same font style, bigger */}
          <h2 className="mb-6 font-display text-5xl md:text-6xl font-bold text-foreground">
            Features
          </h2>

          {/* Sub Heading - Smaller */}
          <h3 className="mb-4 font-display text-2xl md:text-3xl font-semibold text-foreground">
            Everything You Need to Run Construction Sites
          </h3>

          {/* Description - Smaller */}
          <p className="text-base md:text-lg text-muted-foreground">
            A complete ERP solution designed specifically for the unique
            challenges of construction management.
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