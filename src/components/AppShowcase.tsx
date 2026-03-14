import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  Smartphone,
  ShieldCheck,
  Zap,
  CheckCircle2,
  TrendingUp,
  Users,
  Wallet,
  FileText
} from "lucide-react";

import dashboardImg from "@/assets/dashboard-v2.png";
import projectTopImg from "@/assets/project-top-v2.png";
import projectModules1Img from "@/assets/project-modules-1-v2.png";
import projectModules2Img from "@/assets/project-modules-2-v4.png";

const AppShowcase = () => {
  return (
    <section id="app-showcase" className="relative bg-background py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -z-10 w-full h-full bg-grid-pattern opacity-50"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent -z-10"></div>

      <div className="container mx-auto px-4 md:px-6">

        {/* Section Header */}
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <span className="mb-6 flex items-center justify-center gap-2 mx-auto w-fit rounded-full border-2 border-primary/30 bg-primary/10 px-6 py-2.5 text-lg md:text-xl font-bold uppercase tracking-wider text-primary shadow-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            <Smartphone className="h-5 w-5 md:h-6 md:w-6" />
            Inside The App
          </span>
          <h2 className="mb-6 font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Everything You Need,<br />Right in Your Pocket
          </h2>
          <p className="text-lg text-muted-foreground">
            From a high-level command center to granular daily site operations, explore how Briktra gives you complete control from anywhere.
          </p>
        </div>

        {/* --- STEP 1: DASHBOARD --- */}
        <div className="relative mb-32 flex flex-col items-center justify-between gap-12 lg:flex-row">

          {/* Left Text / Explanation */}
          <div className="flex-1 space-y-6 lg:pl-12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <span className="font-display text-xl font-bold">1</span>
            </div>
            <h3 className="font-display text-3xl font-bold text-foreground">The Command Center</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Get a bird's-eye view of your entire construction operation. The unified dashboard gives you instant access to all active projects, employee attendance, supplier records, and contractor details the moment you log in.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                { icon: TrendingUp, text: "Real-time project progress tracking" },
                { icon: Users, text: "Centralized employee & contractor hubs" },
                { icon: ShieldCheck, text: "Secure role-based access control" },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Visual: Mobile Frame with Floating Comments */}
          <div className="relative flex-1 flex justify-center w-full">
            {/* Floating Pill - Top Right */}
            <div className="absolute -right-2 top-12 z-20 flex animate-float items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-xl md:-right-12">
              <ArrowLeft className="h-5 w-5 text-primary" />
              <div>
                <p className="font-display font-bold text-foreground">Quick Access</p>
                <p className="text-xs text-muted-foreground">Jump anywhere in 1 click</p>
              </div>
            </div>

            {/* Floating Pill - Bottom Left */}
            <div className="absolute -left-2 bottom-24 z-20 flex animate-float items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-xl md:-left-12" style={{ animationDelay: '1s' }}>
              <div>
                <p className="font-display font-bold text-foreground">Active Projects</p>
                <p className="text-xs text-muted-foreground">Track live completion status</p>
              </div>
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>

            {/* CSS Mobile Frame */}
            <div className="relative w-[280px] md:w-[320px] rounded-[2.5rem] border-[4px] border-zinc-700 bg-zinc-800 shadow-2xl shrink-0 p-1">
              {/* Screen */}
              <div className="relative h-[600px] md:h-[650px] w-full overflow-hidden rounded-[2.2rem] bg-card border border-border/10">
                <img
                  src={dashboardImg}
                  alt="Briktra Mobile Dashboard showing project overview and active stats"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- STEP 2: PROJECT OVERVIEW --- */}
        <div className="relative mb-32 flex flex-col-reverse items-center justify-between gap-12 lg:flex-row">

          {/* Left Visual: Mobile Frame  */}
          <div className="relative flex-1 flex justify-center w-full">
            {/* Floating Pill - Top Left */}
            <div className="absolute -left-2 top-20 z-20 flex animate-float items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-xl md:-left-12" style={{ animationDelay: '0.5s' }}>
              <div>
                <p className="font-display font-bold text-foreground">Live Budgets</p>
                <p className="text-xs text-muted-foreground">Track budget allocations</p>
              </div>
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>

            {/* Floating Pill - Bottom Right */}
            <div className="absolute -right-2 bottom-40 z-20 flex animate-float items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-xl md:-right-12" style={{ animationDelay: '1.5s' }}>
              <ArrowLeft className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-display font-bold text-destructive">Smart Alerts</p>
                <p className="text-xs text-muted-foreground">No room for forgetting</p>
              </div>
            </div>

            <div className="relative w-[280px] md:w-[320px] rounded-[2.5rem] border-[4px] border-zinc-700 bg-zinc-800 shadow-2xl shrink-0 p-1">
              <div className="relative h-[600px] md:h-[650px] w-full overflow-hidden rounded-[2.2rem] bg-card border border-border/10">
                <img
                  src={projectTopImg}
                  alt="Construction project details view in Briktra mobile app"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div className="flex-1 space-y-6 lg:pr-12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <span className="font-display text-xl font-bold">2</span>
            </div>
            <h3 className="font-display text-3xl font-bold text-foreground">Deep Project Insights</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Drill down into any specific site to see exactly where your money and efforts are going. Monitor staggering budgets, verify active statuses, and catch critical missing data before it delays your timelines.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                { icon: Wallet, text: "Live financial budget tracking" },
                { icon: Zap, text: "Automated smart warning alerts" },
                { icon: CheckCircle2, text: "Granular location & date tracking" },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- STEP 3: THE MODULES --- */}
        <div className="relative flex flex-col items-center justify-between gap-12 lg:flex-row">

          {/* Left Text */}
          <div className="flex-1 space-y-6 lg:pl-12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <span className="font-display text-xl font-bold">3</span>
            </div>
            <h3 className="font-display text-3xl font-bold text-foreground">The Ultimate Field Toolkit</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Say goodbye to fragmented WhatsApp messages and lost Excel sheets. Inside every project, you have access to 12 purpose-built modules designed to handle everything from labour attendance to vendor payouts.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                { icon: Users, text: "Labour Management & Attendance" },
                { icon: Wallet, text: "Expenses, Payroll & Salary Advances" },
                { icon: FileText, text: "Daily Notes, Bills & Document Wallet" },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Visual - Dual Screens */}
          <div className="relative flex-1 flex justify-center w-full min-h-[600px] pt-10">
            {/* Floating Pill - Top Left */}
            <div className="absolute left-0 md:left-4 top-0 z-30 flex animate-float items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-xl shrink-0">
              <ArrowRight className="h-5 w-5 text-primary rotate-45" />
              <div>
                <p className="font-display font-bold text-foreground">12 Core Modules</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">Everything in one place</p>
              </div>
            </div>

            {/* Back Screen (Modules 2 - Scrolled down) */}
            <div className="absolute right-0 md:right-4 top-4 md:top-8 z-10 w-[240px] md:w-[300px] rounded-[2.5rem] border-[4px] border-zinc-700 bg-zinc-800 shadow-2xl transition-transform duration-500 hover:scale-[1.02] hover:z-30 p-1">
              <div className="relative h-[480px] md:h-[600px] w-full overflow-hidden rounded-[2.2rem] bg-card border border-border/10">
                <img
                  src={projectModules2Img}
                  alt="Modular structure of Briktra ERP - Attendance, Payroll, and Expenses modules"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Front Screen (Modules 1 - Top) */}
            <div className="absolute left-0 lg:-left-8 top-12 z-20 w-[240px] md:w-[300px] rounded-[2.5rem] border-[4px] border-zinc-700 bg-zinc-800 shadow-2xl transition-transform duration-500 hover:scale-[1.02] p-1">
              <div className="relative h-[480px] md:h-[600px] w-full overflow-hidden rounded-[2.2rem] bg-card border border-border/10">
                <img
                  src={projectModules1Img}
                  alt="Briktra ERP Modules - Labour Management and Contracts overview"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Explore More CTA */}
        <div className="mt-20 flex flex-col items-center justify-center p-12 rounded-[3rem] bg-gradient-to-br from-primary/10 via-background to-primary/5 border border-primary/20 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-display font-bold mb-4">Want to See More?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              We've only scratched the surface. Explore our full suite of 12 integrated modules in an interactive, step-by-step tour.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" className="rounded-2xl px-10 py-6 font-bold shadow-xl shadow-primary/20 group hover:scale-105 transition-transform" asChild>
                <Link to="/explore">
                  Experience the Interactive Field Tour
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AppShowcase;
