import { Link } from "react-router-dom";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site-config";
import { FAQS } from "@/lib/content";
import { CtaBand, SectionHeading } from "@/components/site/Blocks";
import { PainStrip, ProofPoints, Roles, Testimonials, Trust, TwoPaths } from "@/components/site/Sections";
import { CinematicHero, DayOnSite, FeatureBento, NoLockedFeatures, TradeStrip } from "@/components/site/Experience";
import PlanCards from "@/components/site/PlanCards";
import { ReportsShowcase } from "@/components/site/ReportsShowcase";
import FaqList from "@/components/site/FaqList";

const Index = () => (
  <PageShell
    title="Briktra: Construction Management App for Contractors"
    description={SITE.description}
    path="/"
  >
    <CinematicHero />
    <TradeStrip />
    <PainStrip />
    <DayOnSite />
    <TwoPaths />
    <FeatureBento />
    <ReportsShowcase />
    <ProofPoints />
    <Roles />
    <Testimonials />
    <NoLockedFeatures />
    <section className="bg-[hsl(220_14%_97%)] py-20" aria-labelledby="pricing-heading">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading
          id="pricing-heading"
          center
          eyebrow="Pricing"
          title="Choose the size that fits your company"
        />
        <div className="mt-10">
          <PlanCards />
        </div>
        <div className="mt-8 text-center">
          <Button variant="link" asChild>
            <Link to="/pricing">Compare Plans in Detail</Link>
          </Button>
        </div>
      </div>
    </section>
    <Trust />
    <section className="py-20" aria-labelledby="faq-heading">
      <div className="container mx-auto max-w-3xl px-4 md:px-6">
        <SectionHeading id="faq-heading" center eyebrow="Questions" title="What contractors ask us" />
        <div className="mt-10">
          <FaqList items={FAQS.slice(0, 6)} />
        </div>
        <div className="mt-6 text-center">
          <Button variant="link" asChild>
            <Link to="/faq">See All Questions</Link>
          </Button>
        </div>
      </div>
    </section>
    <CtaBand />
  </PageShell>
);

export default Index;
