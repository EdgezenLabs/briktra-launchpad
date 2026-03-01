import { ArrowRight, Play, Wifi, Globe, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Countdown from "./Countdown";

const Hero = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-16">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30"></div>
      
      {/* Gradient orbs - softer for light mode */}
      <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]"></div>
      <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[100px]"></div>

      <div className="container relative z-10 mx-auto flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 py-20 text-center md:px-6">
        {/* Badge */}
        <div className="mb-6 animate-fade-in opacity-0" style={{ animationDelay: "0.1s" }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary"></span>
            Construction ERP Platform
          </span>
        </div>

        {/* Main headline */}
        <h1 className="mb-6 max-w-4xl animate-fade-in font-display text-4xl font-bold leading-tight text-foreground opacity-0 md:text-5xl lg:text-6xl xl:text-7xl" style={{ animationDelay: "0.2s" }}>
          Mobile-First ERP for{" "}
          <span className="text-foreground">Construction Companies</span>{" "}
          and Contractors
        </h1>

        {/* Subheadline */}
        <p className="mb-10 max-w-2xl animate-fade-in text-lg text-muted-foreground opacity-0 md:text-xl" style={{ animationDelay: "0.3s" }}>
          Manage projects, labour, materials, vendors, and expenses — built for real construction site conditions with offline capability and multilingual support.
        </p>
        
        {/* CTA Buttons */}
        <div
          className="mb-14 flex flex-col items-center gap-6 
                    animate-fade-in opacity-0 sm:flex-row"
          style={{ animationDelay: "0.4s" }}
        >
          {/* Request Demo - Secondary */}
          <Button
            variant="outline"
            size="xl"
            className="px-10 py-6 text-lg font-semibold 
                      rounded-2xl border-2 
                      transition-all duration-300 
                      hover:bg-primary/5 hover:scale-105"
          >
            Request Demo
          </Button>

          {/* Start Free Trial - Primary (Linked to App) */}
          <Button
            size="xl"
            className="px-12 py-6 text-lg font-bold 
                      rounded-2xl shadow-xl 
                      transition-all duration-300 
                      hover:scale-110 hover:shadow-2xl"
            asChild
          >
            <a href="/app/">Start Free Trial</a>
          </Button>
        </div>

        <div className="mb-12 flex justify-center animate-fade-in opacity-0" style={{ animationDelay: "0.45s" }}>
          <Countdown />
        </div>
        
        {/* Launch Highlights */}
        <div 
          className="mb-20 flex flex-col items-center gap-6 text-center 
                    animate-fade-in opacity-0"
          style={{ animationDelay: "0.5s" }}
        >
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Built for the Field.
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-10 mt-4">
            <span className="text-xl md:text-2xl font-semibold text-primary">
              Mobile-First Experience
            </span>

            <span className="hidden md:block text-2xl font-bold text-muted-foreground">
              •
            </span>

            <span className="text-xl md:text-2xl font-semibold text-primary">
              Multilingual Support
            </span>
          </div>
        </div>
        {/* App preview mockups */}
        <div className="mt-8 grid w-full max-w-5xl grid-cols-1 gap-6 animate-fade-in opacity-0 md:grid-cols-3" style={{ animationDelay: "0.6s" }}>
          <div className="premium-card group relative overflow-hidden rounded-2xl p-1 transition-all duration-300 hover:shadow-xl">
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <div className="text-center p-6">
                <div className="mx-auto mb-3 h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl">📱</span>
                </div>
                <p className="text-sm font-semibold text-foreground">Mobile App</p>
                <p className="text-xs text-muted-foreground mt-1">For site supervisors</p>
              </div>
            </div>
          </div>
          <div className="premium-card group relative overflow-hidden rounded-2xl p-1 transition-all duration-300 hover:shadow-xl">
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <div className="text-center p-6">
                <div className="mx-auto mb-3 h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl">💻</span>
                </div>
                <p className="text-sm font-semibold text-foreground">Web Dashboard</p>
                <p className="text-xs text-muted-foreground mt-1">Complete control center</p>
              </div>
            </div>
          </div>
          <div className="premium-card group relative overflow-hidden rounded-2xl p-1 transition-all duration-300 hover:shadow-xl">
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <div className="text-center p-6">
                <div className="mx-auto mb-3 h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl">📊</span>
                </div>
                <p className="text-sm font-semibold text-foreground">Real-time Reports</p>
                <p className="text-xs text-muted-foreground mt-1">Analytics & insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
