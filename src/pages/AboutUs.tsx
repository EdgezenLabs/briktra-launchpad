import { Building2, Clock, HandCoins, Mail, MapPin, Phone, Smartphone, Users, type LucideIcon } from "lucide-react";
import PageShell from "@/components/PageShell";
import CompanyLink from "@/components/CompanyLink";
import { COMPANY, formatAddressMultiline } from "@/lib/site-config";
import { CtaBand, WhatsAppLink } from "@/components/site/Blocks";
import { Roles } from "@/components/site/Sections";
import { Reveal } from "@/components/site/Experience";
import { PageHero } from "@/components/site/PageHero";

const BELIEFS: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Smartphone, title: "Built for the site", body: "A supervisor should mark attendance in seconds, from their phone." },
  { icon: Building2, title: "For every contractor", body: "A contractor without a BOQ deserves the same tools as one with a BOQ." },
  { icon: HandCoins, title: "Every rupee accounted for", body: "Wages, site cash, bills and collections, all recorded and traceable." },
  { icon: Users, title: "Simple, honest pricing", body: "Every feature on every plan. You pay only for the size you need." },
];

const AboutUs = () => (
  <PageShell
    title="About Us: Built for the India That Builds"
    description={`Briktra is construction management software built in ${COMPANY.address.city}, Tamil Nadu by ${COMPANY.legalName} for Indian contractors and builders.`}
    path="/about"
    crumbs={[{ name: "About", path: "/about" }]}
  >
    <PageHero
      eyebrow="About Briktra"
      title="Built for the India"
      highlight="that builds."
      intro="Most construction software is designed for the office. Indian sites run on daily-wage crews, weekly wages, site cash and bills awaiting approval. Briktra is designed for how Indian sites actually work."
    />

    <section className="py-24" aria-labelledby="story-heading">
      <div className="container mx-auto grid max-w-6xl items-center gap-12 px-4 md:px-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">What Briktra does</p>
          <h2 id="story-heading" className="mt-3 text-balance font-display text-4xl font-bold leading-tight text-foreground">
            One system from the first attendance mark to the final bill
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Attendance, weekly pay, site cash, purchases, stock, BOQ and billing, and an app for your home buyers, all in
            one place. A small contractor can start in an afternoon, and a builder with twenty sites can run every one of
            them on it.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {BELIEFS.map((b, i) => (
            <Reveal key={b.title} delay={i * 80}>
              <div className="h-full rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <b.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <Roles />

    <section className="bg-[hsl(30_33%_97%)] py-24" aria-labelledby="company-heading">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">The company</p>
            <h2 id="company-heading" className="mt-3 font-display text-4xl font-bold text-foreground">
              <CompanyLink />
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Briktra is built and supported from {COMPANY.address.city}, {COMPANY.address.state}. Support should be
              personal and responsive; call or WhatsApp us any working day.
            </p>
            <div className="mt-8">
              <WhatsAppLink />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: MapPin, title: "Registered Address", body: formatAddressMultiline() },
              { icon: Building2, title: "GSTIN", body: COMPANY.gstin },
              { icon: Phone, title: "Phone", body: COMPANY.phone },
              { icon: Mail, title: "Email", body: COMPANY.email },
              { icon: Clock, title: "Business Hours", body: COMPANY.businessHours },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-5">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <CtaBand />
  </PageShell>
);

export default AboutUs;
