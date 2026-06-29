import PageShell from "@/components/PageShell";
import FAQ from "@/components/FAQ";
import { SITE } from "@/lib/site-config";

const FAQPage = () => (
  <PageShell
    title="FAQ"
    description="Frequently asked questions about Briktra subscriptions, payments, refunds, and support."
    canonical={`${SITE.url}/faq`}
  >
    <section className="bg-secondary/30 pt-28 pb-8">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h1 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl">
          Help &amp; FAQ
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Answers to common questions about {SITE.name}, billing, and account management.
        </p>
      </div>
    </section>
    <FAQ showViewAll={false} />
  </PageShell>
);

export default FAQPage;
