import { Link } from "react-router-dom";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site-config";

const NotFound = () => (
  <PageShell
    title="Page Not Found"
    description="The page you are looking for does not exist."
    canonical={`${SITE.url}/404`}
    noindex
  >
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <p className="mb-2 text-8xl font-bold text-primary/20" aria-hidden="true">404</p>
      <h1 className="mb-4 font-display text-3xl font-bold text-foreground">Page Not Found</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        The page you requested does not exist or may have been moved.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/contact">Contact Support</Link>
        </Button>
      </div>
    </section>
  </PageShell>
);

export default NotFound;
