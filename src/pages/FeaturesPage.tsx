import PageShell from "@/components/PageShell";
import { PRODUCT_MODULES } from "@/lib/features-data";
import { SITE } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LayoutGrid, ArrowRight } from "lucide-react";

const FeaturesPage = () => (
  <PageShell
    title="Features"
    description="Explore Briktra modules: projects, sites, labour, attendance, expenses, inventory, billing, GST, reports, analytics, and mobile app."
    canonical={`${SITE.url}/features`}
  >
    <section className="bg-secondary/30 pt-28 pb-16">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-primary/10 px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-primary">
          <LayoutGrid className="h-5 w-5" aria-hidden="true" />
          Platform Modules
        </span>
        <h1 className="mb-6 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
          Every Module Your Construction Business Needs
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
          {SITE.name} is a complete construction ERP — from site attendance to GST-ready billing, unified on web and mobile.
        </p>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_MODULES.map((module) => (
            <article
              key={module.title}
              className="premium-card flex flex-col p-8 transition-all hover:border-primary/30"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <module.icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 className="mb-3 font-display text-xl font-bold text-foreground">{module.title}</h2>
              <p className="mb-5 flex-1 text-muted-foreground leading-relaxed">{module.description}</p>
              <ul className="space-y-2">
                {module.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">Want a guided tour of each module with screenshots?</p>
          <Button variant="outline" asChild>
            <Link to="/explore">
              Explore Module Screenshots
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  </PageShell>
);

export default FeaturesPage;
