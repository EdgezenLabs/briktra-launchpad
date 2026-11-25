import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO, { type Crumb } from "@/components/SEO";
import SkipLink from "@/components/SkipLink";

interface PageShellProps {
  title: string;
  description: string;
  /** Site path such as "/pricing"; "/" for the homepage. */
  path: string;
  children: ReactNode;
  noindex?: boolean;
  crumbs?: Crumb[];
  jsonLd?: Record<string, unknown>[];
  /** Describe the product in structured data; off for legal pages. Defaults to on unless noindex. */
  product?: boolean;
}

const PageShell = ({ title, description, path, children, noindex, crumbs, jsonLd, product }: PageShellProps) => (
  <div className="min-h-screen bg-background">
    <SEO
      title={title}
      description={description}
      path={path}
      noindex={noindex}
      product={product ?? !noindex}
      crumbs={crumbs}
      jsonLd={jsonLd}
    />
    <SkipLink />
    <Header />
    {/* Room for the fixed header: offer banner (2.5rem) + main bar (4.5rem). */}
    <main id="main-content" className="pt-28">
      {children}
    </main>
    <Footer />
  </div>
);

export default PageShell;
