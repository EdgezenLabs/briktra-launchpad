import { Smartphone, Download, Star, Users, ShieldCheck, ArrowRight } from "lucide-react";
import dashboardImg from "@/assets/mobile/Screenshot_20260520-235732.png";

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.briktra.app";

const stats = [
  { icon: Star, label: "Rating", value: "4.8★" },
  { icon: Users, label: "Active Users", value: "5,000+" },
  { icon: ShieldCheck, label: "Secure & Verified", value: "Google Play" },
];

const AppDownload = () => (
  <section
    id="app-download"
    className="relative overflow-hidden bg-background py-24"
    aria-labelledby="app-download-heading"
  >
    {/* Background decorations */}
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/8 via-background to-orange-500/5" aria-hidden="true" />
    <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl -z-10" aria-hidden="true" />
    <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl -z-10" aria-hidden="true" />
    <div className="absolute inset-0 grid-pattern opacity-20 -z-10" aria-hidden="true" />

    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-20">

        {/* LEFT — Phone mockup */}
        <div className="relative flex flex-1 justify-center lg:justify-center">
          {/* Glow behind phone */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl scale-75" aria-hidden="true" />

          {/* Phone frame */}
          <div className="relative z-10 w-[240px] md:w-[270px] rounded-[2.5rem] border-[4px] border-zinc-700 bg-zinc-800 shadow-2xl p-1 rotate-[-4deg] hover:rotate-0 transition-transform duration-500">
            <div className="relative h-[500px] md:h-[560px] w-full overflow-hidden rounded-[2.2rem]">
              <img
                src={dashboardImg}
                alt="Briktra mobile app dashboard showing project overview and active stats"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 shadow-xl animate-float whitespace-nowrap">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Free Download</p>
              <p className="text-[10px] text-muted-foreground">No credit card needed</p>
            </div>
          </div>
        </div>

        {/* RIGHT — Text & CTA */}
        <div className="flex-1 text-center lg:text-left space-y-8 max-w-xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-primary/10 px-5 py-2 text-sm font-bold uppercase tracking-wider text-primary">
            <Smartphone className="h-4 w-4" aria-hidden="true" />
            Mobile App
          </span>

          {/* Heading */}
          <div>
            <h2
              id="app-download-heading"
              className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4"
            >
              Manage Your Site{" "}
              <span className="text-primary">From Anywhere</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Briktra mobile app puts your entire construction operation in your pocket.
              Track attendance, record expenses, and monitor project progress — even from the field.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-6">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {/* Google Play button */}
            <a
              id="download-google-play-btn"
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-2xl border-2 border-foreground/20 bg-foreground px-6 py-4 text-background shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 min-w-[200px] justify-center"
              aria-label="Download Briktra on Google Play"
            >
              {/* Google Play icon SVG */}
              <svg
                className="h-7 w-7 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3.18 23.76c.3.17.64.24.98.2l.13-.04L13.64 14 10 10.36 3.18 23.76zM20.96 10.4l-2.88-1.64-3.84 3.84 3.84 3.84 2.9-1.64a2.04 2.04 0 000-4.4zM2.01 1.05A2 2 0 002 1.57V22.4a2 2 0 00.18.88L12 13.36 2.01 1.05zM14.27 12l-3.9-3.9 9.3-5.3a2.04 2.04 0 00-.65-.37L4.29 8.7 14.27 12z" />
              </svg>
              <div className="text-left">
                <p className="text-[10px] font-medium opacity-80 leading-none">GET IT ON</p>
                <p className="text-base font-bold leading-tight">Google Play</p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto opacity-70 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>

            {/* Secondary link */}
            <a
              id="learn-more-app-btn"
              href="#app-showcase"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-primary/30 bg-primary/10 px-6 py-4 text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 min-w-[180px]"
              aria-label="Explore Briktra"
            >
              <Smartphone className="h-4 w-4" aria-hidden="true" />
              Explore Briktra
            </a>
          </div>

          <p className="text-xs text-muted-foreground">
            ✓ Free to download &nbsp;·&nbsp; ✓ Android supported &nbsp;·&nbsp; ✓ No hidden charges
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default AppDownload;
