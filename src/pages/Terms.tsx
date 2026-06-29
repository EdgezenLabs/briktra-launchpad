import LegalPageLayout from "@/components/LegalPageLayout";
import { COMPANY, PAYMENT, SITE } from "@/lib/site-config";

const Terms = () => (
  <LegalPageLayout
    title="Terms & Conditions"
    description="Terms governing your use of the Briktra construction ERP subscription platform."
    path="/terms"
  >
    <section>
      <h2>1. Agreement</h2>
      <p>
        These Terms &amp; Conditions (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you and{" "}
        {COMPANY.legalName} ({COMPANY.businessType}, GSTIN: {COMPANY.gstin}) for access to the {SITE.name}{" "}
        cloud software service available at {SITE.url} and associated applications.
      </p>
    </section>

    <section>
      <h2>2. Service Description</h2>
      <p>
        {SITE.name} is a subscription-based Software-as-a-Service (SaaS) platform for construction project
        management and ERP functions, including projects, sites, labour, attendance, expenses, inventory,
        billing, reports, and analytics. The service is delivered digitally over the internet. No physical
        goods are sold or shipped.
      </p>
    </section>

    <section>
      <h2>3. Account Registration</h2>
      <p>
        You must provide accurate and complete registration information. You are responsible for safeguarding
        your account credentials and all activity under your account. Notify us immediately of unauthorized access.
      </p>
    </section>

    <section>
      <h2>4. Subscription and Billing</h2>
      <ul>
        <li>Plans are billed monthly or annually as selected at checkout.</li>
        <li>Prices displayed on our website are exclusive of applicable GST unless stated otherwise. GST at the prevailing rate (currently 18%) is added to invoices where applicable.</li>
        <li>Payments are processed through {PAYMENT.processor}. By subscribing, you authorize recurring charges for renewal periods unless cancelled.</li>
        <li>Tax invoices are generated for successful payments and available in your account.</li>
        <li>We may change plan pricing with reasonable notice. Price changes apply to subsequent billing cycles.</li>
      </ul>
    </section>

    <section>
      <h2>5. Free Trial and Upgrades</h2>
      <p>
        We may offer trial access at our discretion. Trial features and duration may vary. Upgrading to a paid
        plan begins the billing cycle selected at purchase.
      </p>
    </section>

    <section>
      <h2>6. Acceptable Use</h2>
      <p>
        Your use of {SITE.name} is subject to our Acceptable Use Policy. You may not misuse the platform,
        attempt unauthorized access, or use the service for unlawful purposes.
      </p>
    </section>

    <section>
      <h2>7. Intellectual Property</h2>
      <p>
        {SITE.name}, its software, branding, and documentation are owned by {COMPANY.legalName}. You receive a
        limited, non-exclusive, non-transferable license to use the service during an active subscription.
        You retain ownership of business data you upload.
      </p>
    </section>

    <section>
      <h2>8. Data and Privacy</h2>
      <p>
        Our collection and use of personal data is governed by our Privacy Policy. You are responsible for
        ensuring you have appropriate rights to upload data about your employees, contractors, and projects.
      </p>
    </section>

    <section>
      <h2>9. Service Availability</h2>
      <p>
        We strive for high availability but do not guarantee uninterrupted access. Scheduled maintenance,
        third-party outages, or force majeure events may cause temporary disruption. We are not liable for
        losses arising from downtime beyond our reasonable control.
      </p>
    </section>

    <section>
      <h2>10. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, {COMPANY.legalName} shall not be liable for indirect,
        incidental, special, consequential, or punitive damages. Our aggregate liability for any claim
        relating to the service shall not exceed the fees paid by you in the twelve (12) months preceding the claim.
      </p>
    </section>

    <section>
      <h2>11. Termination</h2>
      <p>
        You may cancel your subscription as described in our Cancellation Policy. We may suspend or terminate
        accounts that violate these Terms or applicable law. Upon termination, your right to access the service ends.
      </p>
    </section>

    <section>
      <h2>12. Governing Law</h2>
      <p>
        These Terms are governed by the laws of India. Courts in Madurai, Tamil Nadu shall have exclusive
        jurisdiction, subject to applicable consumer protection laws.
      </p>
    </section>

    <section>
      <h2>13. Contact</h2>
      <p>
        {COMPANY.legalName}<br />
        {COMPANY.address.line1}, {COMPANY.address.line2}, {COMPANY.address.locality}, {COMPANY.address.city},{" "}
        {COMPANY.address.state} {COMPANY.address.pincode}<br />
        Email: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> · Phone:{" "}
        <a href={`tel:${COMPANY.phoneTel}`}>{COMPANY.phone}</a>
      </p>
    </section>
  </LegalPageLayout>
);

export default Terms;
