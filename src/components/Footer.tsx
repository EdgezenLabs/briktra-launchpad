import { Link } from "react-router-dom";
import CompanyLink from "@/components/CompanyLink";
import briktraLogo from "@/assets/briktra-logo.webp";
import { COMPANY, FOOTER_LINKS, SITE, WHATSAPP, formatAddressMultiline } from "@/lib/site-config";
import { PlayBadge } from "@/components/site/PlayBadge";

const Footer = () => (
  <footer className="border-t border-border bg-card py-16" role="contentinfo">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="mb-4 inline-flex items-center gap-2" aria-label={`${SITE.name} home`}>
            <img src={briktraLogo} alt={`${SITE.name} logo`} className="h-8 w-auto" width={117} height={32} />
          </Link>
          <p className="mb-4 max-w-xs text-sm text-muted-foreground">
            Built for the India that builds.
          </p>
          <PlayBadge size="sm" className="mb-5" />
          <p className="whitespace-pre-line text-xs text-muted-foreground leading-relaxed">
            {formatAddressMultiline()}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            GSTIN: {COMPANY.gstin}
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">Product</h3>
          <ul className="space-y-2">
            {FOOTER_LINKS.product.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">Support</h3>
          <ul className="space-y-2">
            {FOOTER_LINKS.support.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={`mailto:${COMPANY.email}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {COMPANY.email}
              </a>
            </li>
            <li>
              <a href={`tel:${COMPANY.phoneTel}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {COMPANY.phone}
              </a>
            </li>
            <li>
              <a href={WHATSAPP.href()} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                WhatsApp Us
              </a>
            </li>
            <li>
              <a href={SITE.playStoreUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Android App on Google Play
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">Legal</h3>
          <ul className="space-y-2">
            {FOOTER_LINKS.legal.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section-divider my-10" />

      <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <p className="text-sm text-muted-foreground">
          © {SITE.copyrightYear} {SITE.name}. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground">
          Powered by <CompanyLink className="font-medium text-foreground">{COMPANY.displayName}</CompanyLink>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
