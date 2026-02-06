import { WifiOff, HardHat, Zap, Languages } from "lucide-react";

const differentiators = [
  {
    icon: WifiOff,
    title: "Works Offline",
    description: "Full functionality in low-network construction sites. Data syncs automatically when connection is restored.",
  },
  {
    icon: HardHat,
    title: "Designed for the Field",
    description: "Built specifically for supervisors, engineers, and contractors who work on-site every day.",
  },
  {
    icon: Zap,
    title: "Lightweight & Fast",
    description: "Optimized mobile performance that works smoothly even on basic smartphones.",
  },
  {
    icon: Languages,
    title: "Multilingual Usability",
    description: "Interface available in Hindi, Tamil, Telugu, and more for seamless adoption by field teams.",
  },
];

const BuiltForField = () => {
  return (
    <section id="why" className="relative bg-foreground py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Why Briktra
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold text-background md:text-4xl lg:text-5xl">
            Built for the Field
          </h2>
          <p className="text-lg text-background/70">
            Unlike office software adapted for construction, Briktra is purpose-built for real site conditions.
          </p>
        </div>

        {/* Differentiators grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((item, index) => (
            <div
              key={item.title}
              className="group text-center"
            >
              {/* Icon */}
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-110">
                <item.icon className="h-8 w-8" />
              </div>
              
              {/* Content */}
              <h3 className="mb-3 font-display text-xl font-semibold text-background">
                {item.title}
              </h3>
              <p className="text-sm text-background/70 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuiltForField;
