import { ArrowRight, Mail, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
    <section className="relative min-h-screen overflow-hidden hero-gradient pt-16">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-40"></div>
      
      {/* Gradient orbs */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px]"></div>
      <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-accent/15 blur-[100px]"></div>

      <div className="container relative z-10 mx-auto flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 py-20 text-center md:px-6">
        {/* Badge */}
        <div className="mb-6 animate-fade-in opacity-0" style={{ animationDelay: "0.1s" }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary"></span>
            Multi-Tenant Construction Platform
          </span>
        </div>

        {/* Main headline */}
        <h1 className="mb-6 max-w-4xl animate-fade-in font-display text-4xl font-bold leading-tight opacity-0 md:text-5xl lg:text-6xl xl:text-7xl" style={{ animationDelay: "0.2s" }}>
          <span className="text-gradient">Briktra</span> – Smarter{" "}
          <span className="relative">
            Construction
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
              <path d="M2 10C50 4 150 2 298 6" stroke="hsl(38 92% 50%)" strokeWidth="3" strokeLinecap="round" className="animate-glow"/>
            </svg>
          </span>{" "}
          & Workforce Management
        </h1>

        {/* Subheadline */}
        <p className="mb-8 max-w-2xl animate-fade-in text-lg text-muted-foreground opacity-0 md:text-xl" style={{ animationDelay: "0.3s" }}>
          One platform to manage projects, manpower, payroll, expenses, stock, payments, and GST. Built for Indian construction workflows.
        </p>

        {/* CTA Buttons */}
        <div className="mb-12 flex flex-col items-center gap-4 animate-fade-in opacity-0 sm:flex-row" style={{ animationDelay: "0.4s" }}>
          <Button variant="hero" size="xl" className="group">
            Stay Tuned
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Button>
          <Button variant="heroSecondary" size="xl" className="group">
            <Play className="h-4 w-4" />
            Watch Preview
          </Button>
        </div>

        {/* Email signup */}
        <div className="w-full max-w-md animate-fade-in opacity-0" style={{ animationDelay: "0.5s" }}>
          {submitted ? (
            <div className="rounded-xl border border-accent/50 bg-accent/10 p-4 text-center">
              <p className="font-medium text-accent">🎉 You're on the list! We'll notify you when we launch.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 w-full rounded-lg border border-border bg-card pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
              <Button type="submit" variant="accent" size="lg">
                Notify Me
              </Button>
            </form>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Join 500+ construction professionals waiting for launch
          </p>
        </div>

        {/* App preview mockups */}
        <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-6 animate-fade-in opacity-0 md:grid-cols-3" style={{ animationDelay: "0.6s" }}>
          <div className="feature-card group relative overflow-hidden rounded-2xl p-1">
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <div className="text-center p-6">
                <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <p className="text-sm font-medium text-foreground">Mobile App</p>
                <p className="text-xs text-muted-foreground">For site supervisors</p>
              </div>
            </div>
          </div>
          <div className="feature-card group relative overflow-hidden rounded-2xl p-1 md:-translate-y-4">
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <div className="text-center p-6">
                <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <span className="text-2xl">💻</span>
                </div>
                <p className="text-sm font-medium text-foreground">Web Dashboard</p>
                <p className="text-xs text-muted-foreground">Complete control center</p>
              </div>
            </div>
          </div>
          <div className="feature-card group relative overflow-hidden rounded-2xl p-1">
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <div className="text-center p-6">
                <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl">🏗️</span>
                </div>
                <p className="text-sm font-medium text-foreground">Site Management</p>
                <p className="text-xs text-muted-foreground">Real-time tracking</p>
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
