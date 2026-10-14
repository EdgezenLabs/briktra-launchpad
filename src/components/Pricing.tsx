import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { appLinks, type PlanId } from "@/lib/app-links";

const plans: { id: PlanId; name: string; monthly: number; annual: number; caps: number[] }[] = [
  {id: "starter", name: "Starter", monthly: 999, annual: 9999, caps: [1, 1, 10, 1, 2, 1]},
  {id: "basic", name: "Basic", monthly: 1499, annual: 14999, caps: [2, 3, 30, 3, 5, 3]},
  {id: "premium", name: "Premium", monthly: 2999, annual: 29999, caps: [5, 15, 150, 10, 30, 10]},
  {id: "max", name: "Max", monthly: 7999, annual: 79999, caps: [20, 60, 500, 30, 100, 30]},
];
const labels = ["Sites", "Sub-projects", "Workers", "Manager/supervisor logins", "Customer logins", "Contractors"];
const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export default function Pricing({ standalone = false }: { standalone?: boolean }) {
  const [annual, setAnnual] = useState(false);
  return <section id="pricing" className="py-16">
    <div className="container mx-auto px-4 md:px-6">
      {!standalone && <h2 className="text-center text-3xl font-bold">Plans for every stage of growth</h2>}
      <p className="mt-4 text-center text-muted-foreground">Every plan includes the full product. Choose the capacity your company needs. Prices include GST.</p>
      <div className="my-8 flex justify-center gap-2">
        <Button variant={!annual ? "default" : "outline"} onClick={() => setAnnual(false)}>Monthly</Button>
        <Button variant={annual ? "default" : "outline"} onClick={() => setAnnual(true)}>Annual · save about 17%</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {plans.map(plan => <article key={plan.name} className={`relative rounded-2xl border p-6 ${plan.name === "Premium" ? "border-primary shadow-lg" : "border-border"}`}>
          {plan.name === "Premium" && <p className="mb-3 text-sm font-semibold text-primary">Recommended</p>}
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <p className="my-4 text-3xl font-bold">{money(annual ? plan.annual : plan.monthly)}<span className="text-sm font-normal text-muted-foreground"> / {annual ? "year" : "month"}</span></p>
          <ul className="space-y-3">{labels.map((label, index) => <li key={label} className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-primary" /><span>{plan.caps[index].toLocaleString("en-IN")} {label}</span></li>)}<li className="pt-2 font-medium">All product features included</li></ul>
          <Button asChild className="mt-6 w-full"><a href={appLinks.plan(plan.id, annual ? "annual" : "monthly")} aria-label={`Get started with ${plan.name}, billed ${annual ? "annually" : "monthly"}`}>Get started</a></Button>
        </article>)}
      </div>
      <div className="mx-auto mt-10 max-w-3xl space-y-3 text-center text-muted-foreground">
        <p>Start with a 30-day free trial. Premium suits growing companies; Max provides more capacity for large teams.</p>
        <p>Upgrades start after successful payment, with unused paid time credited toward the upgrade. A new billing period starts immediately.</p>
        <p>Cancellation stops renewal. Access continues until the paid period ends. No cash refund is issued for unused time.</p>
      </div>
    </div>
  </section>;
}
