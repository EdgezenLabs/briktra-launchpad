import { PRODUCTION_ORIGINS } from "./origins";

// vite.config.ts validates and fixes these at build time; the fallbacks only
// apply under the test runner.
export const APP_ORIGIN: string = import.meta.env.VITE_APP_URL || PRODUCTION_ORIGINS.app;
export const API_ORIGIN: string = import.meta.env.VITE_API_URL || PRODUCTION_ORIGINS.api;

/** Plan ids as the API's plan catalogue names them. */
export type PlanId = "starter" | "basic" | "premium" | "max";
export type Billing = "monthly" | "annual";

/**
 * Every place the site links into the app. Paths are the Flutter router's.
 * A free trial is ordinary registration: the API starts every new company
 * on the free plan's trial, with no payment.
 */
export const appLinks = {
  login: `${APP_ORIGIN}/login`,
  register: `${APP_ORIGIN}/register`,
  freeTrial: `${APP_ORIGIN}/register`,
  /** Registration with a plan preselected; the app checks it against its catalogue and price. */
  plan: (plan: PlanId, billing: Billing): string =>
    `${APP_ORIGIN}/register?${new URLSearchParams({ plan, billing }).toString()}`,
} as const;
