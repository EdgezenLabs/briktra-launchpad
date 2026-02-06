import { Twitter, Linkedin, Instagram, Mail } from "lucide-react";
import briktraLogo from "@/assets/briktra-logo.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Brand */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <a href="/" className="flex items-center gap-2">
              <img 
                src={briktraLogo} 
                alt="Briktra Logo" 
                className="h-8 w-auto"
              />
            </a>
            <p className="text-sm text-muted-foreground">
              Mobile-First ERP for Construction
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#why" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Why Briktra
            </a>
            <a href="#workflow" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              How It Works
            </a>
            <a href="#users" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Who Uses
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
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
