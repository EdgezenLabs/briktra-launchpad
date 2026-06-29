import LegalPageLayout from "@/components/LegalPageLayout";
import { COMPANY, SITE } from "@/lib/site-config";

const ShippingDeliveryPolicy = () => (
  <LegalPageLayout
    title="Shipping & Delivery Policy"
    description="Briktra is a cloud software service — no physical products are shipped."
    path="/shipping-delivery-policy"
  >
    <section>
      <h2>1. Nature of Service</h2>
      <p>
        {SITE.name} is a <strong>cloud-based Software-as-a-Service (SaaS)</strong> subscription platform operated
        by {COMPANY.legalName} (GSTIN: {COMPANY.gstin}). We do not sell, manufacture, or ship any physical
        products.
      </p>
    </section>

    <section>
      <h2>2. Digital Delivery</h2>
      <p>Upon successful account registration and subscription payment (where applicable):</p>
      <ul>
        <li>Access to the {SITE.name} web application is provided immediately at {SITE.url}/app</li>
        <li>Mobile apps are available for download from official app stores (where published)</li>
        <li>Subscription confirmation and tax invoices are delivered digitally to your registered email and within your account</li>
      </ul>
    </section>

    <section>
      <h2>3. No Physical Shipping</h2>
      <p>
        There is no shipping address required for service delivery. No courier, postal, or logistics services
        are involved. Delivery timelines for physical goods do not apply to this service.
      </p>
    </section>

    <section>
      <h2>4. Service Activation</h2>
      <p>
        Paid plans are typically activated within minutes of successful payment. If activation is delayed beyond
        24 hours, contact <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> with your transaction reference.
      </p>
    </section>

    <section>
      <h2>5. Geographic Availability</h2>
      <p>
        {SITE.name} is primarily designed for construction businesses operating in India. Access is provided
        over the internet subject to local connectivity and applicable regulations.
      </p>
    </section>

    <section>
      <h2>6. Contact</h2>
      <p>
        {COMPANY.legalName}<br />
        {COMPANY.address.line1}, {COMPANY.address.line2}, {COMPANY.address.locality}, {COMPANY.address.city},{" "}
        {COMPANY.address.state} {COMPANY.address.pincode}<br />
        {COMPANY.email} · {COMPANY.phone}
      </p>
    </section>
  </LegalPageLayout>
);

export default ShippingDeliveryPolicy;
