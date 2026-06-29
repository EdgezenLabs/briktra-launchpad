import LegalPageLayout from "@/components/LegalPageLayout";
import { COMPANY, PAYMENT, SITE } from "@/lib/site-config";

const PrivacyPolicy = () => (
  <LegalPageLayout
    title="Privacy Policy"
    description="How Briktra by EDGEZEN LABS collects, uses, and protects your personal data."
    path="/privacy-policy"
  >
    <section>
      <h2>1. Introduction</h2>
      <p>
        This Privacy Policy describes how {COMPANY.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects,
        uses, stores, and protects personal information when you visit {SITE.url}, use the {SITE.name} cloud
        software platform, or communicate with us. By using our services, you agree to the practices described in
        this policy.
      </p>
    </section>

    <section>
      <h2>2. Data Controller</h2>
      <p>
        <strong>{COMPANY.legalName}</strong> ({COMPANY.businessType})<br />
        GSTIN: {COMPANY.gstin}<br />
        {COMPANY.address.line1}, {COMPANY.address.line2}, {COMPANY.address.locality}, {COMPANY.address.city},{" "}
        {COMPANY.address.state} {COMPANY.address.pincode}, {COMPANY.address.country}<br />
        Email: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> · Phone:{" "}
        <a href={`tel:${COMPANY.phoneTel}`}>{COMPANY.phone}</a>
      </p>
    </section>

    <section>
      <h2>3. Information We Collect</h2>
      <ul>
        <li><strong>Account data:</strong> Name, email, phone number, company name, and login credentials.</li>
        <li><strong>Business data:</strong> Project, site, labour, attendance, expense, inventory, and billing records you enter into Briktra.</li>
        <li><strong>Payment data:</strong> Transaction references and billing details. Card and UPI credentials are processed by {PAYMENT.processor}; we do not store full payment credentials.</li>
        <li><strong>Technical data:</strong> IP address, browser type, device information, usage logs, and cookies (see our Cookie Policy).</li>
        <li><strong>Communications:</strong> Messages you send via contact forms, email, or support channels.</li>
      </ul>
    </section>

    <section>
      <h2>4. How We Use Your Information</h2>
      <ul>
        <li>Provide, operate, and maintain the Briktra subscription service</li>
        <li>Process subscription payments and generate tax invoices</li>
        <li>Authenticate users and enforce role-based access controls</li>
        <li>Respond to support requests and service communications</li>
        <li>Improve platform performance, security, and user experience</li>
        <li>Comply with applicable laws, including tax and regulatory obligations in India</li>
      </ul>
    </section>

    <section>
      <h2>5. Legal Basis and Consent</h2>
      <p>
        We process personal data based on contractual necessity (to deliver the subscribed service), legitimate
        business interests (security and product improvement), and your consent where required (e.g., marketing
        communications or non-essential cookies).
      </p>
    </section>

    <section>
      <h2>6. Data Sharing</h2>
      <p>We do not sell your personal data. We may share data with:</p>
      <ul>
        <li><strong>Payment processors</strong> such as {PAYMENT.processor} to complete subscription transactions</li>
        <li><strong>Cloud infrastructure providers</strong> that host our application and databases</li>
        <li><strong>Professional advisers</strong> where required by law or to protect our legal rights</li>
        <li><strong>Authorities</strong> when legally compelled to disclose information</li>
      </ul>
    </section>

    <section>
      <h2>7. Data Retention</h2>
      <p>
        We retain account and business data for as long as your subscription is active and for a reasonable period
        thereafter to comply with legal, tax, and dispute-resolution requirements. You may request deletion as
        described in our Data Deletion Policy.
      </p>
    </section>

    <section>
      <h2>8. Security</h2>
      <p>
        We implement technical and organizational measures including encryption in transit (SSL/TLS), access
        controls, and secure development practices. See our Security Policy for more detail.
      </p>
    </section>

    <section>
      <h2>9. Your Rights</h2>
      <p>Subject to applicable Indian law, you may request access, correction, or deletion of your personal data, or withdraw consent for optional processing. Contact us at {COMPANY.email}.</p>
    </section>

    <section>
      <h2>10. Children</h2>
      <p>Briktra is a business software product not intended for individuals under 18 years of age.</p>
    </section>

    <section>
      <h2>11. Changes</h2>
      <p>We may update this Privacy Policy from time to time. Material changes will be posted on this page with an updated date.</p>
    </section>

    <section>
      <h2>12. Contact</h2>
      <p>
        For privacy-related questions: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> ·{" "}
        <a href={`tel:${COMPANY.phoneTel}`}>{COMPANY.phone}</a>
      </p>
    </section>
  </LegalPageLayout>
);

export default PrivacyPolicy;
