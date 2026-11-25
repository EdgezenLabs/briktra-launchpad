import PageShell from "@/components/PageShell";
import { FAQS } from "@/lib/content";
import { LIMIT_LABELS, inr, usePlans } from "@/lib/plans";
import PlanCards from "@/components/site/PlanCards";
import { NoLockedFeatures } from "@/components/site/Experience";
import { PageHero } from "@/components/site/PageHero";
import FaqList from "@/components/site/FaqList";
import { CtaBand, SectionHeading, WhatsAppLink } from "@/components/site/Blocks";

const PRICING_FAQ = [
  "How does the free trial work?",
  "Is every feature included in every plan?",
  "Does the owner count as a login?",
  "What is the Anniversary Offer?",
  "What payment methods are accepted?",
  "Can I cancel?",
];

const PricingPage = () => {
  const { plans, trialLimits, trialDays } = usePlans();
  return (
    <PageShell
      title="Pricing: Plans from ₹999 a Month"
      description="Briktra plans from ₹999 a month, GST included. Every plan has every feature; choose by sites, workers and logins. Start with a 30-day free trial."
      path="/pricing"
      crumbs={[{ name: "Pricing", path: "/pricing" }]}
    >
      <PageHero
        eyebrow="Pricing"
        title="Simple pricing."
        highlight="Every feature on every plan."
        intro={`Choose by the size of your company. Prices include GST, and every plan starts with ${trialDays} days free.`}
        actions="none"
      />
      <section className="relative z-10 -mt-12 pb-20" aria-labelledby="plans-heading">
        <div className="container mx-auto px-4 md:px-6">
          <div className="rounded-[2rem] border border-border bg-card/95 p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.4)] backdrop-blur md:p-10">
            {/* The plan names are H3s; this keeps the outline H1 > H2 > H3. */}
            <h2 id="plans-heading" className="sr-only">
              Briktra Plans and Prices
            </h2>
            <PlanCards />
          </div>
        </div>
      </section>

      <NoLockedFeatures showCta={false} />

      <section className="py-20" aria-labelledby="compare-heading">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading id="compare-heading" title="What each limit means" />
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[44rem] text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left font-semibold">Limit</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Free Trial</th>
                  {plans.map((p) => (
                    <th key={p.plan_id} scope="col" className="px-4 py-3 text-right font-semibold">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {LIMIT_LABELS.map(({ key, label, help }) => (
                  <tr key={key}>
                    <th scope="row" className="px-4 py-3 text-left font-normal">
                      <span className="font-semibold text-foreground">{label}</span>
                      <span className="block text-xs text-muted-foreground">{help}</span>
                    </th>
                    <td className="px-4 py-3 text-right tabular-nums">{trialLimits ? trialLimits[key].toLocaleString("en-IN") : "—"}</td>
                    {plans.map((p) => (
                      <td key={p.plan_id} className="px-4 py-3 text-right tabular-nums">{p.limits[key].toLocaleString("en-IN")}</td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-muted/30">
                  <th scope="row" className="px-4 py-3 text-left font-semibold">Price per Month</th>
                  <td className="px-4 py-3 text-right">Free for {trialDays} days</td>
                  {plans.map((p) => (
                    <td key={p.plan_id} className="px-4 py-3 text-right font-semibold tabular-nums">{inr(p.monthly_price)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <ul className="mt-8 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            <li>• The owner's login is always free.</li>
            <li>• Every worker on the roster counts, whether or not they use the app.</li>
            <li>• Going over a limit never deletes anything. You just can't add more until you upgrade.</li>
            <li>• Upgrade any time. Unused time on your current plan is credited.</li>
            <li>• Cancel any time. You keep access until the end of the period you paid for.</li>
          </ul>
          <div className="mt-10 rounded-2xl border border-border bg-card p-6 md:flex md:items-center md:justify-between">
            <div>
              <p className="font-display text-lg font-bold text-foreground">More than 20 sites?</p>
              <p className="mt-1 text-sm text-muted-foreground">Talk to us about a plan sized for your company.</p>
            </div>
            <WhatsAppLink className="mt-4 md:mt-0" />
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20" aria-labelledby="pricing-faq-heading">
        <div className="container mx-auto max-w-3xl px-4 md:px-6">
          <SectionHeading id="pricing-faq-heading" center title="Pricing questions" />
          <div className="mt-10">
            <FaqList items={FAQS.filter((f) => PRICING_FAQ.includes(f.q))} />
          </div>
        </div>
      </section>

      <CtaBand />
    </PageShell>
  );
};

export default PricingPage;
