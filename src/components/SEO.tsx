import { Helmet } from "react-helmet-async";
import { COMPANY, SITE } from "@/lib/site-config";
import { FALLBACK_CATALOGUE } from "@/lib/plans";

export interface Crumb {
  name: string;
  path: string;
}

interface SEOProps {
  /** The page's own words; " | Briktra" is added unless the brand is already in it. */
  title: string;
  description: string;
  /** Site path such as "/pricing"; "/" for the homepage. */
  path: string;
  ogImage?: string;
  noindex?: boolean;
  /** Describe the product (SoftwareApplication) on this page. Off for legal pages. */
  product?: boolean;
  /** Trail below Home, e.g. [{ name: "Features", path: "/features" }, { name: "BOQ & Billing", path: "/boq-billing" }]. */
  crumbs?: Crumb[];
  /** Extra schema.org nodes for this page, such as a FAQPage. */
  jsonLd?: Record<string, unknown>[];
}

export const pageUrl = (path: string) => (path === "/" ? `${SITE.url}/` : `${SITE.url}${path}`);

const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;
const APP_ID = `${SITE.url}/#app`;

const organization = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: COMPANY.legalName,
  legalName: COMPANY.legalName,
  brand: { "@type": "Brand", name: SITE.name },
  url: COMPANY.website,
  logo: `${SITE.url}/icon-512.png`,
  email: COMPANY.email,
  telephone: COMPANY.phone,
  taxID: COMPANY.gstin,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${COMPANY.address.line1}, ${COMPANY.address.line2}, ${COMPANY.address.locality}`,
    addressLocality: COMPANY.address.city,
    addressRegion: COMPANY.address.state,
    postalCode: COMPANY.address.pincode,
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: COMPANY.phone,
    email: COMPANY.email,
    areaServed: "IN",
    availableLanguage: ["English"],
  },
};

const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE.name,
  url: `${SITE.url}/`,
  inLanguage: "en-IN",
  publisher: { "@id": ORG_ID },
};

// Prices come from the same catalogue the pricing cards show before the API
// answers, so the structured data never drifts from the page.
const application = {
  "@type": "SoftwareApplication",
  "@id": APP_ID,
  name: SITE.name,
  description: SITE.description,
  url: `${SITE.url}/`,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Construction Management Software",
  operatingSystem: "Android, Web",
  installUrl: SITE.playStoreUrl,
  publisher: { "@id": ORG_ID },
  offers: FALLBACK_CATALOGUE.plans.map((p) => ({
    "@type": "Offer",
    name: `${SITE.name} ${p.name}`,
    price: p.monthly_price,
    priceCurrency: "INR",
    url: `${SITE.url}/pricing`,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: p.monthly_price,
      priceCurrency: "INR",
      unitCode: "MON",
      valueAddedTaxIncluded: true,
    },
  })),
};

const SEO = ({ title, description, path, ogImage, noindex = false, product = true, crumbs, jsonLd = [] }: SEOProps) => {
  const fullTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
  const url = pageUrl(path);
  const image = ogImage ?? `${SITE.url}/og-image.png`;

  const trail = crumbs?.length ? [{ name: "Home", path: "/" }, ...crumbs] : null;
  const graph: Record<string, unknown>[] = [
    organization,
    website,
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: fullTitle,
      description,
      inLanguage: "en-IN",
      isPartOf: { "@id": WEBSITE_ID },
      ...(product ? { about: { "@id": APP_ID } } : {}),
      ...(trail ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
    },
    ...(product ? [application] : []),
    ...(trail
      ? [
          {
            "@type": "BreadcrumbList",
            "@id": `${url}#breadcrumb`,
            itemListElement: trail.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.name,
              item: pageUrl(c.path),
            })),
          },
        ]
      : []),
    ...jsonLd,
  ];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex, follow" : "index, follow, max-image-preview:large"} />
      {/* A page that asks not to be indexed names no canonical. */}
      {!noindex && <link rel="canonical" href={url} />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE.name}: ${SITE.tagline}`} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {!noindex && (
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>
      )}
    </Helmet>
  );
};

export default SEO;
