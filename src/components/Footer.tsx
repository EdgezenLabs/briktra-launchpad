import { Construction, Twitter, Linkedin, Instagram, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Brand */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Construction className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold text-foreground">
                Briktra
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Building smarter construction workflows
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
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
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/10"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider my-8"></div>

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Briktra – Coming Soon
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

        {/* Made with love badge */}
        <div className="mt-8 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            Made with
            <span className="text-accent">❤️</span>
            for Indian Construction Industry
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
