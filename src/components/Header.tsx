import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import briktraLogo from "@/assets/briktra-logo.svg";
import Countdown from "./Countdown";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <a href="/" className="flex items-center gap-2">
          <img 
            src={briktraLogo} 
            alt="Briktra Logo" 
            className="h-8 w-auto"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#why" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Why Briktra
          </a>
          <a href="#workflow" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </a>
          <a href="#users" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Who Uses
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" className="text-sm font-medium">
            Start Free Trial
          </Button>
          <Button variant="default" size="sm" className="text-sm font-semibold">
            Request Demo
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-6">
            <a 
              href="#features" 
              className="text-base font-medium text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#why" 
              className="text-base font-medium text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Why Briktra
            </a>
            <a 
              href="#workflow" 
              className="text-base font-medium text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#users" 
              className="text-base font-medium text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Who Uses
            </a>
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Button variant="outline" className="w-full">
                Start Free Trial
              </Button>
              <Button variant="default" className="w-full">
                Request Demo
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
