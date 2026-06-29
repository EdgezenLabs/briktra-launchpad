import LegalPageLayout from "@/components/LegalPageLayout";
import { COMPANY, SITE } from "@/lib/site-config";

const DataDeletionPolicy = () => (
  <LegalPageLayout
    title="Data Deletion Policy"
    description="How to request deletion of your Briktra account and associated data."
    path="/data-deletion-policy"
  >
    <section>
      <h2>1. Overview</h2>
      <p>
        This policy explains how users of {SITE.name} can request deletion of personal and business data held
        by {COMPANY.legalName}, subject to legal and contractual retention requirements.
      </p>
    </section>

    <section>
      <h2>2. Self-Service Deletion</h2>
      <p>
        Account owners may request account deletion through the app Settings or by emailing{" "}
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> from the registered email address. We will
        verify your identity before processing deletion requests.
      </p>
    </section>

    <section>
      <h2>3. What Is Deleted</h2>
      <p>Upon confirmed deletion, we will remove or anonymize:</p>
      <ul>
        <li>Account profile and login credentials</li>
        <li>Project, labour, attendance, expense, and related business records associated with your organization</li>
        <li>Uploaded documents and media stored in your account workspace</li>
      </ul>
    </section>

    <section>
      <h2>4. Data We May Retain</h2>
      <p>We may retain certain records where required by law or legitimate business needs, including:</p>
      <ul>
        <li>Transaction and tax invoice records for GST and accounting compliance (typically up to 8 years as per Indian tax law)</li>
        <li>Support correspondence related to disputes or legal claims</li>
        <li>Anonymized analytics that cannot identify you</li>
      </ul>
    </section>

    <section>
      <h2>5. Timeline</h2>
      <p>
        Deletion requests are processed within <strong>30 calendar days</strong> of verification. Backup
        systems may take additional time to purge retained copies during normal backup rotation cycles.
      </p>
    </section>

    <section>
      <h2>6. Subscription Cancellation</h2>
      <p>
        Cancelling a subscription does not automatically delete your data. Export required records before
        cancellation or submit an explicit deletion request.
      </p>
    </section>

    <section>
      <h2>7. Contact</h2>
      <p>
        Data deletion requests: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> · {COMPANY.phone}
      </p>
    </section>
  </LegalPageLayout>
);

export default DataDeletionPolicy;
