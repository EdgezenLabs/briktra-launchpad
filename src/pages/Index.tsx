import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import WhyBriktra from "@/components/WhyBriktra";
import Countdown from "@/components/Countdown";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <WhyBriktra />
        <Countdown />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
