import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { appLinks, type Billing } from "@/lib/app-links";
import { LIMIT_LABELS, PLAN_FOR, inr, usePlans, type Plan } from "@/lib/plans";

const BillingSwitch = ({ billing, onChange }: { billing: Billing; onChange: (b: Billing) => void }) => (
  <div className="inline-flex rounded-full border border-border bg-card p-1" role="group" aria-label="Billing period">
    {(["monthly", "annual"] as const).map((b) => (
      <button
        key={b}
        type="button"
        aria-pressed={billing === b}
        onClick={() => onChange(b)}
        className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
          billing === b ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {b === "monthly" ? "Monthly" : "Annual · 2 Months Free"}
      </button>
    ))}
  </div>
);

const PlanCard = ({ plan, billing, offerName }: { plan: Plan; billing: Billing; offerName?: string }) => {
  const annual = billing === "annual";
  const price = annual ? plan.annual_price : plan.monthly_price;
  const regular = annual ? plan.regular_annual_price : plan.regular_monthly_price;
  const showRegular = plan.offer_applied && regular > price;
  const popular = plan.is_popular;
  return (
    <article
      className={`relative flex flex-col rounded-2xl border p-6 ${
        popular ? "bk-glow border-primary bg-card lg:-translate-y-3" : "border-border bg-card"
      }`}
      aria-label={`${plan.name} plan`}
    >
      {popular && (
        <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          Most Popular
        </span>
      )}
      <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
      <p className="mt-1 min-h-[2.5rem] text-sm text-muted-foreground">{PLAN_FOR[plan.plan_id]}</p>
      <div className="mt-5">
        {showRegular && (
          <p className="text-sm text-muted-foreground">
            <span className="line-through">{inr(regular)}</span>
            {offerName && <span className="ml-2 font-semibold text-primary">{offerName}</span>}
          </p>
        )}
        <p className="font-display text-4xl font-bold text-foreground">
          {inr(price)}
          <span className="ml-1 text-base font-medium text-muted-foreground">/{annual ? "year" : "month"}</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">GST included</p>
      </div>
      <ul className="mt-6 flex-1 space-y-2.5">
        {LIMIT_LABELS.map(({ key, label }) => (
          <li key={key} className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold tabular-nums text-foreground">{plan.limits[key].toLocaleString("en-IN")}</span>
          </li>
        ))}
        <li className="flex items-center gap-2 pt-2 text-sm font-medium text-foreground">
          <Check className="h-4 w-4 text-primary" aria-hidden="true" />
          Every feature included
        </li>
      </ul>
      <Button className="mt-6 w-full font-semibold" variant={popular ? "default" : "outline"} asChild>
        <a
          href={appLinks.plan(plan.plan_id, billing)}
          aria-label={`Get started with ${plan.name}, billed ${annual ? "annually" : "monthly"}`}
        >
          Choose {plan.name}
        </a>
      </Button>
    </article>
  );
};

/** Plan cards, priced from the API when it answers. */
const PlanCards = () => {
  const [billing, setBilling] = useState<Billing>("monthly");
  const { plans, offer, trialDays } = usePlans();
  return (
    <div>
      <div className="flex flex-col items-center gap-3">
        <BillingSwitch billing={billing} onChange={setBilling} />
        {offer && (
          <p className="text-center text-sm font-medium text-foreground">
            🎉 Briktra turns 2 — {offer.name} for the next {offer.max_companies} companies. Your price stays locked
            while you stay subscribed.
          </p>
        )}
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((p) => (
          <PlanCard key={p.plan_id} plan={p} billing={billing} offerName={offer?.name} />
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Every plan starts with a {trialDays}-day free trial. No card needed. Prices include GST.
      </p>
    </div>
  );
};

export default PlanCards;
