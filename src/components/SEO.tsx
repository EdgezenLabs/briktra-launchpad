import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: string;
}

const SEO = ({
  title = "Briktra - Mobile-First ERP for Construction Companies",
  description = "Briktra is the leading mobile-first ERP designed for construction companies. Manage projects, labour, materials, vendors, and expenses with offline-first capabilities and multilingual support.",
  canonical = "https://briktra.com",
  ogType = "website",
  ogImage = "https://briktra.com/briktra-favicon.svg",
  twitterCard = "summary_large_image",
}: SEOProps) => {
  const siteTitle = title.includes("Briktra") ? title : `${title} | Briktra`;

  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
