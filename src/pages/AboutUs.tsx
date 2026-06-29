import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { SITE, COMPANY } from "@/lib/site-config";
import { HardHat, Target, Eye, CheckCircle2, Users, Building2 } from "lucide-react";

const reasons = [
  "Built specifically for Indian construction site workflows",
  "Mobile-first design for supervisors and field teams",
  "Transparent monthly and annual subscription pricing",
  "Projects, labour, attendance, expenses, and inventory in one platform",
  "Multilingual support — English, Hindi, and Tamil",
  "Secure subscription billing with GST invoices",
];

const audiences = [
  {
    icon: HardHat,
    title: "Independent Contractors",
    description: "Manage multiple sites, labour, and expenses without spreadsheets.",
  },
  {
    icon: Building2,
    title: "Construction Companies",
    description: "Scale operations with role-based access and portfolio reporting.",
  },
  {
    icon: Users,
    title: "Site Supervisors",
    description: "Mark attendance, log expenses, and update progress from the field.",
  },
];

const AboutUs = () => (
  <PageShell
    title="About Briktra"
    description="Learn what Briktra is, who it is for, and why contractors choose our construction ERP platform."
    canonical={`${SITE.url}/about`}
  >
    <section className="bg-secondary/30 pt-28 pb-16">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h1 className="mb-6 font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
          About {SITE.name}
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground leading-relaxed">
          {SITE.tagline}. {SITE.name} helps contractors and builders run projects, sites, and teams from one cloud platform.
        </p>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <h2 className="mb-6 font-display text-3xl font-bold">What is Briktra?</h2>
        <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
          {SITE.name} is a subscription-based construction ERP and project management platform. It unifies
          projects, worksites, labour management, attendance, expenses, procurement, inventory, billing,
          GST records, dashboards, and analytics — accessible on web and mobile.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Unlike generic office software adapted for construction, {SITE.name} is designed for real site
          conditions: quick data entry, multilingual field teams, and live cloud sync for management visibility.
        </p>
      </div>
    </section>

    <section className="bg-foreground py-20 text-background">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="mb-12 text-center font-display text-3xl font-bold">Who is Briktra For?</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {audiences.map((item) => (
            <div key={item.title} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <item.icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
              <p className="text-background/70">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto grid max-w-5xl gap-8 px-4 md:grid-cols-2 md:px-6">
        <div className="premium-card p-8">
          <Target className="mb-4 h-8 w-8 text-primary" aria-hidden="true" />
          <h2 className="mb-4 font-display text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            To give every construction business — from solo contractors to growing firms — professional-grade
            tools to manage projects, people, and money with clarity and confidence.
          </p>
        </div>
        <div className="premium-card p-8">
          <Eye className="mb-4 h-8 w-8 text-primary" aria-hidden="true" />
          <h2 className="mb-4 font-display text-2xl font-bold">Our Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            To become the most trusted construction ERP for Indian builders, where every site decision is
            informed by accurate, real-time data.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-secondary/30 py-20">
      <div className="container mx-auto max-w-3xl px-4 md:px-6">
        <h2 className="mb-8 text-center font-display text-3xl font-bold">Why Contractors Choose Briktra</h2>
        <ul className="space-y-4">
          {reasons.map((reason) => (
            <li key={reason} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-foreground">{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section className="py-16 text-center">
      <div className="container mx-auto px-4 md:px-6">
        <Button size="lg" asChild>
          <a href={SITE.appUrl}>Start Free Trial</a>
        </Button>
        <p className="mt-6 text-sm text-muted-foreground">
          Operated by {COMPANY.legalName} · GSTIN {COMPANY.gstin}
        </p>
      </div>
    </section>
  </PageShell>
);

export default AboutUs;
