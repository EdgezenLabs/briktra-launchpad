import { 
  MapPin, 
  Building2, 
  Smartphone, 
  Shield,
  Check
} from "lucide-react";

const reasons = [
  {
    icon: MapPin,
    title: "Built for Indian Workflows",
    description: "Designed specifically for Indian construction industry practices, compliance requirements, and local business needs.",
    highlights: ["GST Compliant", "Rupee-based", "Hindi Support"],
  },
  {
    icon: Building2,
    title: "Multi-Tenant & Scalable",
    description: "Support multiple projects, sites, and teams from a single dashboard. Scale seamlessly as your business grows.",
    highlights: ["Unlimited Projects", "Team Management", "Role-based Access"],
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Purpose-built mobile app for site supervisors. Manage attendance, expenses, and updates on the go.",
    highlights: ["Offline Mode", "Quick Actions", "Real-time Sync"],
  },
  {
    icon: Shield,
    title: "Secure & Cloud-Based",
    description: "Enterprise-grade security with encrypted data storage. Access your data securely from anywhere.",
    highlights: ["Data Encryption", "Auto Backups", "99.9% Uptime"],
  },
];

const WhyBriktra = () => {
  return (
    <section id="why" className="relative bg-section-medium py-24">
      {/* Decorative line */}
      <div className="section-divider absolute top-0"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-sm font-medium text-accent">
            Why Choose Us
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Built Different.{" "}
            <span className="text-gradient">Built Better.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Unlike generic project management tools, Briktra understands the unique challenges of construction management.
          </p>
        </div>

        {/* Reasons grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className="group relative rounded-2xl border border-border/50 bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex gap-5">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 text-primary transition-transform group-hover:scale-110">
                    <reason.icon className="h-7 w-7" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                    {reason.title}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                    {reason.description}
                  </p>
                  
                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {reason.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        <Check className="h-3 w-3" />
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Background accent on hover */}
              <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-20 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { value: "500+", label: "Pre-registered Users" },
            { value: "6", label: "Integrated Modules" },
            { value: "100%", label: "Cloud-Based" },
            { value: "24/7", label: "Support Ready" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl font-bold text-gradient-accent md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBriktra;
