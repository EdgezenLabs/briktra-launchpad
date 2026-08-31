/**
 * Turnstile configuration for the public forms.
 *
 * Kept out of the component file so importing these constants does not
 * break React Fast Refresh (a module must export only components for it
 * to apply).
 */

export const turnstileSiteKey: string =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

/**
 * Whether to render and require a challenge. With no site key configured
 * the widget renders nothing and the form stays usable, matching the API,
 * which only verifies in production (see turnstile.service.js).
 */
export const turnstileEnabled = Boolean(turnstileSiteKey);
