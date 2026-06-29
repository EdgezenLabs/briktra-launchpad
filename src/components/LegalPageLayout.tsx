import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import SkipLink from "@/components/SkipLink";
import { COMPANY, LEGAL_LAST_UPDATED, SITE } from "@/lib/site-config";

interface LegalPageLayoutProps {
  title: string;
  description: string;
  path: string;
  children: ReactNode;
}

const LegalPageLayout = ({ title, description, path, children }: LegalPageLayoutProps) => (
  <div className="min-h-screen bg-background">
    <SEO
      title={title}
      description={description}
      canonical={`${SITE.url}${path}`}
    />
    <SkipLink />
    <Header />
    <main id="main-content" className="container mx-auto px-4 py-24 md:px-6 md:py-32">
      <article className="mx-auto max-w-3xl">
        <header className="mb-10 border-b border-border pb-8">
          <h1 className="mb-4 font-display text-4xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">Last Updated: {LEGAL_LAST_UPDATED}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Operated by {COMPANY.legalName} ({COMPANY.businessType}) · GSTIN: {COMPANY.gstin}
          </p>
        </header>
        <div className="prose prose-slate max-w-none space-y-8 text-foreground prose-headings:font-display prose-headings:text-foreground prose-a:text-primary">
          {children}
        </div>
      </article>
    </main>
    <Footer />
  </div>
);

export default LegalPageLayout;
