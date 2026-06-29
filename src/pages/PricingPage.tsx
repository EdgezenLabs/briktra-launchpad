import PageShell from "@/components/PageShell";
import Pricing from "@/components/Pricing";
import TrustBadges from "@/components/TrustBadges";
import { SITE } from "@/lib/site-config";

const PricingPage = () => (
  <PageShell
    title="Pricing"
    description="Briktra subscription plans — monthly and yearly pricing with transparent GST. No hidden charges."
    canonical={`${SITE.url}/pricing`}
  >
    <section className="bg-secondary/30 pt-28 pb-8">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h1 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl">
          Transparent Subscription Pricing
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Choose monthly or annual billing. All prices are exclusive of 18% GST unless stated otherwise. No hidden setup fees.
        </p>
      </div>
    </section>
    <Pricing standalone />
    <TrustBadges />
  </PageShell>
);

export default PricingPage;
