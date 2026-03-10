import { Building2, Users, Wallet, Briefcase, FileBarChart, ChevronRight, ListTodo, ClipboardList, HardHat, ShoppingCart, Banknote, PieChart } from "lucide-react";

const workflowSteps = [
  {
    icon: ClipboardList,
    title: "Setup Projects",
    description: "Create projects, define roles, and set budgets & milestones.",
  },
  {
    icon: Users,
    title: "Onboard Labour",
    description: "Register workers, set wages, and manage daily attendance.",
  },
  {
    icon: HardHat,
    title: "Site Updates",
    description: "Log daily work progress, machinery usage, and incidents.",
  },
  {
    icon: ShoppingCart,
    title: "Procurement",
    description: "Track material requests, supplier invoices, and inventory.",
  },
  {
    icon: Banknote,
    title: "Approvals & Pay",
    description: "Approve advances, calculate salaries, and settle vendor bills.",
  },
  {
    icon: PieChart,
    title: "Live Analytics",
    description: "Instant insights into cost overruns and overall project health.",
  },
];

const WorkflowVisualization = () => {
  return (
    <section id="workflow" className="relative bg-background py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-6 flex items-center justify-center gap-2 mx-auto w-fit rounded-full border-2 border-primary/30 bg-primary/10 px-6 py-2.5 text-lg md:text-xl font-bold uppercase tracking-wider text-primary shadow-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            <ListTodo className="h-5 w-5 md:h-6 md:w-6" />
            How It Works
          </span>
          <h2 className="mb-6 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Simple ERP Workflow
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            A streamlined flow that connects all aspects of your construction operations.
          </p>
        </div>

        {/* Workflow steps vertical layout for mobile, grid for desktop */}
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {workflowSteps.map((step, index) => (
              <div
                key={step.title}
                className="group relative flex flex-col items-center rounded-3xl border-2 border-border bg-card p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-110 z-10">
                  {index + 1}
                </div>

                <div className="mb-6 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground shadow-inner">
                  <step.icon className="h-10 w-10" />
                </div>
                
                <h3 className="mb-3 font-display text-2xl font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowVisualization;
