import { FolderKanban, Users, Package, Wallet, FileBarChart, ChevronRight } from "lucide-react";

const workflowSteps = [
  {
    icon: FolderKanban,
    title: "Project",
    description: "Create and manage projects",
  },
  {
    icon: Users,
    title: "Labour",
    description: "Assign workforce",
  },
  {
    icon: Package,
    title: "Materials",
    description: "Track inventory",
  },
  {
    icon: Wallet,
    title: "Expenses",
    description: "Monitor costs",
  },
  {
    icon: FileBarChart,
    title: "Reports",
    description: "Generate insights",
  },
];

const WorkflowVisualization = () => {
  return (
    <section id="workflow" className="relative bg-background py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            How It Works
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Simple ERP Workflow
          </h2>
          <p className="text-lg text-muted-foreground">
            A streamlined flow that connects all aspects of your construction operations.
          </p>
        </div>

        {/* Workflow visualization - Desktop */}
        <div className="hidden lg:flex items-center justify-center gap-2 max-w-5xl mx-auto">
          {workflowSteps.map((step, index) => (
            <div key={step.title} className="flex items-center">
              {/* Step card */}
              <div className="premium-card group flex flex-col items-center p-6 text-center min-w-[160px] transition-all duration-300 hover:border-primary/30">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <step.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
              
              {/* Connector arrow */}
              {index < workflowSteps.length - 1 && (
                <div className="flex items-center px-2">
                  <ChevronRight className="h-6 w-6 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Workflow visualization - Mobile/Tablet */}
        <div className="lg:hidden grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {workflowSteps.map((step, index) => (
            <div
              key={step.title}
              className="premium-card group flex items-center gap-4 p-5 transition-all duration-300 hover:border-primary/30"
            >
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <step.icon className="h-6 w-6" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary">Step {index + 1}</span>
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowVisualization;
