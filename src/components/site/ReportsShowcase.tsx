import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeIndianRupee,
  Building2,
  CalendarClock,
  FileDown,
  HardHat,
  Package,
  ReceiptText,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { REPORT_COUNT, REPORT_GROUPS, type ShotKey } from "@/lib/content";
import { BrowserFrame } from "@/components/site/Shots";
import { Reveal } from "@/components/site/Experience";

const GROUP_ICON: Record<string, LucideIcon> = {
  Money: BadgeIndianRupee,
  Projects: Building2,
  People: HardHat,
  Materials: Package,
  "BOQ & Billing": ReceiptText,
};

/** Reports the site has a screenshot of, in menu order. */
const VIEWABLE = REPORT_GROUPS.flatMap((g) => g.reports).filter((r) => r.shot);

const PERKS: { icon: LucideIcon; text: string }[] = [
  { icon: FileDown, text: "Download as PDF or CSV" },
  { icon: CalendarClock, text: "Run daily, weekly or monthly" },
  { icon: ShieldCheck, text: "Money reports for owners and managers only" },
];

/**
 * Every report in Briktra, each led by the question it answers. Reports are
 * what owners buy software for, so they get their own section.
 */
export const ReportsShowcase = ({ showLink = true }: { showLink?: boolean }) => {
  const [shown, setShown] = useState<ShotKey>(VIEWABLE[0]?.shot ?? "reports");
  const current = VIEWABLE.find((r) => r.shot === shown);
  return (
  <section className="relative overflow-hidden bg-[hsl(30_33%_97%)] py-24" aria-labelledby="reports-heading">
    <div className="pointer-events-none absolute -right-40 top-20 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-[120px]" />
    <div className="container relative mx-auto px-4 md:px-6">
      <div className="grid items-end gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Reports</p>
          <h2 id="reports-heading" className="mt-3 text-balance font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
            {REPORT_COUNT} reports that answer the questions you ask every week
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Profit by site, cash you will need, who owes you, wages paid and material left. Built from the attendance,
            bills and stock your team already records, so the numbers are ready without a spreadsheet.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2">
            {PERKS.map(({ icon: Icon, text }) => (
              <li key={text} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground">
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <Reveal>
          <BrowserFrame
            key={shown}
            shotKey={shown}
            alt={`The ${current?.name ?? "Reports"} report in Briktra`}
            className="shadow-[0_40px_90px_-40px_rgba(0,0,0,0.45)] animate-in fade-in duration-300"
          />
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="See a report">
            {VIEWABLE.map((r) => {
              const on = r.shot === shown;
              return (
                <button
                  key={r.name}
                  type="button"
                  aria-pressed={on}
                  onClick={() => r.shot && setShown(r.shot)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    on
                      ? "border-primary bg-primary text-white shadow-[0_8px_20px_-8px_hsl(24_95%_53%/0.8)]"
                      : "border-border bg-card text-foreground hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {r.name}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Real screens from a demo company.</p>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {REPORT_GROUPS.map((group, gi) => {
          const Icon = GROUP_ICON[group.title] ?? BadgeIndianRupee;
          return (
            <Reveal key={group.title} delay={(gi % 3) * 90} className={gi === 0 ? "xl:row-span-2" : ""}>
              <div className="h-full rounded-3xl border border-border bg-card p-6 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.35)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-[0_8px_20px_-6px_hsl(24_95%_53%/0.7)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-xl font-bold text-foreground">{group.title}</h3>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {group.reports.length} {group.reports.length === 1 ? "report" : "reports"}
                  </span>
                </div>
                <ul className="mt-5 space-y-3">
                  {group.reports.map((r) => (
                    <li key={r.name} className="rounded-2xl border border-border/70 bg-[hsl(30_33%_98%)] p-4">
                      <p className="font-display text-[17px] font-bold leading-snug text-foreground">“{r.question}”</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {r.shot ? (
                          <button
                            type="button"
                            onClick={() => {
                              setShown(r.shot!);
                              document.getElementById("reports-heading")?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }}
                            className="font-semibold text-primary underline-offset-2 hover:underline"
                          >
                            {r.name}
                          </button>
                        ) : (
                          <span className="font-semibold text-primary">{r.name}</span>
                        )}
                        {" · "}
                        {r.shows}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>

      {showLink && (
        <div className="mt-10 text-center">
          <Link to="/control-reports" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
            See Reports and Control in Detail <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  </section>
  );
};
