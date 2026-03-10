import { Twitter, Linkedin, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import briktraLogo from "@/assets/briktra-logo.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row align-top">
          {/* Brand & Contact */}
          <div className="flex flex-col items-center gap-3 md:items-start max-w-xs text-center md:text-left">
            <Link to="/" className="flex items-center gap-2 mb-2">
              <img 
                src={briktraLogo} 
                alt="Briktra Logo" 
                className="h-8 w-auto"
              />
            </Link>
            
            <p className="text-sm font-semibold text-foreground">
              Edgezen Labs
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Madurai, Tamilnadu, India<br />
              <a href="mailto:support@briktra.com" className="transition-colors hover:text-primary">support@briktra.com</a>
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="/#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a href="/#app-showcase" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Inside the App
            </a>
            <a href="/#why" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Why Briktra
            </a>
            <a href="/#workflow" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              How It Works
            </a>
            <a href="/#users" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              For Teams
            </a>
            <a href="/#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </a>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {[
              { icon: Twitter, href: "#", label: "Twitter" },
              { icon: Linkedin, href: "#", label: "LinkedIn" },
              { icon: Instagram, href: "#", label: "Instagram" },
              { icon: Mail, href: "#", label: "Email" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider my-8"></div>

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Briktra – All rights reserved
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground md:gap-6">
            <Link to="/privacy-policy" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <span className="hidden md:inline">|</span>
            <Link to="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <span className="hidden md:inline">|</span>
            <Link to="/refund-policy" className="transition-colors hover:text-foreground">
              Refund Policy
            </Link>
            <span className="hidden md:inline">|</span>
            <a href="/#contact" className="transition-colors hover:text-foreground">
              Contact
            </a>
            <span className="hidden md:inline">|</span>
            <Link to="/about-us" className="transition-colors hover:text-foreground">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
