import { useEffect, useState } from "react";
import { API_ORIGIN, type PlanId } from "@/lib/app-links";

export interface PlanLimits {
  max_projects: number;
  max_sub_projects: number;
  max_employees: number;
  max_team_logins: number;
  max_customers: number;
  max_contractors: number;
}

export interface Plan {
  plan_id: PlanId;
  name: string;
  is_popular: boolean;
  /** What a new company pays now: the offer price while an offer is open. */
  monthly_price: number;
  annual_price: number;
  regular_monthly_price: number;
  regular_annual_price: number;
  offer_applied: boolean;
  limits: PlanLimits;
}

export interface Catalogue {
  offer: { name: string; max_companies: number } | null;
  plans: Plan[];
  trialDays: number;
  trialLimits: PlanLimits | null;
  /** True once the API answered; false while showing the built-in copy. */
  live: boolean;
}

const lim = (p: number, s: number, e: number, t: number, c: number, k: number): PlanLimits => ({
  max_projects: p,
  max_sub_projects: s,
  max_employees: e,
  max_team_logins: t,
  max_customers: c,
  max_contractors: k,
});

const plan = (
  plan_id: PlanId,
  name: string,
  offer: [number, number],
  regular: [number, number],
  limits: PlanLimits,
  is_popular = false,
): Plan => ({
  plan_id,
  name,
  is_popular,
  monthly_price: offer[0],
  annual_price: offer[1],
  regular_monthly_price: regular[0],
  regular_annual_price: regular[1],
  offer_applied: true,
  limits,
});

/**
 * The catalogue agreed on 25 Nov 2026 (API migration 20261125000001), shown
 * until GET /public/plans answers, and if it never does.
 */
export const FALLBACK_CATALOGUE: Catalogue = {
  offer: { name: "Anniversary Offer", max_companies: 25 },
  trialDays: 30,
  trialLimits: lim(3, 6, 75, 4, 15, 12),
  live: false,
  plans: [
    plan("starter", "Starter", [999, 9999], [1500, 15000], lim(2, 2, 25, 2, 5, 6)),
    plan("basic", "Basic", [1499, 14999], [2000, 20000], lim(3, 6, 75, 4, 15, 12)),
    plan("premium", "Premium", [2999, 29999], [3999, 39990], lim(6, 18, 200, 10, 60, 30), true),
    plan("max", "Max", [7999, 79999], [10000, 100000], lim(20, 60, 1000, 30, 300, 100)),
  ],
};

const SOLD: PlanId[] = ["starter", "basic", "premium", "max"];

/** Shape the API's answer; null when it is not usable. */
export function fromApi(body: unknown): Catalogue | null {
  if (!body || typeof body !== "object") return null;
  const raw = body as { offer?: unknown; plans?: unknown };
  if (!Array.isArray(raw.plans)) return null;
  const rows = raw.plans as Record<string, unknown>[];
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
  const plans: Plan[] = [];
  for (const id of SOLD) {
    const r = rows.find((p) => p.plan_id === id);
    if (!r) continue;
    const monthly = num(r.monthly_price);
    const annual = num(r.annual_price);
    const limits = r.limits as PlanLimits | undefined;
    if (monthly === null || annual === null || monthly <= 0 || !limits) return null;
    plans.push({
      plan_id: id,
      name: String(r.name ?? id),
      is_popular: r.is_popular === true,
      monthly_price: monthly,
      annual_price: annual,
      regular_monthly_price: num(r.regular_monthly_price) ?? monthly,
      regular_annual_price: num(r.regular_annual_price) ?? annual,
      offer_applied: r.offer_applied === true,
      limits,
    });
  }
  if (plans.length === 0) return null;
  const free = rows.find((p) => p.plan_id === "free");
  const offer = raw.offer as Catalogue["offer"];
  return {
    offer: offer && typeof offer.name === "string" ? offer : null,
    plans,
    trialDays: num(free?.trial_days) ?? 30,
    trialLimits: (free?.limits as PlanLimits | undefined) ?? null,
    live: true,
  };
}

let cached: Catalogue | null = null;

/** The plan catalogue: the built-in copy first, then the API's when it answers. */
export function usePlans(): Catalogue {
  const [catalogue, setCatalogue] = useState<Catalogue>(cached ?? FALLBACK_CATALOGUE);
  useEffect(() => {
    if (cached) return;
    const controller = new AbortController();
    fetch(`${API_ORIGIN}/public/plans`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        const shaped = fromApi(body);
        if (shaped) {
          cached = shaped;
          setCatalogue(shaped);
        }
      })
      .catch(() => {
        /* keep the built-in copy */
      });
    return () => controller.abort();
  }, []);
  return catalogue;
}

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const LIMIT_LABELS: { key: keyof PlanLimits; label: string; help: string }[] = [
  { key: "max_projects", label: "Sites", help: "Each job or project you run." },
  { key: "max_sub_projects", label: "Blocks / Phases", help: "Parts of a site you track separately, like Tower A or Phase 1." },
  { key: "max_employees", label: "Workers", help: "Everyone on your labour roster whose attendance and pay Briktra manages." },
  { key: "max_team_logins", label: "Managers & Supervisors", help: "People you invite to run sites or the office. The owner is always free." },
  { key: "max_customers", label: "Home Buyer Logins", help: "Buyers of your flats or plots who use the customer app." },
  { key: "max_contractors", label: "Sub-Contractors", help: "Labour or work contractors you give work orders to and pay." },
];

/** One line that describes the company each plan is sized for. */
export const PLAN_FOR: Record<PlanId, string> = {
  starter: "A small contractor running 1–2 sites.",
  basic: "A growing contractor with 3 sites and their own crew.",
  premium: "An established contractor or builder with several sites.",
  max: "A large company running many sites at once.",
};
