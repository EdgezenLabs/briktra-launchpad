import type { ReactNode } from "react";
import {
  BadgeIndianRupee,
  BarChart3,
  Building2,
  HardHat,
  Package,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { appLinks } from "@/lib/app-links";
import { PlayBadge } from "@/components/site/PlayBadge";
import { WhatsAppLink } from "@/components/site/Blocks";

/** One icon per feature group, by slug. */
export const GROUP_ICON: Record<string, LucideIcon> = {
  "labour-payroll": HardHat,
  "site-management": Building2,
  "purchase-stock": Package,
  "boq-billing": ReceiptText,
  customers: BadgeIndianRupee,
  "control-reports": BarChart3,
};

/** The dark, glowing backdrop shared by every page hero and closing section. */
export const DarkGlow = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <section className={`relative overflow-hidden bg-[hsl(222_30%_8%)] text-white ${className}`}>
    <div className="bk-grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_60%_40%,black_30%,transparent_75%)]" />
    <div className="pointer-events-none absolute -right-32 top-0 h-[36rem] w-[36rem] rounded-full bg-primary/25 blur-[140px]" />
    <div className="pointer-events-none absolute -left-40 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[hsl(200_90%_50%/0.12)] blur-[120px]" />
    <div className="relative">{children}</div>
  </section>
);

/**
 * Page hero for inner pages. With [visual], text and visual sit side by side;
 * without it, the text is centred.
 */
export const PageHero = ({
  eyebrow,
  title,
  highlight,
  intro,
  visual,
  actions = "trial",
  children,
}: {
  eyebrow: string;
  title: string;
  /** The last words of the title, shown in the orange gradient. */
  highlight?: string;
  intro?: string;
  visual?: ReactNode;
  actions?: "trial" | "contact" | "none";
  children?: ReactNode;
}) => (
  <DarkGlow>
    <div
      className={`container mx-auto px-4 md:px-6 ${
        visual ? "grid items-center gap-14 pb-20 pt-14 lg:grid-cols-[1fr_1.1fr] lg:pb-24 lg:pt-20" : "pb-16 pt-14 text-center lg:pb-20 lg:pt-20"
      }`}
    >
      <div className={visual ? "" : "mx-auto max-w-3xl"}>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
        <h1 className="mt-4 text-balance font-display text-4xl font-bold leading-[1.06] tracking-tight md:text-5xl xl:text-6xl">
          {title}
          {highlight && (
            <>
              {" "}
              <span className="bg-gradient-to-r from-primary via-[hsl(32_100%_62%)] to-[hsl(44_100%_64%)] bg-clip-text text-transparent">
                {highlight}
              </span>
            </>
          )}
        </h1>
        {intro && (
          <p className={`mt-6 text-lg leading-relaxed text-white/70 ${visual ? "max-w-xl" : "mx-auto max-w-2xl"}`}>{intro}</p>
        )}
        {actions !== "none" && (
          <div className={`mt-9 flex flex-wrap gap-3 ${visual ? "" : "justify-center"}`}>
            <Button size="lg" className="h-12 px-7 text-base font-semibold shadow-[0_10px_40px_-8px_hsl(24_95%_53%/0.8)]" asChild>
              <a href={appLinks.freeTrial}>Start Free Trial</a>
            </Button>
            {actions === "contact" ? (
              <WhatsAppLink className="h-12 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white" />
            ) : (
              <PlayBadge />
            )}
          </div>
        )}
        {children}
      </div>
      {visual && <div className="relative">{visual}</div>}
    </div>
  </DarkGlow>
);
