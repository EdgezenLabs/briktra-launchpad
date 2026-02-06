import { Construction } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary glow-primary">
            <Construction className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Briktra
          </span>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#why" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Why Briktra
          </a>
          <a href="#notify" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Get Notified
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"></span>
            Coming Soon
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
