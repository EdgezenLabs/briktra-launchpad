import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import AppShowcase from "@/components/AppShowcase";
import BuiltForField from "@/components/BuiltForField";
import WorkflowVisualization from "@/components/WorkflowVisualization";
import WhoUsesBriktra from "@/components/WhoUsesBriktra";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Briktra - Mobile-First ERP for Construction Companies"
        description="Transform your construction operations with Briktra. The leading mobile-first ERP for project, labour, and material management."
      />
      <Header />
      <main>
        <Hero />
        <Features />
        <AppShowcase />
        <BuiltForField />
        <WorkflowVisualization />
        <WhoUsesBriktra />
        <Pricing />
        <CTA />
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
