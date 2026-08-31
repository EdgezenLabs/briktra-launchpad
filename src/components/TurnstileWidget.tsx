import { useEffect, useRef, useState } from "react";
import { turnstileEnabled, turnstileSiteKey } from "@/lib/turnstile";

/**
 * Cloudflare Turnstile challenge for the public contact form.
 *
 * Renders nothing when VITE_TURNSTILE_SITE_KEY is unset, which keeps local
 * development and previews usable before external keys are configured --
 * the API applies the same rule (turnstile.service.js only enforces in
 * production, or when TURNSTILE_ENABLED is set explicitly).
 */

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
    };
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileWidgetProps {
  /** Receives the token, or null when it expires or errors. */
  onToken: (token: string | null) => void;
}

const TurnstileWidget = ({ onToken }: TurnstileWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  // Load the Turnstile script once, shared across mounts.
  useEffect(() => {
    if (!turnstileEnabled) return;
    if (window.turnstile) {
      setScriptReady(true);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => setScriptReady(true));
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => setScriptReady(true));
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!turnstileEnabled || !scriptReady) return;
    const container = containerRef.current;
    if (!container || !window.turnstile) return;

    widgetIdRef.current = window.turnstile.render(container, {
      sitekey: turnstileSiteKey,
      theme: "light",
      callback: (token: string) => onToken(token),
      "expired-callback": () => onToken(null),
      "error-callback": () => onToken(null),
    });

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
    // onToken is intentionally excluded: re-rendering the widget on every
    // parent render would reset a challenge the visitor already solved.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptReady]);

  if (!turnstileEnabled) return null;

  return <div ref={containerRef} className="flex justify-center" />;
};

export default TurnstileWidget;
