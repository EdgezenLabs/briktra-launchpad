import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import AppShowcase from "@/components/AppShowcase";
import AppDownload from "@/components/AppDownload";
import BuiltForField from "@/components/BuiltForField";
import WorkflowVisualization from "@/components/WorkflowVisualization";
import WhoUsesBriktra from "@/components/WhoUsesBriktra";
import Pricing from "@/components/Pricing";
import TrustBadges from "@/components/TrustBadges";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import SkipLink from "@/components/SkipLink";
import { SITE } from "@/lib/site-config";

const Index = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title={`${SITE.name} — ${SITE.tagline}`}
      description={SITE.description}
      canonical={SITE.url}
    />
    <SkipLink />
    <Header />
    <main id="main-content">
      <Hero />
      <Features />
      <AppShowcase />
      <AppDownload />
      <BuiltForField />
      <WorkflowVisualization />
      <WhoUsesBriktra />
      <TrustBadges />
      <Testimonials />
      <Pricing />
      <FAQ limit={6} />
      <CTA />
      <ContactUs />
    </main>
    <Footer />
  </div>
);

export default Index;
