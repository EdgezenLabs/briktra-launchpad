import LegalPageLayout from "@/components/LegalPageLayout";
import { COMPANY, SITE } from "@/lib/site-config";

const AcceptableUsePolicy = () => (
  <LegalPageLayout
    title="Acceptable Use Policy"
    description="Rules for acceptable use of the Briktra construction ERP platform."
    path="/acceptable-use-policy"
  >
    <section>
      <h2>1. Purpose</h2>
      <p>
        This Acceptable Use Policy (&ldquo;AUP&rdquo;) defines permitted and prohibited uses of {SITE.name}
        operated by {COMPANY.legalName}. Violations may result in suspension or termination of your account.
      </p>
    </section>

    <section>
      <h2>2. Permitted Use</h2>
      <p>You may use {SITE.name} to lawfully manage construction business operations, including projects, labour, expenses, inventory, and related records for your organization.</p>
    </section>

    <section>
      <h2>3. Prohibited Activities</h2>
      <p>You must not:</p>
      <ul>
        <li>Use the service for any unlawful purpose or in violation of Indian law</li>
        <li>Upload malware, viruses, or harmful code</li>
        <li>Attempt to gain unauthorized access to systems, accounts, or data</li>
        <li>Reverse engineer, decompile, or scrape the platform except as permitted by law</li>
        <li>Resell, sublicense, or redistribute the service without written authorization</li>
        <li>Upload content you do not have rights to, including personal data without consent</li>
        <li>Harass, abuse, or impersonate others through the platform</li>
        <li>Overload or disrupt infrastructure through automated abuse or denial-of-service activity</li>
      </ul>
    </section>

    <section>
      <h2>4. User Content</h2>
      <p>
        You are solely responsible for data entered into {SITE.name}. You represent that you have obtained
        necessary consents from employees, contractors, and third parties whose data you store.
      </p>
    </section>

    <section>
      <h2>5. Enforcement</h2>
      <p>
        We may investigate suspected violations and take action including warnings, feature restrictions,
        suspension, or permanent termination. We may report illegal activity to authorities where required.
      </p>
    </section>

    <section>
      <h2>6. Reporting Abuse</h2>
      <p>Report violations to <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.</p>
    </section>

    <section>
      <h2>7. Changes</h2>
      <p>We may update this AUP from time to time. Continued use constitutes acceptance of the updated policy.</p>
    </section>
  </LegalPageLayout>
);

export default AcceptableUsePolicy;
