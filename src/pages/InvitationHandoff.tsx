import { useLayoutEffect, useMemo } from "react";
import { ArrowRight, ExternalLink, MailCheck } from "lucide-react";
import briktraLogo from "@/assets/briktra-logo.svg";
import SEO from "@/components/SEO";
import { invitationDestinations, invitationTokenFromLocation } from "@/lib/invitation-link";

const InvitationHandoff = () => {
  const token = useMemo(() => invitationTokenFromLocation(window.location), []);
  const destinations = token ? invitationDestinations(token) : null;

  // Invite emails always send the hash form (see invitations.service.js's
  // web_url) -- this legacy `?token=...` cleanup only matters for links sent
  // before that format existed. It can't undo the query-string already
  // having reached the server/CDN access logs for this request (that
  // happened before any client JS ran), but useLayoutEffect (vs. useEffect)
  // at least clears it from the address bar/history before the first paint,
  // rather than after. Other query params are preserved, just moved
  // alongside the token into the hash instead of being dropped.
  useLayoutEffect(() => {
    if (!token || !window.location.search) return;
    const remaining = new URLSearchParams(window.location.search);
    remaining.delete("token");
    const query = remaining.toString();
    const path = `/invite${query ? `?${query}` : ""}#token=${encodeURIComponent(token)}`;
    window.history.replaceState(null, "", path);
  }, [token]);

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-foreground">
      <SEO
        title="Accept invitation | Briktra"
        description="Open your secure Briktra team invitation."
        canonical="https://briktra.com/invite"
        noindex
      />
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center">
        <img src={briktraLogo} alt="Briktra" className="mb-10 h-10 w-auto self-start" />
        <MailCheck className="mb-5 h-10 w-10 text-primary" aria-hidden="true" />
        <h1 className="text-3xl font-bold tracking-normal">Accept your Briktra invitation</h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          Continue in the Briktra app to confirm your team invitation and set your password.
        </p>

        {destinations ? (
          <div className="mt-8 grid gap-3">
            <a
              href={destinations.app}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Open Briktra
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={destinations.web}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-4 font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Continue in browser
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        ) : (
          <div className="mt-8 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            This invitation link is incomplete. Open the latest invitation sent by your company.
          </div>
        )}

        <a href="/contact" className="mt-8 text-sm font-medium text-primary hover:underline">
          Contact support
        </a>
      </div>
    </main>
  );
};

export default InvitationHandoff;
