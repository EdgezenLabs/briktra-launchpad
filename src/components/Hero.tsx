import { HardHat, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroMobileImg from "@/assets/hero-mobile-v3.png";
import heroWebImg from "@/assets/hero-web.png";
import heroReportsImg from "@/assets/hero-reports.png";
import briktraLogo from "@/assets/briktra-logo.svg";
import { SITE } from "@/lib/site-config";

const Hero = () => (
  <section className="relative min-h-screen overflow-hidden bg-background pt-16" aria-labelledby="hero-heading">
    <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden="true" />
    <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" aria-hidden="true" />
    <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[100px]" aria-hidden="true" />

    <div className="container relative z-10 mx-auto flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 py-20 text-center md:px-6">
      <div
        className="group mb-10 animate-fade-in opacity-0 relative flex flex-col items-center"
        style={{ animationDelay: "0.05s" }}
      >
        <div className="relative flex h-24 w-56 items-center justify-center md:h-32 md:w-72">
          <div className="absolute inset-[-30%] rounded-full bg-gradient-to-tr from-primary via-orange-500 to-amber-300 blur-3xl opacity-40" aria-hidden="true" />
          <div className="relative z-10 flex h-full w-full items-center justify-center rounded-3xl border border-border bg-white p-4 shadow-2xl md:p-6">
            <img
              src={briktraLogo}
              alt={`${SITE.name} — ${SITE.tagline}`}
              className="h-full w-full object-contain"
              width={280}
              height={80}
              fetchPriority="high"
            />
          </div>
        </div>
      </div>

      <span
        className="mb-6 flex animate-fade-in items-center justify-center gap-2 opacity-0 mx-auto w-fit rounded-full border-2 border-primary/30 bg-primary/10 px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-primary md:text-base"
        style={{ animationDelay: "0.1s" }}
      >
        <HardHat className="h-5 w-5" aria-hidden="true" />
        {SITE.tagline}
      </span>

      <h1
        id="hero-heading"
        className="mb-6 max-w-4xl animate-fade-in font-display text-4xl font-bold leading-tight text-foreground opacity-0 md:text-5xl lg:text-6xl"
        style={{ animationDelay: "0.2s" }}
      >
        Run Every Construction Project from One{" "}
        <span className="text-primary">Cloud ERP</span>
      </h1>

      <p
        className="mb-10 max-w-2xl animate-fade-in text-lg text-muted-foreground opacity-0 md:text-xl"
        style={{ animationDelay: "0.3s" }}
      >
        Manage projects, sites, labour, attendance, expenses, inventory, billing, and GST —
        built for contractors and construction companies across India.
      </p>

      <div
        className="mb-14 flex animate-fade-in flex-col items-center gap-4 opacity-0 sm:flex-row"
        style={{ animationDelay: "0.4s" }}
      >
        <Button size="xl" className="min-w-[200px] rounded-2xl px-10 py-6 text-lg font-bold shadow-xl" asChild>
          <a href={SITE.appUrl}>Start Free Trial</a>
        </Button>
        <Button size="xl" variant="outline" className="min-w-[200px] rounded-2xl px-10 py-6 text-lg font-semibold" asChild>
          <a href={SITE.appUrl}>Login to Briktra</a>
        </Button>
      </div>

      <div
        className="mb-16 grid w-full max-w-6xl grid-cols-1 gap-8 animate-fade-in opacity-0 md:grid-cols-3"
        style={{ animationDelay: "0.5s" }}
      >
        {[
          { src: heroMobileImg, alt: "Briktra mobile app for construction site supervisors", title: "Mobile App", sub: "Field-ready for supervisors" },
          { src: heroWebImg, alt: "Briktra web dashboard for construction management", title: "Web Dashboard", sub: "Full ERP control center", className: "md:-translate-y-4" },
          { src: heroReportsImg, alt: "Real-time construction reports in Briktra", title: "Reports & Analytics", sub: "Live project insights" },
        ].map((item) => (
          <div
            key={item.title}
            className={`premium-card group overflow-hidden rounded-3xl border-2 border-border bg-card transition-all hover:border-primary/50 hover:shadow-2xl ${item.className ?? ""}`}
          >
            <div className="relative h-64 overflow-hidden md:h-72">
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-full object-cover object-center"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute bottom-4 left-0 right-0 px-4">
                <p className="text-lg font-bold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="flex animate-fade-in flex-col items-center gap-4 opacity-0"
        style={{ animationDelay: "0.6s" }}
        role="img"
        aria-label="Product video placeholder"
      >
        <div className="flex h-40 w-full max-w-xl items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Play className="h-10 w-10 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium">Product walkthrough video — coming soon</span>
          </div>
        </div>
      </div>
    </div>

    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" aria-hidden="true" />
  </section>
);

export default Hero;
