import { Link } from "react-router-dom";
import CompanyLink from "@/components/CompanyLink";
import { ArrowRight, BadgeCheck, Building2, Fingerprint, Landmark, Lock, Phone, Quote, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { appLinks } from "@/lib/app-links";
import { COMPANY, SITE } from "@/lib/site-config";
import { FEATURE_GROUPS, PAINS, PATHS, PROOF_POINTS, ROLES, TESTIMONIALS, type FeatureGroup } from "@/lib/content";
import { CheckList, SectionHeading, WhatsAppLink } from "@/components/site/Blocks";
import { DevicePair, PhoneFrame } from "@/components/site/Shots";

export const Hero = () => (
  <section className="relative overflow-hidden bg-[linear-gradient(180deg,hsl(30_30%_97%)_0%,hsl(var(--background))_100%)]">
    <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-3xl" />
    <div className="container relative mx-auto grid items-center gap-12 px-4 py-16 md:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          For Indian contractors and builders
        </p>
        <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
          Every worker, every rupee, every site. <span className="text-primary">On your phone.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Attendance, weekly pay, site cash, purchases, stock and BOQ billing in one app. Your supervisors use it on
          site, your office sees it the same day.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" className="font-semibold" asChild>
            <a href={appLinks.freeTrial}>Start Free Trial</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href={SITE.playStoreUrl} target="_blank" rel="noopener noreferrer">
              <Smartphone className="mr-2 h-4 w-4" aria-hidden="true" />
              Get It on Google Play
            </a>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">30 days free · No card needed · Every feature included</p>
      </div>
      <DevicePair phone="attendance" web="dashboard" alt="Briktra" />
    </div>
  </section>
);

export const PainStrip = () => (
  <section className="border-y border-border bg-card py-14" aria-labelledby="pain-heading">
    <div className="container mx-auto px-4 md:px-6">
      <h2 id="pain-heading" className="text-center font-display text-2xl font-bold text-foreground md:text-3xl">
        Replace registers, spreadsheets and message groups with one system
      </h2>
      <ul className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-3">
        {PAINS.map((p) => (
          <li key={p} className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground/80">
            {p}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-lg font-semibold text-foreground">
        Briktra brings every site, worker and payment into one place, from the first attendance mark to the final bill.
      </p>
    </div>
  </section>
);

export const TwoPaths = () => (
  <section className="py-20" aria-labelledby="paths-heading">
    <div className="container mx-auto px-4 md:px-6">
      <SectionHeading
        id="paths-heading"
        center
        eyebrow="Two ways to work"
        title="Start simple. Add BOQ when you need it."
        intro="Each site chooses how it works and can add BOQ billing at any time. Every company uses only what it needs."
      />
      <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
        {PATHS.map((p, i) => (
          <Link
            key={p.name}
            to={p.href}
            className={`group rounded-2xl border p-7 transition-shadow hover:shadow-lg ${
              i === 1 ? "border-[hsl(var(--section-dark))] bg-[hsl(var(--section-dark))] text-white" : "border-border bg-card"
            }`}
          >
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                i === 1 ? "bg-white/10 text-white" : "bg-primary/10 text-primary"
              }`}
            >
              {p.tag}
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold">{p.name}</h3>
            <p className={`mt-2 leading-relaxed ${i === 1 ? "text-white/75" : "text-muted-foreground"}`}>{p.body}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              See How It Works <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

/** One feature group: points on one side, the screens on the other. */
export const FeatureGroupBlock = ({ group, flip }: { group: FeatureGroup; flip?: boolean }) => (
  <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
    <div className={flip ? "lg:order-2" : ""}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{group.name}</p>
      <h3 className="mt-3 text-balance font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">
        {group.headline}
      </h3>
      <p className="mt-4 leading-relaxed text-muted-foreground">{group.intro}</p>
      <div className="mt-6">
        <CheckList items={group.highlights} />
      </div>
      <Link to={`/${group.slug}`} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
        See Everything in {group.name} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
    <div className={flip ? "lg:order-1" : ""}>
      <DevicePair phone={group.shots.phone} web={group.shots.web} alt={group.name} />
    </div>
  </div>
);

export const FeatureGroupsShowcase = () => (
  <section className="bg-[hsl(220_14%_97%)] py-20" aria-labelledby="groups-heading">
    <div className="container mx-auto px-4 md:px-6">
      <SectionHeading
        id="groups-heading"
        center
        eyebrow="Everything in one app"
        title="Everything your business runs on"
        intro="Six parts that work together. Every plan includes all of them."
      />
      <div className="mt-16 space-y-24">
        {FEATURE_GROUPS.map((g, i) => (
          <FeatureGroupBlock key={g.slug} group={g} flip={i % 2 === 1} />
        ))}
      </div>
      <div className="mt-16 text-center">
        <Button variant="outline" size="lg" asChild>
          <Link to="/features">See All Features</Link>
        </Button>
      </div>
    </div>
  </section>
);

export const ProofPoints = () => (
  <section className="bg-[hsl(var(--section-dark))] py-20" aria-labelledby="proof-heading">
    <div className="container mx-auto px-4 md:px-6">
      <SectionHeading
        id="proof-heading"
        dark
        eyebrow="Built for how money moves on a site"
        title="Controls that protect your margins"
        intro="Built-in rules prevent the errors that cost contractors money."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROOF_POINTS.map((p) => (
          <div key={p.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <BadgeCheck className="h-6 w-6 text-primary" aria-hidden="true" />
            <h3 className="mt-4 font-display text-lg font-bold text-white">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const Roles = () => (
  <section className="py-20" aria-labelledby="roles-heading">
    <div className="container mx-auto px-4 md:px-6">
      <SectionHeading
        id="roles-heading"
        center
        eyebrow="For your whole company"
        title="One app, from the owner to the home buyer"
        intro="Everyone sees what they need. You decide what each role can see and do."
      />
      <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ROLES.map((r) => (
          <div key={r.role} className="flex flex-col rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display text-lg font-bold text-foreground">{r.role}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{r.does}</p>
            <p className="mt-4 text-xs font-medium text-primary">{r.login}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const AppStrip = () => (
  <section className="overflow-hidden bg-[hsl(30_30%_96%)] py-20" aria-labelledby="app-heading">
    <div className="container mx-auto grid items-center gap-12 px-4 md:px-6 lg:grid-cols-2">
      <div>
        <SectionHeading
          id="app-heading"
          eyebrow="Android app and web"
          title="Your whole business on your phone"
          intro="Owners, managers and supervisors can do their work from the Briktra Android app. The web app offers the same features on a larger screen."
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            { icon: Smartphone, text: "Android app on Google Play" },
            { icon: Landmark, text: "Web app on any computer" },
            { icon: Fingerprint, text: "Fingerprint and OTP login" },
            { icon: Building2, text: "Check-in with location at site" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm font-medium text-foreground">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button size="lg" asChild>
            <a href={SITE.playStoreUrl} target="_blank" rel="noopener noreferrer">
              Get It on Google Play
            </a>
          </Button>
        </div>
      </div>
      <div className="flex justify-center gap-5">
        <PhoneFrame shotKey="attendance" alt="Attendance on the Briktra Android app" className="mt-10" />
        <PhoneFrame shotKey="dailyUpdates" alt="Daily updates on the Briktra Android app" className="hidden sm:block" />
      </div>
    </div>
  </section>
);

/** Shown only once real customers have given a quote. */
export const Testimonials = () => {
  if (TESTIMONIALS.length === 0) return null;
  return (
    <section className="py-20" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading id="testimonials-heading" center eyebrow="Customers" title="What contractors say about Briktra" />
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-border bg-card p-6">
              <Quote className="h-6 w-6 text-primary" aria-hidden="true" />
              <blockquote className="mt-3 leading-relaxed text-foreground">{t.quote}</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-foreground">{t.name}</span>
                <span className="block text-muted-foreground">
                  {t.role}, {t.company}, {t.city}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Trust = () => (
  <section className="border-t border-border py-20" aria-labelledby="trust-heading">
    <div className="container mx-auto grid gap-10 px-4 md:px-6 lg:grid-cols-2">
      <SectionHeading
        id="trust-heading"
        eyebrow="Who we are"
        title="Built for the India that builds"
        intro={`Briktra is made by ${COMPANY.legalName} in ${COMPANY.address.city}, ${COMPANY.address.state}. Call us or WhatsApp us any working day.`}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { icon: Building2, title: COMPANY.legalName, body: `GSTIN ${COMPANY.gstin}`, href: COMPANY.website },
          { icon: Phone, title: COMPANY.phone, body: COMPANY.businessHours },
          { icon: Lock, title: "Your data stays yours", body: "Encrypted connections, and every company's data kept apart." },
          { icon: ShieldCheck, title: "Secure payments", body: "Through Cashfree Payments, with a GST invoice for every payment." },
        ].map(({ icon: Icon, title, body, href }: { icon: typeof Building2; title: string; body: string; href?: string }) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-5">
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-3 font-semibold text-foreground">
              {href ? <CompanyLink>{title}</CompanyLink> : title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
        <div className="sm:col-span-2">
          <WhatsAppLink className="w-full sm:w-auto" />
        </div>
      </div>
    </div>
  </section>
);
