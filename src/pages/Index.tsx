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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
