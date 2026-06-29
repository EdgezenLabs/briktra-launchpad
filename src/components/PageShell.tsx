import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import SkipLink from "@/components/SkipLink";

interface PageShellProps {
  title: string;
  description: string;
  canonical: string;
  children: ReactNode;
  noindex?: boolean;
}

const PageShell = ({ title, description, canonical, children, noindex }: PageShellProps) => (
  <div className="min-h-screen bg-background">
    <SEO title={title} description={description} canonical={canonical} noindex={noindex} />
    <SkipLink />
    <Header />
    <main id="main-content">{children}</main>
    <Footer />
  </div>
);

export default PageShell;
