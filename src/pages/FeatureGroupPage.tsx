import { Link } from "react-router-dom";
import { ArrowRight, BadgeIndianRupee, CheckCircle2, Package, ReceiptText, Wallet, type LucideIcon } from "lucide-react";
import PageShell from "@/components/PageShell";
import { FEATURE_GROUPS, featureBySlug } from "@/lib/content";
import { CheckList, CtaBand } from "@/components/site/Blocks";
import { BrowserFrame, PhoneFrame } from "@/components/site/Shots";
import { LiveCard, Reveal } from "@/components/site/Experience";
import { GROUP_ICON, PageHero } from "@/components/site/PageHero";
import NotFound from "@/pages/NotFound";
import { ReportsShowcase } from "@/components/site/ReportsShowcase";

/** A figure from the demo company, floating over each page's screens. */
const LIVE: Record<string, { icon: LucideIcon; tone: string; title: string; sub: string }> = {
  "labour-payroll": { icon: BadgeIndianRupee, tone: "bg-primary/25 text-orange-200", title: "₹1,69,965 pay run approved", sub: "32 workers · 4 sites" },
  "site-management": { icon: Wallet, tone: "bg-emerald-500/20 text-emerald-300", title: "₹61,950 cash at site", sub: "Within the ₹75,000 imprest limit" },
  "purchase-stock": { icon: Package, tone: "bg-sky-500/20 text-sky-200", title: "Purchase order approved", sub: "600 bags of cement · Tower A" },
  "boq-billing": { icon: ReceiptText, tone: "bg-sky-500/20 text-sky-200", title: "RA bill approved", sub: "Tower A · ₹1.48 Cr net" },
  customers: { icon: CheckCircle2, tone: "bg-emerald-500/20 text-emerald-300", title: "Villa 1 · 60% built", sub: "58% of instalments paid" },
  "control-reports": { icon: CheckCircle2, tone: "bg-primary/25 text-orange-200", title: "2 bills to approve", sub: "₹1.52 L waiting · all sites" },
};

/** One page per feature group: /labour-payroll, /boq-billing and so on. */
const FeatureGroupPage = ({ slug }: { slug: string }) => {
  const group = featureBySlug(slug);
  if (!group) return <NotFound />;
  const others = FEATURE_GROUPS.filter((g) => g.slug !== slug);
  const live = LIVE[slug];
  const Icon = GROUP_ICON[slug];

  const visual = (
    <div className="relative mx-auto w-full max-w-[42rem] pb-10 pt-4">
      <div className="bk-tilt rounded-xl ring-1 ring-white/10">
        <BrowserFrame priority shotKey={group.shots.web} alt={`${group.name} on the web app`} className="shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)]" />
      </div>
      <div className="bk-float-slow absolute -bottom-6 right-0 z-10 w-[30%] min-w-[8rem] max-w-[11rem]">
        <PhoneFrame priority shotKey={group.shots.phone} alt={`${group.name} on the Android app`} />
      </div>
      {live && <LiveCard icon={live.icon} tone={live.tone} title={live.title} sub={live.sub} className="-left-2 bottom-10 sm:-left-10" delay={400} />}
    </div>
  );

  return (
    <PageShell
      title={group.seoTitle}
      description={group.seoDescription}
      path={`/${group.slug}`}
      crumbs={[
        { name: "Features", path: "/features" },
        { name: group.name, path: `/${group.slug}` },
      ]}
    >
      <PageHero eyebrow={group.name} title={group.headline} intro={group.intro} visual={visual} />

      {/* Highlights, overlapping the hero. */}
      <div className="relative z-10 -mt-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-3 rounded-3xl border border-border bg-card p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] sm:grid-cols-2 lg:grid-cols-3">
            {group.highlights.map((h) => (
              <div key={h} className="flex items-start gap-3 rounded-2xl p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-[15px] font-medium leading-snug text-foreground">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {slug === "control-reports" && <ReportsShowcase showLink={false} />}

      <section className="py-24" aria-labelledby="detail-heading">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">In detail</p>
            <h2 id="detail-heading" className="mt-3 text-balance font-display text-4xl font-bold leading-tight text-foreground">
              Everything in {group.name}
            </h2>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {group.sections.map((s, i) => (
              <Reveal key={s.title} delay={(i % 2) * 100}>
                <div className="group h-full rounded-3xl border border-border bg-gradient-to-br from-card to-[hsl(30_33%_98%)] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-[0_8px_20px_-6px_hsl(24_95%_53%/0.7)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-xl font-bold text-foreground">{s.title}</h3>
                  </div>
                  <div className="mt-6">
                    <CheckList items={s.points} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The screen, large. */}
      <section className="relative overflow-hidden bg-[hsl(30_33%_97%)] py-24" aria-label={`${group.name} screen`}>
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[110px]" />
        <div className="container relative mx-auto px-4 md:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-primary">See it in Briktra</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-balance text-center font-display text-3xl font-bold text-foreground md:text-4xl">
            The same screen your team will use
          </h2>
          <Reveal className="mx-auto mt-12 max-w-5xl">
            <BrowserFrame shotKey={group.shots.web} alt={`${group.name} on the web app`} />
          </Reveal>
          <p className="mt-6 text-center text-sm text-muted-foreground">Screens shown are from a demo company.</p>
        </div>
      </section>

      <section className="border-y border-border bg-card py-10" aria-label="Included in every plan">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:px-6 md:text-left">
          <p className="font-display text-xl font-bold text-foreground">
            {group.name} is included in every plan, from ₹999 a month.
          </p>
          <Link to="/pricing" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
            See Plans and Prices <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="py-20" aria-labelledby="more-heading">
        <div className="container mx-auto px-4 md:px-6">
          <h2 id="more-heading" className="font-display text-3xl font-bold text-foreground">More in Briktra</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((g) => {
              const GIcon = GROUP_ICON[g.slug];
              return (
                <Link key={g.slug} to={`/${g.slug}`} className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <GIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-4 font-semibold text-foreground">{g.name}</p>
                  <p className="mt-1 text-sm leading-snug text-muted-foreground">{g.summary}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand />
    </PageShell>
  );
};

export default FeatureGroupPage;
