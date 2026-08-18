import { Helmet } from "react-helmet-async";
import { COMPANY, SITE } from "@/lib/site-config";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: string;
  noindex?: boolean;
}

const SEO = ({
  title = `${SITE.name} — ${SITE.tagline}`,
  description = SITE.description,
  canonical = SITE.url,
  ogType = "website",
  ogImage = `${SITE.url}/og-image.png`,
  twitterCard = "summary_large_image",
  noindex = false,
}: SEOProps) => {
  const siteTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: SITE.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, Android, iOS",
        description: SITE.description,
        url: SITE.url,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "INR",
          lowPrice: "999",
          highPrice: "3999",
          offerCount: "3",
        },
        provider: {
          "@type": "Organization",
          name: COMPANY.legalName,
          url: SITE.url,
          email: COMPANY.email,
          telephone: COMPANY.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: `${COMPANY.address.line1}, ${COMPANY.address.line2}`,
            addressLocality: COMPANY.address.city,
            addressRegion: COMPANY.address.state,
            postalCode: COMPANY.address.pincode,
            addressCountry: "IN",
          },
        },
      },
      {
        "@type": "Organization",
        name: COMPANY.legalName,
        legalName: COMPANY.legalName,
        url: SITE.url,
        email: COMPANY.email,
        telephone: COMPANY.phone,
        taxID: COMPANY.gstin,
      },
    ],
  };

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
};

export default SEO;
