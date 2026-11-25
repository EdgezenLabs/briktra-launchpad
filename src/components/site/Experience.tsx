import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeIndianRupee, CheckCircle2, Clock3, HardHat, Lock, Package, ReceiptText, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { appLinks } from "@/lib/app-links";
import { FEATURE_GROUPS, type ShotKey } from "@/lib/content";
import { BrowserFrame, PhoneFrame, shot as shotUrl } from "@/components/site/Shots";
import { PlayBadge } from "@/components/site/PlayBadge";

/** Softly lifts an element in the first time it scrolls into view. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return; // already on screen
    setShown(false);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

export const Reveal = ({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) => {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} data-shown={shown} className={`bk-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

/** Counts up to [to] once visible. */
const CountUp = ({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) => {
  const { ref, shown } = useReveal<HTMLSpanElement>();
  const [n, setN] = useState(to);
  useEffect(() => {
    if (!shown || typeof window === "undefined" || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1200);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setN(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shown, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

/** The hero's modules: each chip shows that module's real screens and links to its page. */
const HERO_MODULES: { label: string; web: ShotKey; phone: ShotKey; slug: string; screen: string }[] = [
  { label: "Attendance", web: "dashboard", phone: "attendance", slug: "labour-payroll", screen: "attendance" },
  { label: "Payroll", web: "payRun", phone: "attendance", slug: "labour-payroll", screen: "the weekly pay run" },
  { label: "Site Cash", web: "siteCash", phone: "dailyUpdates", slug: "site-management", screen: "site cash and daily updates" },
  { label: "Purchases", web: "purchase", phone: "stock", slug: "purchase-stock", screen: "purchase orders" },
  { label: "Stock", web: "purchase", phone: "stock", slug: "purchase-stock", screen: "stock" },
  { label: "BOQ & Billing", web: "boq", phone: "raBill", slug: "boq-billing", screen: "the BOQ and RA bills" },
  { label: "Home Buyers", web: "units", phone: "customerApp", slug: "customers", screen: "units and the home buyer app" },
  { label: "Reports", web: "reports", phone: "dashboard", slug: "control-reports", screen: "reports and the dashboard" },
];

const AUTO_ADVANCE_MS = 3200;

/** Loads both screens of a module before it is shown, so a swap never flashes empty frames. */
const preload = (m: (typeof HERO_MODULES)[number]) =>
  Promise.all(
    [shotUrl(m.web, "web"), shotUrl(m.phone, "phone")].map((src) => {
      if (!src) return Promise.resolve();
      const img = new Image();
      img.src = src;
      return img.decode().catch(() => undefined);
    }),
  );

/**
 * Which module the hero shows. It moves on by itself to show the range, and
 * stops for good once the visitor picks one (or prefers reduced motion).
 */
function useHeroModule() {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  // False until the first change, so the first paint is never faded.
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    if (!auto || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      const next = (index + 1) % HERO_MODULES.length;
      await preload(HERO_MODULES[next]);
      if (!cancelled) {
        setMoved(true);
        setIndex(next);
      }
    }, AUTO_ADVANCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [index, auto]);
  const pick = (n: number) => {
    setAuto(false);
    setMoved(true);
    setIndex(n);
  };
  return { module: HERO_MODULES[index], index, pick, swapClass: moved ? "bk-swap" : "" };
}

const ModulePicker = ({ index, pick }: { index: number; pick: (n: number) => void }) => (
  <div role="group" aria-label="Show a Briktra module" className="flex flex-wrap gap-2">
    {HERO_MODULES.map((m, n) => (
      <button
        key={m.label}
        type="button"
        aria-pressed={n === index}
        onClick={() => pick(n)}
        className={`rounded-full border px-3 py-1 text-sm font-medium transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(222_30%_8%)] ${
          n === index
            ? "border-primary bg-primary text-white shadow-[0_0_24px_-4px_hsl(24_95%_53%/0.9)]"
            : "border-white/15 bg-white/5 text-white/70 hover:border-white/40 hover:text-white"
        }`}
      >
        {m.label}
      </button>
    ))}
  </div>
);

export const LiveCard = ({ icon: Icon, tone, title, sub, className, delay }: { icon: typeof CheckCircle2; tone: string; title: string; sub: string; className: string; delay: number }) => (
  <div className={`bk-pop absolute z-20 ${className}`} style={{ animationDelay: `${delay}ms` }}>
    <div className="bk-float flex items-center gap-3 rounded-2xl border border-white/10 bg-[hsl(220_25%_12%/0.85)] px-4 py-3 shadow-2xl backdrop-blur-md" style={{ animationDelay: `${delay * 2}ms` }}>
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="block text-xs text-white/60">{sub}</span>
      </span>
    </div>
  </div>
);

export const CinematicHero = () => {
  const { module, index, pick, swapClass } = useHeroModule();
  const group = FEATURE_GROUPS.find((g) => g.slug === module.slug);
  return (
    <section className="relative overflow-hidden bg-[hsl(222_30%_8%)] text-white">
      <div className="bk-grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_60%_40%,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute -right-32 top-10 h-[40rem] w-[40rem] rounded-full bg-primary/25 blur-[140px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[hsl(200_90%_50%/0.12)] blur-[120px]" />

      <div className="container relative mx-auto grid items-center gap-14 px-4 pb-20 pt-16 md:px-6 lg:grid-cols-[1fr_1.1fr] lg:pb-28 lg:pt-24">
        <div>
          <h1 className="text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
            Run your entire construction business{" "}
            <span className="bg-gradient-to-r from-primary via-[hsl(32_100%_62%)] to-[hsl(44_100%_64%)] bg-clip-text text-transparent">
              from one app.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Built for Indian contractors and builders. Run everything from the Briktra Android app, or from the web
            when you are at a desk. The same data, everywhere.
          </p>
          <div className="mt-6">
            <ModulePicker index={index} pick={pick} />
            {group && (
              <Link
                to={`/${group.slug}`}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-orange-200 hover:text-white hover:underline"
              >
                Explore {group.name}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" className="h-12 px-7 text-base font-semibold shadow-[0_10px_40px_-8px_hsl(24_95%_53%/0.8)]" asChild>
              <a href={appLinks.freeTrial}>Start Free Trial</a>
            </Button>
            <PlayBadge />
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
            {["30 days free", "No card needed", "Every feature on every plan"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[44rem] pb-10 pt-6">
          {/* Live region so screen readers hear which module is now shown. */}
          <p className="sr-only" aria-live="polite">
            Showing {module.screen} in Briktra.
          </p>
          <div className="bk-tilt rounded-xl ring-1 ring-white/10">
            <div key={module.web} className={swapClass}>
              <BrowserFrame
                priority
                shotKey={module.web}
                alt={`Briktra web app showing ${module.screen}`}
                className="shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)]"
              />
            </div>
          </div>
          <div className="absolute -bottom-6 right-0 z-10 w-[30%] min-w-[8rem] max-w-[11.5rem] bk-float-slow">
            <div key={module.phone} className={swapClass}>
              <PhoneFrame priority shotKey={module.phone} alt={`Briktra Android app showing ${module.screen}`} />
            </div>
          </div>
          <LiveCard icon={CheckCircle2} tone="bg-emerald-500/20 text-emerald-300" title="9 of 9 present" sub="Anna Nagar Villas · 7:58 AM" className="-left-4 top-2 sm:-left-10" delay={300} />
          <LiveCard icon={BadgeIndianRupee} tone="bg-primary/25 text-orange-200" title="₹1,69,965 paid" sub="Weekly pay run · UPI and cash" className="-left-2 bottom-16 sm:-left-14" delay={900} />
          <LiveCard icon={ReceiptText} tone="bg-sky-500/20 text-sky-200" title="RA bill approved" sub="Tower A · ₹1.48 Cr net" className="right-6 -top-4 hidden sm:block" delay={1500} />
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-8 text-center md:grid-cols-4 md:px-6">
          {[
            { k: <CountUp to={30} suffix=" days" />, v: "Free trial, no card" },
            { k: <CountUp to={999} prefix="₹" />, v: "Plans from, per month" },
            { k: <CountUp to={6} suffix=" modules" />, v: "Integrated in one system" },
            { k: "Android + Web", v: "Run your business from your phone" },
          ].map((s, i) => (
            <div key={i}>
              <p className="font-display text-2xl font-bold text-white sm:text-3xl md:text-4xl">{s.k}</p>
              <p className="mt-1 text-sm text-white/55">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const STRIP = [
  "Masons", "Bar benders", "Carpenters", "Electricians", "Plumbers", "Site supervisors", "Accountants",
  "Purchase teams", "Project managers", "Home buyers", "Chennai", "Bengaluru", "Pune", "Coimbatore", "Hyderabad", "Madurai",
];

export const TradeStrip = () => (
  <div className="overflow-hidden border-y border-border bg-card py-4" aria-hidden="true">
    <div className="bk-marquee flex w-max gap-10 whitespace-nowrap text-sm font-medium text-muted-foreground">
      {[...STRIP, ...STRIP].map((t, i) => (
        <span key={i} className="inline-flex items-center gap-10">
          {t}
          <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
        </span>
      ))}
    </div>
  </div>
);

interface Step {
  time: string;
  icon: typeof Clock3;
  title: string;
  body: string;
  device: "phone" | "web";
  shot: ShotKey;
}

const DAY: Step[] = [
  { time: "7:58 AM", icon: HardHat, title: "Attendance is recorded as the crew arrives.", body: "Workers check in with their location and the supervisor approves. Management sees attendance across every site without follow-up calls.", device: "phone", shot: "attendance" },
  { time: "11:20 AM", icon: Package, title: "Materials received are matched to the order.", body: "The purchase order, the supplier bill and the stock entry are linked. The bill is routed for approval before payment.", device: "web", shot: "purchase" },
  { time: "2:15 PM", icon: Wallet, title: "Site expenses stay within the imprest limit.", body: "Each site maintains its own cash book. Every payment is recorded with who spent it and why, and the balance is always current.", device: "web", shot: "siteCash" },
  { time: "6:00 PM", icon: Sparkles, title: "Management reviews every site on one dashboard.", body: "Cash position, pending approvals, payroll and progress across all sites, updated the same day.", device: "phone", shot: "dashboard" },
  { time: "Saturday", icon: BadgeIndianRupee, title: "Weekly wages are calculated and approved.", body: "Pay is calculated for every worker across all sites, with advances recovered and no day paid twice. Approve the run, then pay by UPI, bank transfer or cash.", device: "web", shot: "payRun" },
  { time: "Month end", icon: ReceiptText, title: "Contractor and client billing from measured work.", body: "Certified measurements produce RA bills with retention, TDS and GST, and the client bill follows. Margin is visible for every project.", device: "phone", shot: "raBill" },
  { time: "Every day", icon: CheckCircle2, title: "Home buyers follow progress in their own app.", body: "Buyers see construction progress, instalments and site photos for their unit, reducing status enquiries to your team.", device: "phone", shot: "customerApp" },
];

export const DayOnSite = () => {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const step = DAY[active];
  return (
    <section className="relative bg-[hsl(30_33%_97%)] py-24" aria-labelledby="day-heading">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">A day on site with Briktra</p>
          <h2 id="day-heading" className="mt-3 text-balance font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
            From the first attendance mark to the final bill
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Follow a working day at a contractor running four sites on Briktra. Screens shown are from a demo company.</p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1fr]">
          <ol className="relative space-y-6 lg:space-y-0">
            <span className="absolute bottom-6 left-[1.35rem] top-6 hidden w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent lg:block" aria-hidden="true" />
            {DAY.map((s, i) => {
              const on = i === active;
              const Icon = s.icon;
              return (
                <li key={s.time}>
                  <div
                    ref={(el) => (stepRefs.current[i] = el)}
                    data-step={i}
                    className={`bk-step relative flex gap-5 rounded-2xl p-4 transition-all duration-500 lg:min-h-[58vh] lg:items-center ${on ? "lg:opacity-100" : "lg:opacity-40"}`}
                  >
                    <span className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-500 ${on ? "border-primary bg-primary text-white shadow-[0_0_0_6px_hsl(24_95%_53%/0.15)]" : "border-border bg-card text-muted-foreground"}`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider text-primary">{s.time}</p>
                      <h3 className="mt-1 text-balance font-display text-2xl font-bold leading-snug text-foreground md:text-3xl">{s.title}</h3>
                      <p className="mt-3 max-w-md text-lg leading-relaxed text-muted-foreground">{s.body}</p>
                      <div className="mt-6 lg:hidden">
                        {s.device === "phone" ? (
                          <PhoneFrame shotKey={s.shot} alt={s.title} className="mx-auto" />
                        ) : (
                          <BrowserFrame shotKey={s.shot} alt={s.title} />
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="hidden lg:block">
            <div className="sticky top-[22vh] flex h-[60vh] items-center justify-center">
              <div className="pointer-events-none absolute h-[70%] w-[70%] rounded-full bg-primary/15 blur-[90px]" />
              {DAY.map((s, i) => (
                <div
                  key={s.time}
                  className={`absolute flex w-full justify-center transition-all duration-700 ${i === active ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}
                  aria-hidden={i !== active}
                >
                  {s.device === "phone" ? (
                    <PhoneFrame shotKey={s.shot} alt={s.title} className="max-w-[18rem]" />
                  ) : (
                    <BrowserFrame shotKey={s.shot} alt={s.title} className="max-w-[40rem]" />
                  )}
                </div>
              ))}
              <span className="sr-only">{step.title}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TILE_SPAN = ["lg:col-span-4", "lg:col-span-2", "lg:col-span-2", "lg:col-span-4", "lg:col-span-3", "lg:col-span-3"];
const TILE_TONE = [
  "from-[hsl(24_95%_96%)] to-white",
  "from-[hsl(200_80%_96%)] to-white",
  "from-[hsl(150_50%_95%)] to-white",
  "from-[hsl(222_30%_12%)] to-[hsl(222_30%_18%)] text-white",
  "from-[hsl(40_100%_95%)] to-white",
  "from-[hsl(260_60%_97%)] to-white",
];

export const FeatureBento = () => (
  <section className="py-24" aria-labelledby="bento-heading">
    <div className="container mx-auto px-4 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Everything in one app</p>
        <h2 id="bento-heading" className="mt-3 text-balance font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
          Six integrated modules for your entire operation
        </h2>
      </div>
      <div className="mt-14 grid gap-5 lg:grid-cols-6">
        {FEATURE_GROUPS.map((g, i) => {
          const dark = i === 3;
          const narrow = TILE_SPAN[i] === "lg:col-span-2";
          const web = g.shots.web ? shotUrl(g.shots.web, "web") : undefined;
          return (
            <Reveal key={g.slug} className={TILE_SPAN[i]} delay={(i % 3) * 90}>
              <Link
                to={`/${g.slug}`}
                className={`group relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-3xl border bg-gradient-to-br p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${TILE_TONE[i]} ${dark ? "border-white/10" : "border-border"}`}
              >
                <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${dark ? "text-primary" : "text-primary"}`}>{g.name}</p>
                <h3 className={`mt-2 max-w-md text-balance font-display text-2xl font-bold leading-snug ${dark ? "text-white" : "text-foreground"}`}>{g.headline}</h3>
                <p className={`mt-2 max-w-md text-sm ${dark ? "text-white/65" : "text-muted-foreground"}`}>{g.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
                {narrow || !web ? (
                  <div className="relative mt-6 flex flex-1 items-end justify-center">
                    <div className="w-44 translate-y-16 transition-transform duration-500 group-hover:translate-y-10">
                      <PhoneFrame shotKey={g.shots.phone} alt={`${g.name} on the Android app`} />
                    </div>
                  </div>
                ) : (
                  <div className="relative -mb-7 mt-6 min-h-[15rem] flex-1 overflow-hidden rounded-t-xl border border-b-0 border-border/60 shadow-xl transition-transform duration-500 group-hover:-translate-y-1">
                    <img src={web} alt={`${g.name} on the web app`} width={1600} height={1000} loading="lazy" className="absolute inset-0 h-full w-full origin-[85%_20%] scale-[1.3] object-cover object-[88%_18%] transition-transform duration-700 group-hover:scale-[1.38]" />
                  </div>
                )}
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

const MODULES = [
  "Attendance & self check-in",
  "Weekly payroll & advances",
  "Site cash & expenses",
  "Purchase orders & stock",
  "BOQ, measurements & RA bills",
  "Client bills & retention",
  "Home buyer app",
  "Reports, roles & approvals",
];

/** The pricing difference that matters: nothing is locked on any plan. */
export const NoLockedFeatures = ({ showCta = true }: { showCta?: boolean }) => (
  <section className="relative overflow-hidden bg-[hsl(222_30%_8%)] py-24 text-white" aria-labelledby="unlocked-heading">
    <div className="pointer-events-none absolute -left-40 top-10 h-[30rem] w-[30rem] rounded-full bg-primary/20 blur-[130px]" />
    <div className="container relative mx-auto grid items-center gap-14 px-4 md:px-6 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">No locked features</p>
        <h2 id="unlocked-heading" className="mt-3 text-balance font-display text-4xl font-bold leading-tight md:text-5xl">
          Every feature on every plan. Even Starter.
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
          With feature-tiered software, payroll, BOQ billing or reports often cost extra. Briktra includes all of them
          from ₹999 a month. Plans differ only in size: how many sites, workers and logins you need.
        </p>
        <div className="mt-8">
          <p className="text-sm font-semibold text-white/85">What changes between plans</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {["Sites", "Workers", "Managers & Supervisors", "Home Buyer Logins", "Sub-Contractors"].map((t) => (
              <li key={t} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80">{t}</li>
            ))}
          </ul>
        </div>
        {showCta && (
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="h-12 px-7 text-base font-semibold" asChild>
              <Link to="/pricing">See Plans and Prices</Link>
            </Button>
          </div>
        )}
      </div>

      <Reveal>
        <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="border-r border-white/10 p-6">
            <p className="text-sm font-semibold text-white/60">Feature-tiered plans</p>
            <p className="mt-1 text-xs text-white/40">Entry plan</p>
            <ul className="mt-5 space-y-3">
              {MODULES.map((m, i) => (
                <li key={m} className={`flex items-center gap-2.5 text-sm ${i < 3 ? "text-white/70" : "text-white/35"}`}>
                  {i < 3 ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-white/50" aria-hidden="true" />
                  ) : (
                    <Lock className="h-4 w-4 shrink-0 text-white/35" aria-label="Locked" />
                  )}
                  <span className={i < 3 ? "" : "line-through decoration-white/20"}>{m}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative bg-gradient-to-b from-primary/20 to-transparent p-6">
            <p className="text-sm font-semibold text-white">Briktra Starter</p>
            <p className="mt-1 text-xs text-primary">₹999 a month · GST included</p>
            <ul className="mt-5 space-y-3">
              {MODULES.map((m) => (
                <li key={m} className="flex items-center gap-2.5 text-sm text-white">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
