import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import BuiltForField from "@/components/BuiltForField";
import WorkflowVisualization from "@/components/WorkflowVisualization";
import WhoUsesBriktra from "@/components/WhoUsesBriktra";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <BuiltForField />
        <WorkflowVisualization />
        <WhoUsesBriktra />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
