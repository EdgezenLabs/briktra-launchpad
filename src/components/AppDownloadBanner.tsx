import {  FolderKanban, Receipt, Package, BarChart3 } from "lucide-react";
import briktraLogo from "@/assets/briktra-logo.svg";
import { SITE } from "@/lib/site-config";


const FEATURES = [
  { icon: FolderKanban, label: "Manage", sublabel: "Projects" },
  { icon: Receipt, label: "Track", sublabel: "Expenses" },
  { icon: Package, label: "Manage", sublabel: "Inventory" },
  { icon: BarChart3, label: "View", sublabel: "Reports" },
];

export const AppDownloadBanner = () => {


  return (
    <div
      id="top-app-banner"
      className="relative z-50 bg-foreground text-white border-b border-zinc-800/80 px-3 py-2.5 md:py-3 transition-all duration-300"
      role="banner"
      aria-label="App download banner"
    >
      <div className="container mx-auto flex items-center justify-between gap-3 md:gap-6">

        {/* LEFT: Logo + Phone Preview + Text */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Logo & Mockup Badge */}
          <div className="relative flex items-center shrink-0">
            {/* White box with B Logo */}
            <div className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-white p-1.5 shadow-md">
              <img
                src={briktraLogo}
                alt="Briktra"
                className="h-full w-full object-contain"
                width={36}
                height={36}
              />
            </div>
            
          </div>

          {/* Headline & Subtitle */}
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm md:text-base font-bold tracking-tight text-white leading-tight">
                Get the <span className="text-primary font-extrabold">Briktra</span> App
              </h2>
            </div>
            <p className="text-[11px] md:text-xs text-zinc-300 hidden sm:block leading-tight mt-0.5">
              Manage your construction business anytime, anywhere.
            </p>
          </div>
        </div>

        {/* CENTER: Feature Badges with Vertical Dividers (Hidden on small screens) */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.sublabel} className="flex items-center gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-white shadow-inner">
                    <Icon className="h-4 w-4 text-zinc-200" aria-hidden="true" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="block text-[11px] font-semibold text-zinc-300">{item.label}</span>
                    <span className="block text-[12px] font-bold text-white">{item.sublabel}</span>
                  </div>
                </div>
                {idx < FEATURES.length - 1 && (
                  <div className="h-6 w-[1px] bg-zinc-800" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT: Google Play CTA + Dismiss Button */}
        <div className="flex items-center gap-2.5 md:gap-4 shrink-0">
          {/* Google Play Button */}
          <a
            id="banner-google-play-btn"
            href={SITE.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-xl border border-zinc-700 bg-black px-3 py-1.5 md:px-4 md:py-2 text-white shadow-md hover:bg-zinc-900 hover:border-primary/50 transition-all duration-200"
            aria-label="Download Briktra on Google Play"
          >
            {/* Google Play SVG icon */}
            <svg
              className="h-5 w-5 md:h-6 md:w-6 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3.18 23.76c.3.17.64.24.98.2l.13-.04L13.64 14 10 10.36 3.18 23.76zM20.96 10.4l-2.88-1.64-3.84 3.84 3.84 3.84 2.9-1.64a2.04 2.04 0 000-4.4zM2.01 1.05A2 2 0 002 1.57V22.4a2 2 0 00.18.88L12 13.36 2.01 1.05zM14.27 12l-3.9-3.9 9.3-5.3a2.04 2.04 0 00-.65-.37L4.29 8.7 14.27 12z" />
            </svg>
            <div className="text-left">
              <span className="block text-[8px] md:text-[9px] font-medium tracking-wide text-zinc-300 leading-none">
                GET IT ON
              </span>
              <span className="block text-xs md:text-sm font-bold tracking-tight text-white leading-tight">
                Google Play
              </span>
            </div>
          </a>

          
        </div>

      </div>
    </div>
  );
};

export default AppDownloadBanner;
