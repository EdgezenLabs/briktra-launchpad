import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { appLinks } from "@/lib/app-links";
import { WHATSAPP } from "@/lib/site-config";
import { PlayBadge } from "@/components/site/PlayBadge";

export const Eyebrow = ({ children, dark }: { children: ReactNode; dark?: boolean }) => (
  <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${dark ? "text-primary" : "text-primary"}`}>{children}</p>
);

export const SectionHeading = ({
  eyebrow,
  title,
  intro,
  center,
  dark,
  id,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  center?: boolean;
  dark?: boolean;
  id?: string;
}) => (
  <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
    {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
    <h2
      id={id}
      className={`mt-3 text-balance font-display text-3xl font-bold leading-tight md:text-4xl ${dark ? "text-white" : "text-foreground"}`}
    >
      {title}
    </h2>
    {intro && <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-white/70" : "text-muted-foreground"}`}>{intro}</p>}
  </div>
);

export const CheckList = ({ items, dark }: { items: string[]; dark?: boolean }) => (
  <ul className="space-y-2.5">
    {items.map((item) => (
      <li key={item} className={`flex gap-3 text-[15px] leading-snug ${dark ? "text-white/85" : "text-foreground/85"}`}>
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export const WhatsAppLink = ({ className = "", variant = "outline" }: { className?: string; variant?: "outline" | "ghost" | "secondary" }) => (
  <Button variant={variant} size="lg" className={className} asChild>
    <a href={WHATSAPP.href()} target="_blank" rel="noopener noreferrer">
      <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
      Talk to Us on WhatsApp
    </a>
  </Button>
);

/** The close of every page: trial, app, a person to talk to. */
export const CtaBand = ({ title = "Start running your sites on Briktra" }: { title?: string }) => (
  <section className="relative overflow-hidden bg-[hsl(222_30%_8%)] py-24" aria-label="Start using Briktra">
    <div className="bk-grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_50%,black_25%,transparent_70%)]" />
    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[130px]" />
    <div className="container relative mx-auto px-4 text-center md:px-6">
      <h2 className="mx-auto max-w-3xl text-balance font-display text-4xl font-bold text-white md:text-5xl">{title}</h2>
      <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
        30 days free with your real sites and crew. No card needed. Every feature on every plan.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" className="h-12 px-7 text-base font-semibold shadow-[0_10px_40px_-8px_hsl(24_95%_53%/0.8)]" asChild>
          <a href={appLinks.freeTrial}>Start Free Trial</a>
        </Button>
        <PlayBadge />
        <WhatsAppLink variant="ghost" className="h-12 text-white hover:bg-white/10 hover:text-white" />
      </div>
    </div>
  </section>
);

export const TextLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
    {children}
  </Link>
);
