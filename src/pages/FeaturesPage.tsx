import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import { FEATURE_GROUPS } from "@/lib/content";
import { CheckList, CtaBand } from "@/components/site/Blocks";
import { PhoneFrame, shot } from "@/components/site/Shots";
import { Reveal } from "@/components/site/Experience";
import { GROUP_ICON, PageHero } from "@/components/site/PageHero";

/** Everything in Briktra on one page, for people comparing apps. */
const FeaturesPage = () => (
  <PageShell
    title="Construction Management Software Features"
    description="Every Briktra feature: labour attendance and payroll, site cash, purchase and stock, BOQ and RA billing, a home buyer app and reports. All on every plan."
    path="/features"
    crumbs={[{ name: "Features", path: "/features" }]}
  >
    <PageHero
      eyebrow="All Features"
      title="Everything in Briktra,"
      highlight="on every plan."
      intro="Six integrated modules for contractors and builders. Every plan includes all of them; plans differ only in the number of sites, workers and logins."
    >
      <nav className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2" aria-label="Modules">
        {FEATURE_GROUPS.map((g) => {
          const Icon = GROUP_ICON[g.slug];
          return (
            <a
              key={g.slug}
              href={`#${g.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition-colors hover:border-primary hover:bg-primary/15 hover:text-white"
            >
              <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
              {g.name}
            </a>
          );
        })}
      </nav>
    </PageHero>

    {FEATURE_GROUPS.map((g, i) => {
      const Icon = GROUP_ICON[g.slug];
      const web = g.shots.web ? shot(g.shots.web, "web") : undefined;
      const tinted = i % 2 === 1;
      return (
        <section
          key={g.slug}
          id={g.slug}
          className={`scroll-mt-32 py-20 ${tinted ? "bg-[hsl(30_33%_97%)]" : ""}`}
          aria-labelledby={`${g.slug}-heading`}
        >
          <div className="container mx-auto grid items-start gap-12 px-4 md:px-6 lg:grid-cols-[1.15fr_1fr]">
            <div className={tinted ? "lg:order-2" : ""}>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_10px_24px_-8px_hsl(24_95%_53%/0.8)]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 id={`${g.slug}-heading`} className="font-display text-3xl font-bold text-foreground">{g.name}</h2>
                  <p className="text-muted-foreground">{g.summary}</p>
                </div>
              </div>
              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                {g.sections.map((s) => (
                  <div key={s.title}>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/70">{s.title}</h3>
                    <CheckList items={s.points} />
                  </div>
                ))}
              </div>
              <Link to={`/${g.slug}`} className="mt-8 inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                See {g.name} in Detail <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <Reveal className={tinted ? "lg:order-1" : ""}>
              <div className="relative">
                <div className="h-80 overflow-hidden rounded-3xl border border-border shadow-2xl lg:h-[26rem]">
                  {web && (
                    <img src={web} alt={`${g.name} on the web app`} width={1600} height={1000} loading="lazy" className="h-full w-full origin-[85%_20%] scale-[1.25] object-cover object-[88%_18%]" />
                  )}
                </div>
                <div className="absolute -bottom-8 -right-3 w-36 sm:w-40">
                  <PhoneFrame shotKey={g.shots.phone} alt={`${g.name} on the Android app`} />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      );
    })}

    <CtaBand title="See it on your own sites" />
  </PageShell>
);

export default FeaturesPage;
