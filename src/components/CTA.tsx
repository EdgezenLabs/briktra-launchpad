import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Countdown from "@/components/Countdown";


const CTA = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section id="notify" className="relative bg-background py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="premium-card overflow-hidden">
            <div className="relative p-8 md:p-12 text-center">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
              
              <div className="relative z-10">
                <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  Launching Soon
                </span>
                
                <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
                  Ready to Transform Your{" "}
                  <span className="text-foreground">Construction Operations?</span>
                </h2>
                
                <p className="mb-8 text-lg text-muted-foreground">
                  Be among the first to experience Briktra. Get early access and exclusive launch benefits.
                </p>

                {/* Email signup */}
                <div className="mx-auto max-w-md">
                  {submitted ? (
                    <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-center">
                      <p className="font-medium text-primary">
                        🎉 You're on the list! We'll notify you when we launch.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative flex-1">
                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="h-12 w-full rounded-lg border border-border bg-background pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          required
                        />
                      </div>
                      <Button type="submit" size="lg" className="group">
                        Get Early Access
                        <ArrowRight className="transition-transform group-hover:translate-x-1" />
                      </Button>
                    </form>
                  )}
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  Join 500+ construction professionals waiting for launch
                </p>
                {/* CTA buttons */}
                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Button variant="default" size="lg" className="group min-w-[160px]">
                    Request Demo
                    <ArrowRight className="transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button variant="outline" size="lg" className="min-w-[160px]">
                    Start Free Trial
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
