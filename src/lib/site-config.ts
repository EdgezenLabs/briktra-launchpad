export const SITE = {
  name: "Briktra",
  tagline: "Construction Management App for Contractors",
  description:
    "Construction management app for Indian contractors and builders: labour attendance, payroll, site cash, purchases, stock and BOQ billing on Android and web.",
  url: "https://briktra.com",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.briktra.app",
  copyrightYear: 2026,
} as const;

export const COMPANY = {
  legalName: "EDGEZEN LABS",
  displayName: "EDGEZEN LABS",
  gstin: "33AAMFE4969Q1ZK",
  businessType: "Partnership",
  website: "https://edgezenlabs.com",
  email: "contact@edgezenlabs.com",
  phone: "+91 9176738389",
  phoneTel: "+919176738389",
  address: {
    line1: "8/241/A",
    line2: "Ambedkhar Street",
    locality: "Perungudi",
    city: "Madurai",
    state: "Tamil Nadu",
    pincode: "625022",
    country: "India",
  },
  businessHours: "Monday – Friday, 9:00 AM – 6:00 PM IST",
} as const;

export const formatAddress = (): string =>
  [
    COMPANY.address.line1,
    COMPANY.address.line2,
    COMPANY.address.locality,
    COMPANY.address.city,
    COMPANY.address.state,
    COMPANY.address.pincode,
    COMPANY.address.country,
  ].join(", ");

export const formatAddressMultiline = (): string =>
  [
    COMPANY.address.line1,
    COMPANY.address.line2,
    `${COMPANY.address.locality}, ${COMPANY.address.city}`,
    `${COMPANY.address.state} ${COMPANY.address.pincode}`,
    COMPANY.address.country,
  ].join("\n");

export const formatAddressSingleLine = (): string =>
  [
    COMPANY.address.line1,
    COMPANY.address.line2,
    COMPANY.address.locality,
    COMPANY.address.city,
    COMPANY.address.state,
    COMPANY.address.pincode,
    COMPANY.address.country,
  ].join(", ");

/**
 * "Talk to Us on WhatsApp". The business number; confirm it has WhatsApp
 * before launch. The message is prefilled so the team knows why they wrote.
 */
export const WHATSAPP = {
  number: "919176738389",
  message: "Hi, I'd like a demo of Briktra.",
  href: (): string =>
    `https://wa.me/${WHATSAPP.number}?text=${encodeURIComponent(WHATSAPP.message)}`,
} as const;

export const PAYMENT = {
  processor: "Cashfree Payments",
  disclaimer:
    "Payments are securely processed through Cashfree Payments. We do not store your full card or UPI credentials on our servers.",
} as const;

export const LEGAL_LAST_UPDATED = "June 29, 2026";

export const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  product: [
    { label: "Labour & Payroll", href: "/labour-payroll" },
    { label: "Site & Cash", href: "/site-management" },
    { label: "Purchase & Stock", href: "/purchase-stock" },
    { label: "BOQ & Billing", href: "/boq-billing" },
    { label: "Customers & Units", href: "/customers" },
    { label: "Reports & Control", href: "/control-reports" },
    { label: "All Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
  ],
  support: [
    { label: "About Briktra", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Cancellation Policy", href: "/cancellation-policy" },
    { label: "Shipping & Delivery", href: "/shipping-delivery-policy" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Security Policy", href: "/security-policy" },
    { label: "Data Deletion Policy", href: "/data-deletion-policy" },
    { label: "Delete Account", href: "/delete-account" },
    { label: "Acceptable Use Policy", href: "/acceptable-use-policy" },
  ],
} as const;
