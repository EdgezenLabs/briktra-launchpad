import { SITE } from "@/lib/site-config";

/** A play triangle for the download badge (a plain mark, not Google's logo). */
const PlayMark = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="bk-play" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#34d399" />
        <stop offset="0.45" stopColor="#60a5fa" />
        <stop offset="0.75" stopColor="#fbbf24" />
        <stop offset="1" stopColor="#f87171" />
      </linearGradient>
    </defs>
    <path d="M5 3.2c0-.9 1-1.5 1.8-1l13.4 7.9c.8.5.8 1.6 0 2.1L6.8 20.1c-.8.5-1.8-.1-1.8-1V3.2z" fill="url(#bk-play)" />
  </svg>
);

/** "Get it on Google Play" download badge. */
export const PlayBadge = ({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) => {
  const pad = size === "lg" ? "h-14 px-5" : size === "sm" ? "h-10 px-3" : "h-12 px-4";
  const icon = size === "lg" ? "h-8 w-8" : size === "sm" ? "h-5 w-5" : "h-7 w-7";
  const big = size === "lg" ? "text-xl" : size === "sm" ? "text-sm" : "text-lg";
  return (
    <a
      href={SITE.playStoreUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get the Briktra app on Google Play"
      className={`inline-flex items-center gap-3 rounded-xl border border-white/20 bg-black text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl ${pad} ${className}`}
    >
      <PlayMark className={icon} />
      <span className="text-left leading-none">
        <span className="block text-[10px] font-medium uppercase tracking-wider text-white/75">Get it on</span>
        <span className={`mt-0.5 block font-semibold ${big}`}>Google Play</span>
      </span>
    </a>
  );
};

/** Compact header button. */
export const GetAppButton = ({ light }: { light?: boolean }) => (
  <a
    href={SITE.playStoreUrl}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors ${
      light ? "border-white/25 text-white hover:bg-white/10" : "border-border text-foreground hover:bg-muted"
    }`}
  >
    <PlayMark className="h-4 w-4" />
    Get the App
  </a>
);
