import { HardHat, Compass, Briefcase, ShoppingCart, Calculator, UsersRound } from "lucide-react";

const userRoles = [
  {
    icon: HardHat,
    title: "Builders & Contractors",
    description: "Manage multiple projects, track progress, and oversee all site operations from one platform.",
  },
  {
    icon: Compass,
    title: "Site Engineers",
    description: "Record daily progress, manage material usage, and coordinate with field teams efficiently.",
  },
  {
    icon: Briefcase,
    title: "Project Managers",
    description: "Monitor timelines, budgets, and resources with real-time dashboards and reports.",
  },
  {
    icon: ShoppingCart,
    title: "Procurement Teams",
    description: "Handle purchase orders, vendor management, and inventory tracking seamlessly.",
  },
  {
    icon: Calculator,
    title: "Finance Teams",
    description: "Process payroll, track expenses, manage payments, and ensure compliance.",
  },
];

const WhoUsesBriktra = () => {
  return (
    <section id="users" className="relative bg-secondary/30 py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-6 flex items-center justify-center gap-2 mx-auto w-fit rounded-full border-2 border-primary/30 bg-primary/10 px-6 py-2.5 text-lg md:text-xl font-bold uppercase tracking-wider text-primary shadow-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            <UsersRound className="h-5 w-5 md:h-6 md:w-6" />
            For Your Team
          </span>
          <h2 className="mb-6 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Who Uses <span className="text-foreground">Briktra</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Designed for every role in your construction organization.
          </p>
        </div>

        {/* User roles grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {userRoles.map((role, index) => (
            <div
              key={role.title}
              className="premium-card group p-6 text-center transition-all duration-300 hover:border-primary/30"
            >
              {/* Icon */}
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <role.icon className="h-7 w-7" />
              </div>
              
              {/* Content */}
              <h3 className="mb-2 font-display text-base font-semibold text-foreground">
                {role.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {role.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoUsesBriktra;
