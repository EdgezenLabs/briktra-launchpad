import { ReactNode } from "react";
import PageShell from "@/components/PageShell";
import CompanyLink from "@/components/CompanyLink";
import { PageHero } from "@/components/site/PageHero";
import { COMPANY, LEGAL_LAST_UPDATED } from "@/lib/site-config";

interface LegalPageLayoutProps {
  title: string;
  description: string;
  path: string;
  children: ReactNode;
}

/** Legal pages: the site's page hero, then the policy text in a readable card. */
const LegalPageLayout = ({ title, description, path, children }: LegalPageLayoutProps) => (
  <PageShell title={title} description={description} path={path} product={false} crumbs={[{ name: title, path }]}>
    <PageHero eyebrow="Legal" title={title} intro={`Last updated ${LEGAL_LAST_UPDATED}.`} actions="none" />
    <section className="relative z-10 -mt-10 pb-24">
      <div className="container mx-auto max-w-3xl px-4 md:px-6">
        <article className="rounded-[2rem] border border-border bg-card p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.4)] md:p-10">
          <p className="mb-8 border-b border-border pb-6 text-sm text-muted-foreground">
            Operated by <CompanyLink className="font-medium text-foreground" /> ({COMPANY.businessType}) · GSTIN:{" "}
            {COMPANY.gstin}
          </p>
          <div className="prose prose-slate max-w-none space-y-8 text-foreground prose-headings:font-display prose-headings:text-foreground prose-a:text-primary">
            {children}
          </div>
        </article>
      </div>
    </section>
  </PageShell>
);

export default LegalPageLayout;
