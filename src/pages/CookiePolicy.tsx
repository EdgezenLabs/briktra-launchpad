import LegalPageLayout from "@/components/LegalPageLayout";
import { COMPANY, SITE } from "@/lib/site-config";

const CookiePolicy = () => (
  <LegalPageLayout
    title="Cookie Policy"
    description="How Briktra uses cookies and similar technologies on its website and application."
    path="/cookie-policy"
  >
    <section>
      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They help websites
        function, remember preferences, and understand usage patterns.
      </p>
    </section>

    <section>
      <h2>2. How We Use Cookies</h2>
      <p>{COMPANY.legalName} uses cookies and similar technologies on {SITE.url} and the {SITE.name} application for:</p>
      <ul>
        <li><strong>Essential cookies:</strong> Required for login sessions, security, and core functionality.</li>
        <li><strong>Analytics cookies:</strong> To understand how visitors use our marketing website (e.g., Google Analytics).</li>
        <li><strong>Preference cookies:</strong> To remember language and display settings where applicable.</li>
      </ul>
    </section>

    <section>
      <h2>3. Third-Party Cookies</h2>
      <p>
        Third-party services such as analytics providers and payment processors may set their own cookies when
        you interact with their features. Their use is governed by their respective privacy policies.
      </p>
    </section>

    <section>
      <h2>4. Managing Cookies</h2>
      <p>
        You can control cookies through your browser settings. Blocking essential cookies may affect login and
        subscription functionality. To opt out of Google Analytics, visit{" "}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
          Google Analytics Opt-out
        </a>.
      </p>
    </section>

    <section>
      <h2>5. Updates</h2>
      <p>We may update this Cookie Policy periodically. Continued use of our website after changes constitutes acceptance.</p>
    </section>

    <section>
      <h2>6. Contact</h2>
      <p><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></p>
    </section>
  </LegalPageLayout>
);

export default CookiePolicy;
