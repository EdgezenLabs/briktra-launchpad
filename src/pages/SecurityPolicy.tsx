import LegalPageLayout from "@/components/LegalPageLayout";
import { COMPANY, PAYMENT, SITE } from "@/lib/site-config";

const SecurityPolicy = () => (
  <LegalPageLayout
    title="Security Policy"
    description="Security practices for the Briktra construction ERP cloud platform."
    path="/security-policy"
  >
    <section>
      <h2>1. Our Commitment</h2>
      <p>
        {COMPANY.legalName} is committed to protecting the confidentiality, integrity, and availability of data
        processed through {SITE.name}. This policy outlines our security approach for the SaaS platform.
      </p>
    </section>

    <section>
      <h2>2. Data in Transit</h2>
      <p>
        All communication between your browser or mobile app and our servers is encrypted using industry-standard
        TLS (SSL/HTTPS). Our marketing website and application are served over secure connections.
      </p>
    </section>

    <section>
      <h2>3. Authentication and Access</h2>
      <ul>
        <li>Email and phone OTP-based authentication</li>
        <li>Optional biometric login on supported mobile devices</li>
        <li>Role-based access control (admin, supervisor, employee)</li>
        <li>Session management and secure password policies</li>
      </ul>
    </section>

    <section>
      <h2>4. Payment Security</h2>
      <p>
        {PAYMENT.disclaimer} We do not claim PCI DSS certification unless officially certified and documented.
        Payment card and UPI data are handled within {PAYMENT.processor}&apos;s secure environment.
      </p>
    </section>

    <section>
      <h2>5. Infrastructure</h2>
      <p>
        Briktra is hosted on reputable cloud infrastructure with network firewalls, access logging, and regular
        security updates. Production systems are segregated from development environments.
      </p>
    </section>

    <section>
      <h2>6. Data Backup</h2>
      <p>
        We perform regular automated backups to support disaster recovery. Backup retention periods are defined
        internally and reviewed periodically.
      </p>
    </section>

    <section>
      <h2>7. Incident Response</h2>
      <p>
        We maintain procedures to detect, investigate, and respond to security incidents. Affected customers will
        be notified of significant breaches as required by applicable law.
      </p>
    </section>

    <section>
      <h2>8. Your Responsibilities</h2>
      <ul>
        <li>Use strong, unique passwords and protect login credentials</li>
        <li>Assign appropriate roles to team members</li>
        <li>Report suspected security issues promptly to {COMPANY.email}</li>
      </ul>
    </section>

    <section>
      <h2>9. Contact</h2>
      <p>Security inquiries: <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></p>
    </section>
  </LegalPageLayout>
);

export default SecurityPolicy;
