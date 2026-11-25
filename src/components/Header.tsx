import {
  ArrowRight,
  BadgeIndianRupee,
  BarChart3,
  Building2,
  ChevronDown,
  HardHat,
  Menu,
  MessageCircle,
  Package,
  Phone,
  ReceiptText,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import briktraLogo from "@/assets/briktra-logo.webp";
import { COMPANY, NAV_LINKS, SITE, WHATSAPP } from "@/lib/site-config";
import { appLinks } from "@/lib/app-links";
import { FEATURE_GROUPS } from "@/lib/content";
import { usePlans } from "@/lib/plans";
import { GetAppButton, PlayBadge } from "@/components/site/PlayBadge";

const GROUP_ICONS = [HardHat, Building2, Package, ReceiptText, BadgeIndianRupee, BarChart3];

/** Bright offer banner across the top, with phone and WhatsApp on the right. */
const OfferBanner = () => {
  const { offer } = usePlans();
  return (
    <div className="bk-shine bg-gradient-to-r from-[#ff5a00] via-[#ff8a00] to-[#ffb000] text-[#1f1300]">
      <div className="container relative mx-auto flex h-10 items-center justify-between gap-4 px-4 text-xs font-medium md:px-6 sm:text-sm">
        {offer ? (
          <Link to="/pricing" className="flex min-w-0 items-center gap-2">
            <span aria-hidden="true">🎉</span>
            <span className="truncate">
              <strong className="font-bold">Briktra turns 2</strong>
              <span className="hidden sm:inline"> · {offer.name} for the next {offer.max_companies} companies, price locked</span>
              <span className="sm:hidden"> · Anniversary Offer</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#1f1300] px-3 py-0.5 text-xs font-bold text-white shadow-sm">
              Claim Offer <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </Link>
        ) : (
          <span>Built for the India that builds</span>
        )}
        <div className="hidden shrink-0 items-center gap-5 lg:flex">
          <a href={`tel:${COMPANY.phoneTel}`} className="inline-flex items-center gap-1.5 hover:underline">
            <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {COMPANY.phone}
          </a>
          <a href={WHATSAPP.href()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:underline">
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

/** Features opens a wide panel with every module. */
const FeaturesMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const featurePaths = ["/features", ...FEATURE_GROUPS.map((g) => `/${g.slug}`)];
  const active = featurePaths.includes(location.pathname);
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  return (
    <div className="static" ref={ref}>
      <button
        type="button"
        className={`inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-foreground ${active || open ? "text-foreground" : "text-muted-foreground"}`}
        aria-expanded={open}
        aria-controls="features-menu"
        onClick={() => setOpen((v) => !v)}
      >
        Features <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div id="features-menu" className="absolute inset-x-0 top-full border-b border-border bg-card shadow-2xl">
          <div className="container mx-auto grid gap-8 px-6 py-8 lg:grid-cols-[1fr_18rem]">
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
              {FEATURE_GROUPS.map((g, i) => {
                const Icon = GROUP_ICONS[i];
                return (
                  <Link key={g.slug} to={`/${g.slug}`} className="group flex gap-3 rounded-2xl p-4 hover:bg-muted">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-foreground">{g.name}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{g.summary}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="flex flex-col justify-between gap-6 rounded-2xl bg-[hsl(222_30%_10%)] p-6 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">All features</p>
                <p className="mt-2 font-display text-lg font-bold leading-snug">Every plan includes every module.</p>
                <Link to="/features" className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">
                  See All Features →
                </Link>
              </div>
              <PlayBadge size="sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => setMobileOpen(false), [location.pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background/95 backdrop-blur-md">
      <OfferBanner />
      <div className={`relative border-b border-border transition-shadow ${scrolled ? "shadow-md" : ""}`}>
        <div className="container mx-auto flex h-[4.5rem] items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2" aria-label={`${SITE.name} home`}>
              <img src={briktraLogo} alt={`${SITE.name} logo`} className="h-8 w-auto" width={117} height={32} />
            </Link>
            <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
              <FeaturesMenu />
              {NAV_LINKS.filter((l) => l.href !== "/features").map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-foreground ${
                    location.pathname.startsWith(link.href) ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <span className="hidden lg:inline-flex">
              <GetAppButton />
            </span>
            <Button variant="ghost" size="sm" asChild>
              <a href={appLinks.login}>Login to Briktra</a>
            </Button>
            <Button size="sm" className="font-semibold shadow-[0_8px_24px_-8px_hsl(24_95%_53%/0.8)]" asChild>
              <a href={appLinks.freeTrial}>Start Free Trial</a>
            </Button>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6 text-foreground" aria-hidden="true" /> : <Menu className="h-6 w-6 text-foreground" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="max-h-[80vh] overflow-y-auto border-b border-border bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
            <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Features</p>
            {FEATURE_GROUPS.map((g) => (
              <Link key={g.slug} to={`/${g.slug}`} className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-muted">
                {g.name}
              </Link>
            ))}
            <div className="my-2 border-t border-border" />
            {NAV_LINKS.map((link) => (
              <Link key={link.href} to={link.href} className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-muted">
                {link.label === "Features" ? "All Features" : link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
              <Button variant="outline" className="w-full" asChild>
                <a href={appLinks.login}>Login to Briktra</a>
              </Button>
              <Button className="w-full" asChild>
                <a href={appLinks.freeTrial}>Start Free Trial</a>
              </Button>
              <PlayBadge className="self-center" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
