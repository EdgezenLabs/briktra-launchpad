import { Lock, Shield, CreditCard, FileCheck, Headphones, Cloud } from "lucide-react";
import { PAYMENT } from "@/lib/site-config";

const badges = [
  {
    icon: Lock,
    title: "SSL Encrypted",
    description: "Secure HTTPS connection protects data in transit between your browser and our servers.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: PAYMENT.disclaimer,
  },
  {
    icon: FileCheck,
    title: "GST Invoices",
    description: "Tax invoices are generated for every subscription payment with applicable GST details.",
  },
  {
    icon: Shield,
    title: "Data Protection",
    description: "Role-based access, encrypted connections, and industry-standard security practices.",
  },
  {
    icon: Cloud,
    title: "Cloud SaaS",
    description: "Instant digital access — no physical shipping. Your data syncs securely to the cloud.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Reach our team by email and phone during business hours for billing and product help.",
  },
];

const TrustBadges = () => (
  <section className="border-y border-border bg-card py-16" aria-labelledby="trust-heading">
    <div className="container mx-auto px-4 md:px-6">
      <h2 id="trust-heading" className="sr-only">
        Trust and security
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((badge) => (
          <div
            key={badge.title}
            className="flex gap-4 rounded-2xl border border-border/60 bg-background p-6 transition-colors hover:border-primary/30"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <badge.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="mb-1 font-display text-lg font-bold text-foreground">{badge.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBadges;
