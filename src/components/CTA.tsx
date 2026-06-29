import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SITE } from "@/lib/site-config";

const CTA = () => (
  <section id="cta" className="relative bg-background py-24" aria-labelledby="cta-heading">
    <div className="container mx-auto px-4 md:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="premium-card overflow-hidden">
          <div className="relative p-8 text-center md:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" aria-hidden="true" />

            <div className="relative z-10">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-primary/10 px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-primary">
                <Rocket className="h-5 w-5" aria-hidden="true" />
                Get Started Today
              </span>

              <h2 id="cta-heading" className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
                Ready to Streamline Your Construction Operations?
              </h2>

              <p className="mb-8 text-lg text-muted-foreground">
                Start your free trial, explore all modules, and upgrade when you are ready.
                Transparent pricing with no hidden charges.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="min-w-[200px] font-bold" asChild>
                  <a href={SITE.appUrl}>
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="min-w-[200px]" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                Questions? <Link to="/contact" className="text-primary hover:underline">Contact our team</Link> or read the{" "}
                <Link to="/faq" className="text-primary hover:underline">FAQ</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CTA;
