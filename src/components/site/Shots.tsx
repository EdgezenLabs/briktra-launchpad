import type { ShotKey } from "@/lib/content";

// Real app screenshots live in src/assets/shots as <key>-phone.png (Android,
// 1080 wide) and <key>-web.png (desktop browser, 1440 wide). A key without a
// file shows a drawn stand-in, so a page never breaks for a missing image.
const files = import.meta.glob<string>("/src/assets/shots/*.{png,jpg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

export function shot(key: ShotKey, kind: "phone" | "web"): string | undefined {
  const hit = Object.entries(files).find(([path]) => path.includes(`/${key}-${kind}.`));
  return hit?.[1];
}

// Intrinsic sizes of the exported screenshots, so the browser reserves the
// space before the image arrives.
const SIZE = { phone: { width: 720, height: 1561 }, web: { width: 1600, height: 1000 } } as const;

/** Above-the-fold images load at once and first; the rest wait until scrolled near. */
const loadingProps = (priority?: boolean) =>
  priority ? ({ loading: "eager", fetchpriority: "high" } as const) : ({ loading: "lazy" } as const);

/** A drawn screen: header bar, a few rows, a figure. Stands in until a screenshot exists. */
const StandIn = ({ label, wide }: { label: string; wide?: boolean }) => (
  <div className="flex h-full w-full flex-col gap-3 bg-[hsl(30_20%_97%)] p-4">
    <div className="flex items-center gap-2">
      <div className="h-6 w-6 rounded-md bg-primary/80" />
      <div className="h-3 w-24 rounded bg-foreground/15" />
    </div>
    <div className={`grid gap-2 ${wide ? "grid-cols-4" : "grid-cols-2"}`}>
      {Array.from({ length: wide ? 4 : 2 }).map((_, i) => (
        <div key={i} className="rounded-lg bg-white p-2 shadow-sm">
          <div className="h-2 w-10 rounded bg-foreground/10" />
          <div className="mt-2 h-4 w-14 rounded bg-foreground/20" />
        </div>
      ))}
    </div>
    <div className="flex-1 space-y-2 rounded-lg bg-white p-3 shadow-sm">
      {Array.from({ length: wide ? 6 : 7 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/20" />
            <div className="h-2.5 rounded bg-foreground/15" style={{ width: `${60 + ((i * 17) % 50)}px` }} />
          </div>
          <div className="h-2.5 w-10 rounded bg-foreground/10" />
        </div>
      ))}
    </div>
    <span className="sr-only">{label}</span>
  </div>
);

export const PhoneFrame = ({
  shotKey,
  alt,
  className = "",
  priority,
}: {
  shotKey?: ShotKey;
  alt: string;
  className?: string;
  priority?: boolean;
}) => {
  const src = shotKey ? shot(shotKey, "phone") : undefined;
  return (
    <div
      className={`relative aspect-[9/19.5] w-full max-w-[17rem] rounded-[2.4rem] border-[10px] border-[hsl(220_20%_12%)] bg-[hsl(220_20%_12%)] shadow-[0_30px_60px_-20px_hsl(220_30%_10%/0.45)] ${className}`}
    >
      <div className="flex h-full w-full flex-col overflow-hidden rounded-[1.7rem] bg-[hsl(30_40%_97%)]">
        {/* Status bar with the camera hole, so the app's own header starts below it. */}
        <div className="relative flex h-[7%] shrink-0 items-center justify-between px-[9%] text-[clamp(6px,2.2cqw,10px)] font-semibold text-foreground/80 [container-type:inline-size]">
          <span>9:41</span>
          <span className="absolute left-1/2 top-1/2 h-[42%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(220_20%_12%)]" />
          <span className="flex items-center gap-[3px]" aria-hidden="true">
            <span className="h-[7px] w-[9px] rounded-[1px] bg-foreground/70 [clip-path:polygon(0_100%,100%_0,100%_100%)]" />
            <span className="h-[6px] w-[11px] rounded-[2px] border border-foreground/70" />
          </span>
        </div>
        <div className="min-h-0 flex-1">
          {src ? (
            <img src={src} alt={alt} {...SIZE.phone} {...loadingProps(priority)} className="h-full w-full object-cover object-top" />
          ) : (
            <StandIn label={alt} />
          )}
        </div>
      </div>
    </div>
  );
};

export const BrowserFrame = ({
  shotKey,
  alt,
  className = "",
  priority,
}: {
  shotKey?: ShotKey;
  alt: string;
  className?: string;
  priority?: boolean;
}) => {
  const src = shotKey ? shot(shotKey, "web") : undefined;
  return (
    <div
      className={`w-full overflow-hidden rounded-xl border border-border bg-white shadow-[0_30px_70px_-25px_hsl(220_30%_10%/0.35)] ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-border bg-[hsl(220_14%_97%)] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate rounded-md bg-white px-3 py-0.5 text-[11px] text-muted-foreground">
          app.briktra.com
        </span>
      </div>
      <div className="aspect-[16/10] w-full">
        {src ? (
          <img src={src} alt={alt} {...SIZE.web} {...loadingProps(priority)} className="h-full w-full object-cover object-top" />
        ) : (
          <StandIn label={alt} wide />
        )}
      </div>
    </div>
  );
};

/** Web screen with the phone overlapping its corner: the product on site and in the office. */
export const DevicePair = ({
  phone,
  web,
  alt,
}: {
  phone?: ShotKey;
  web?: ShotKey;
  alt: string;
}) => (
  <div className="relative mx-auto w-full max-w-2xl pb-10 pr-6 sm:pr-10">
    <BrowserFrame shotKey={web} alt={`${alt} on the web app`} />
    <div className="absolute -bottom-2 right-0 w-[34%] min-w-[7.5rem] max-w-[11rem]">
      <PhoneFrame shotKey={phone} alt={`${alt} on the Android app`} />
    </div>
  </div>
);
