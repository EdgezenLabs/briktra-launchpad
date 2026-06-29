import LegalPageLayout from "@/components/LegalPageLayout";
import { COMPANY, SITE } from "@/lib/site-config";

const CancellationPolicy = () => (
  <LegalPageLayout
    title="Cancellation Policy"
    description="How to cancel your Briktra subscription and what happens after cancellation."
    path="/cancellation-policy"
  >
    <section>
      <h2>1. Overview</h2>
      <p>
        You may cancel your {SITE.name} subscription at any time. This policy explains how cancellation works
        for monthly and annual plans operated by {COMPANY.legalName}.
      </p>
    </section>

    <section>
      <h2>2. How to Cancel</h2>
      <ul>
        <li><strong>In-app:</strong> Navigate to Settings → Subscription / Billing and select Cancel Subscription.</li>
        <li><strong>By email:</strong> Send a cancellation request from your registered email to{" "}
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> with your account details.</li>
        <li><strong>By phone:</strong> Call <a href={`tel:${COMPANY.phoneTel}`}>{COMPANY.phone}</a> during {COMPANY.businessHours}.</li>
      </ul>
    </section>

    <section>
      <h2>3. Effect of Cancellation</h2>
      <ul>
        <li>Your subscription remains active until the end of the current paid billing period (monthly or annual).</li>
        <li>You will not be charged for subsequent billing cycles after cancellation is confirmed.</li>
        <li>Access to paid features ends when the current period expires.</li>
        <li>Data may be retained for a limited period as described in our Data Deletion Policy; export important records before expiry.</li>
      </ul>
    </section>

    <section>
      <h2>4. Auto-Renewal</h2>
      <p>
        Subscriptions renew automatically at the end of each billing cycle unless cancelled before the renewal
        date. Cancelling stops future auto-debit or renewal charges.
      </p>
    </section>

    <section>
      <h2>5. Downgrades</h2>
      <p>
        You may downgrade to a lower plan instead of cancelling. Downgrades typically take effect at the next
        billing cycle. Feature limits of the new plan apply from the effective date.
      </p>
    </section>

    <section>
      <h2>6. Refunds</h2>
      <p>
        Cancellation does not automatically entitle you to a refund for the current period. See our{" "}
        <a href="/refund-policy">Refund Policy</a> for refund eligibility.
      </p>
    </section>

    <section>
      <h2>7. Contact</h2>
      <p>{COMPANY.legalName} · {COMPANY.email} · {COMPANY.phone}</p>
    </section>
  </LegalPageLayout>
);

export default CancellationPolicy;
