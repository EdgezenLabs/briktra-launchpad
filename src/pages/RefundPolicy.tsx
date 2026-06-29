import LegalPageLayout from "@/components/LegalPageLayout";
import { COMPANY, SITE } from "@/lib/site-config";

const RefundPolicy = () => (
  <LegalPageLayout
    title="Refund Policy"
    description="Refund terms for Briktra SaaS subscription payments processed via Cashfree."
    path="/refund-policy"
  >
    <section>
      <h2>1. Overview</h2>
      <p>
        {SITE.name} is a subscription-based cloud software service operated by {COMPANY.legalName} (GSTIN:{" "}
        {COMPANY.gstin}). This Refund Policy explains when refunds may or may not be issued for subscription
        payments.
      </p>
    </section>

    <section>
      <h2>2. General Policy</h2>
      <p>
        Subscription fees are <strong>non-refundable</strong> once a billing period has commenced, except where
        required by applicable law or as expressly stated below. Cancelling a subscription stops future renewals
        but does not entitle you to a refund for the current billing period.
      </p>
    </section>

    <section>
      <h2>3. Exceptions</h2>
      <p>We may issue a full or partial refund at our sole discretion in the following circumstances:</p>
      <ul>
        <li><strong>Duplicate charge:</strong> You were billed twice for the same subscription period.</li>
        <li><strong>Billing error:</strong> An incorrect plan amount was charged due to a system error on our side.</li>
        <li><strong>Failed activation:</strong> Payment succeeded but your paid plan was not activated within 72 hours despite your contacting support.</li>
      </ul>
    </section>

    <section>
      <h2>4. Refund Request Process</h2>
      <ol>
        <li>Email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> within <strong>7 calendar days</strong> of the charge.</li>
        <li>Include your registered email, transaction ID, payment date, and reason for the request.</li>
        <li>We will review and respond within 5–7 business days.</li>
        <li>Approved refunds are processed to the original payment method within 7–14 business days, depending on your bank or payment provider.</li>
      </ol>
    </section>

    <section>
      <h2>5. GST and Invoices</h2>
      <p>
        Where a refund is approved, corresponding tax invoices will be adjusted or credit notes issued as
        required under Indian GST regulations.
      </p>
    </section>

    <section>
      <h2>6. Chargebacks</h2>
      <p>
        Please contact us before initiating a chargeback. Unauthorized chargebacks may result in account
        suspension while the dispute is investigated.
      </p>
    </section>

    <section>
      <h2>7. Contact</h2>
      <p>
        {COMPANY.legalName} · {COMPANY.email} · {COMPANY.phone} · {COMPANY.businessHours}
      </p>
    </section>
  </LegalPageLayout>
);

export default RefundPolicy;
