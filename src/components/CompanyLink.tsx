import type { ReactNode } from "react";
import { COMPANY } from "@/lib/site-config";

/** The company name, linked to its own website (opens in a new tab). */
const CompanyLink = ({ className = "", children }: { className?: string; children?: ReactNode }) => (
  <a
    href={COMPANY.website}
    target="_blank"
    rel="noopener"
    className={`underline-offset-4 transition-colors hover:text-primary hover:underline ${className}`}
  >
    {children ?? COMPANY.legalName}
  </a>
);

export default CompanyLink;
