import { Play, Wifi, Globe, Smartphone, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Countdown from "./Countdown";

import heroMobileImg from "@/assets/hero-mobile-v3.png";
import heroWebImg from "@/assets/hero-web.png";
import heroReportsImg from "@/assets/hero-reports.png";
import briktraLogo from "@/assets/briktra-logo.svg";

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
        
        {/* Massive Bursting Logo Area */}
        <div className="group mb-12 animate-fade-in opacity-0 relative flex flex-col items-center justify-center" style={{ animationDelay: "0.05s" }}>
          <div className="relative flex items-center justify-center h-28 w-64 md:h-36 md:w-80">
            {/* Massive bursting radial glow */}
            <div className="absolute inset-[-40%] rounded-full bg-gradient-to-tr from-primary via-orange-500 to-amber-300 blur-3xl opacity-50 animate-pulse group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"></div>
            
            {/* The Logo Container floating inside the blast */}
            <div className="relative z-10 w-full h-full p-4 md:p-6 rounded-3xl bg-white border border-border shadow-2xl group-hover:scale-105 group-hover:-translate-y-4 group-hover:shadow-[0_0_40px_rgba(0,0,0,0.2)] transition-all duration-500 flex items-center justify-center">
              <img 
                src={briktraLogo} 
                alt="Briktra" 
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Uniform Badge */}
        <div
          className="mx-auto mb-6 max-w-3xl text-center animate-fade-in opacity-0"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="mb-6 flex items-center justify-center gap-2 mx-auto w-fit rounded-full border-2 border-primary/30 bg-primary/10 px-6 py-2.5 text-lg md:text-xl font-bold uppercase tracking-wider text-primary shadow-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            <HardHat className="h-5 w-5 md:h-6 md:w-6" />
            Construction ERP Platform
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="mb-6 max-w-4xl animate-fade-in font-display text-4xl font-bold leading-tight text-foreground opacity-0 md:text-5xl lg:text-7xl"
          style={{ animationDelay: "0.2s" }}
        >
          Mobile-First ERP for{" "}
          <span className="text-foreground">Construction Companies</span> and
          Contractors
        </h1>

        {/* Subheadline */}
        <p
          className="mb-10 max-w-2xl animate-fade-in text-lg text-muted-foreground opacity-0 md:text-xl"
          style={{ animationDelay: "0.3s" }}
        >
          Manage projects, labour, materials, vendors, and expenses — built for
          real construction site conditions with live cloud sync and
          multilingual support.
        </p>

        {/* CTA Buttons */}
        <div
          className="mb-14 flex flex-col items-center gap-6 
                    animate-fade-in opacity-0 sm:flex-row"
          style={{ animationDelay: "0.4s" }}
        >
          {/* Start Free Trial - Primary (Linked to App) */}
          <Button
            size="xl"
            className="px-12 py-6 text-lg font-bold 
                      rounded-2xl shadow-xl 
                      transition-all duration-300 
                      hover:scale-110 hover:shadow-2xl"
            asChild
          >
            <a href="/app/index.html">Start Free Trial</a>
          </Button>
        </div>

        <div
          className="mb-12 flex justify-center animate-fade-in opacity-0"
          style={{ animationDelay: "0.45s" }}
        >
          <Countdown />
        </div>

        {/* Launch Highlights */}
        <div
          className="mb-20 flex flex-col items-center gap-6 text-center 
                    animate-fade-in opacity-0"
          style={{ animationDelay: "0.5s" }}
        >
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Built for the Field.
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-10 mt-4">
            <span className="text-xl md:text-2xl font-bold text-primary">
              Mobile-First Experience
            </span>

            <span className="hidden md:block text-2xl font-bold text-muted-foreground">
              •
            </span>

            <span className="text-xl md:text-2xl font-bold text-primary">
              Multilingual Support
            </span>
          </div>
        </div>
        
        {/* App preview mockups with Real Screenshots */}
        <div
          className="mt-8 grid w-full max-w-6xl grid-cols-1 gap-8 animate-fade-in opacity-0 md:grid-cols-3"
          style={{ animationDelay: "0.6s" }}
        >
          {/* Mobile App */}
          <div className="premium-card group relative overflow-hidden rounded-3xl p-1 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 border-2 border-border hover:border-primary/50 bg-card">
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-background mb-4 text-center">
              <img src={heroMobileImg} alt="Mobile App" className="w-full h-full object-cover object-center opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
              <div className="absolute bottom-4 left-0 right-0 px-4">
                <p className="text-xl font-bold text-foreground mb-1">
                  Mobile App
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  For site supervisors on the go
                </p>
              </div>
            </div>
          </div>

          {/* Web Dashboard */}
          <div className="premium-card group relative overflow-hidden rounded-3xl p-1 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 border-2 border-border hover:border-primary/50 bg-card md:-translate-y-6">
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-background mb-4 text-center">
              <img src={heroWebImg} alt="Web Dashboard" className="w-full h-full object-cover object-center opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
              <div className="absolute bottom-4 left-0 right-0 px-4">
                <p className="text-xl font-bold text-foreground mb-1">
                  Web Dashboard
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  Complete 12-module control center
                </p>
              </div>
            </div>
          </div>

          {/* Real-time Reports */}
          <div className="premium-card group relative overflow-hidden rounded-3xl p-1 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 border-2 border-border hover:border-primary/50 bg-card">
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-background mb-4 text-center">
              <img src={heroReportsImg} alt="Real-time Reports" className="w-full h-full object-cover object-center opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
              <div className="absolute bottom-4 left-0 right-0 px-4">
                <p className="text-xl font-bold text-foreground mb-1">
                  Real-time Reports
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  Live budget and site analytics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;
