import { useState, useEffect } from "react";
import { Mail, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Countdown = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Set launch date to 60 days from now
  useEffect(() => {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 60);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  const timeBlocks = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <section id="notify" className="relative overflow-hidden bg-section-dark py-24">
      {/* Background elements */}
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]"></div>
      
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Launching Soon</span>
          </div>

          {/* Headline */}
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            We're Almost{" "}
            <span className="relative inline-block">
              Ready
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 12" fill="none">
                <path d="M2 10C20 4 60 2 98 6" stroke="hsl(38 92% 50%)" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          </h2>
          <p className="mb-12 text-lg text-muted-foreground">
            We're putting the finishing touches on Briktra. Be the first to know when we launch.
          </p>

          {/* Countdown timer */}
          <div className="mb-12 grid grid-cols-4 gap-4">
            {timeBlocks.map((block) => (
              <div key={block.label} className="relative">
                <div className="feature-card flex flex-col items-center justify-center py-4 md:py-6">
                  <span className="font-display text-3xl font-bold text-foreground md:text-5xl">
                    {String(block.value).padStart(2, "0")}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground md:text-sm">
                    {block.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Email signup */}
          <div className="mx-auto max-w-lg">
            {submitted ? (
              <div className="rounded-xl border border-accent/50 bg-accent/10 p-6 text-center glow-accent">
                <Bell className="mx-auto mb-3 h-8 w-8 text-accent" />
                <p className="font-display text-lg font-semibold text-foreground">
                  You're on the list!
                </p>
                <p className="text-sm text-muted-foreground">
                  We'll notify you as soon as Briktra launches.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="h-14 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <Button type="submit" variant="accent" size="xl" className="w-full sm:w-auto">
                    <Bell className="h-5 w-5" />
                    Notify Me
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Countdown;
