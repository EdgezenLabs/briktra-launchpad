import { Check, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-card/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="mb-6 flex items-center justify-center gap-2 mx-auto w-fit rounded-full border-2 border-primary/30 bg-primary/10 px-6 py-2.5 text-lg md:text-xl font-bold uppercase tracking-wider text-primary shadow-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            <Tag className="h-5 w-5 md:h-6 md:w-6" />
            Pricing
          </span>
          <h2 className="mb-6 font-display text-4xl font-bold md:text-5xl lg:text-6xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your construction business. No hidden fees or surprise charges.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Starter Plan */}
          <div className="premium-card relative p-8 rounded-3xl border border-border bg-card shadow-sm transition-all hover:shadow-md flex flex-col">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Starter Plan</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-display font-bold">₹499</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground">Perfect for individual contractors and small site operations.</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Basic project management",
                "Daily labor tracking",
                "Simple expense logging",
                "Up to 2 projects at a time",
                "Email support"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button className="w-full rounded-xl py-6" variant="outline" asChild>
              <a href="#notify">Get Started</a>
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="premium-card relative p-8 rounded-3xl border-2 border-primary bg-card shadow-lg flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 right-8 transform -translate-y-1/2 rounded-full bg-primary px-4 py-1 text-sm font-bold text-primary-foreground">
              Most Popular
            </div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-display font-bold">₹999</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground">Advanced features for growing construction companies and agencies.</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Everything in Starter",
                "Advanced contracts & vendor management",
                "Role-based access controls",
                "Multilingual support",
                "Unlimited projects",
                "Priority 24/7 support"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button className="w-full rounded-xl py-6" asChild>
              <a href="/app/index.html">Start Free Trial</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
