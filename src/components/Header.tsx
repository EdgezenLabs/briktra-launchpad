import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import briktraLogo from "@/assets/briktra-logo.svg";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS, SITE } from "@/lib/site-config";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2" aria-label={`${SITE.name} home`}>
          <img src={briktraLogo} alt={`${SITE.name} logo`} className="h-8 w-auto" width={120} height={32} />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                isActive(link.href) ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <a href={SITE.appUrl}>Login to Briktra</a>
          </Button>
          <Button size="sm" className="font-semibold" asChild>
            <a href={SITE.appUrl}>Start Free Trial</a>
          </Button>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-menu" className="border-t border-border bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-muted"
                onClick={closeMobile}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
              <Button variant="outline" className="w-full" asChild>
                <a href={SITE.appUrl} onClick={closeMobile}>Login to Briktra</a>
              </Button>
              <Button className="w-full" asChild>
                <a href={SITE.appUrl} onClick={closeMobile}>Start Free Trial</a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
