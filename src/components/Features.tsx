import { 
  ClipboardList, 
  Users, 
  Wallet, 
  Package, 
  CreditCard, 
  FileText,
  TrendingUp,
  Calendar
} from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Project Tracking",
    description: "Monitor site progress, milestones, and deliverables in real-time with visual dashboards.",
    color: "primary",
  },
  {
    icon: Users,
    title: "Manpower & Attendance",
    description: "Track workforce attendance, shifts, and productivity with mobile check-ins.",
    color: "accent",
  },
  {
    icon: Wallet,
    title: "Payroll Automation",
    description: "Automate salary calculations, advances, and payments for your entire workforce.",
    color: "primary",
  },
  {
    icon: Package,
    title: "Stock & Inventory",
    description: "Manage materials, track stock levels, and automate reorder alerts.",
    color: "accent",
  },
  {
    icon: CreditCard,
    title: "Vendor Payments",
    description: "Streamline vendor payments, track dues, and maintain payment history.",
    color: "primary",
  },
  {
    icon: FileText,
    title: "GST & Compliance",
    description: "Generate GST-compliant invoices and financial reports effortlessly.",
    color: "accent",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative bg-section-dark py-24">
      {/* Background elements */}
      <div className="absolute left-0 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-[100px]"></div>
      <div className="absolute right-0 bottom-1/4 h-64 w-64 rounded-full bg-accent/5 blur-[100px]"></div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Platform Modules
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Everything You Need to{" "}
            <span className="text-gradient-accent">Build Smarter</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Six powerful modules designed for Indian construction workflows. Manage your entire operation from one platform.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="feature-card group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                feature.color === "accent" 
                  ? "bg-accent/10 text-accent" 
                  : "bg-primary/10 text-primary"
              }`}>
                <feature.icon className="h-6 w-6" />
              </div>
              
              {/* Content */}
              <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover indicator */}
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                <span>Learn more</span>
                <TrendingUp className="h-4 w-4" />
              </div>

              {/* Corner accent */}
              <div className={`absolute -right-12 -top-12 h-24 w-24 rounded-full opacity-0 transition-opacity group-hover:opacity-100 ${
                feature.color === "accent" 
                  ? "bg-accent/10" 
                  : "bg-primary/10"
              } blur-2xl`}></div>
            </div>
          ))}
        </div>

        {/* Video preview section */}
        <div className="mt-20">
          <div className="mx-auto max-w-4xl">
            <div className="feature-card overflow-hidden p-0">
              <div className="relative aspect-video bg-gradient-to-br from-secondary to-muted">
                {/* Video placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer glow-primary">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                        <svg className="h-6 w-6 translate-x-0.5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    <p className="font-display text-lg font-semibold text-foreground">Platform Demo</p>
                    <p className="text-sm text-muted-foreground">See Briktra in action</p>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute left-4 top-4 flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive/50"></div>
                  <div className="h-3 w-3 rounded-full bg-accent/50"></div>
                  <div className="h-3 w-3 rounded-full bg-primary/50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
