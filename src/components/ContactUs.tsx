import { Link } from "react-router-dom";
import { Building2, Clock, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY, formatAddressMultiline } from "@/lib/site-config";

const ContactUs = () => (
  <section id="contact" className="relative bg-muted/50 py-24" aria-labelledby="contact-heading">
    <div className="container mx-auto px-4 md:px-6">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-primary/10 px-6 py-2.5 text-lg font-bold uppercase tracking-wider text-primary">
          <MessageSquare className="h-5 w-5" aria-hidden="true" />
          Contact
        </span>
        <h2 id="contact-heading" className="mb-6 font-display text-4xl font-bold text-foreground md:text-5xl">
          We&apos;re Here to Help
        </h2>
        <p className="text-lg text-muted-foreground">
          Billing, subscriptions, or product support — reach {COMPANY.legalName} during business hours.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        <div className="premium-card space-y-4 p-6">
          <div className="flex gap-3">
            <Building2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="font-semibold">{COMPANY.legalName}</p>
              <p className="text-sm text-muted-foreground">GSTIN: {COMPANY.gstin}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="whitespace-pre-line text-sm text-muted-foreground">{formatAddressMultiline()}</p>
          </div>
          <div className="flex gap-3">
            <Mail className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <a href={`mailto:${COMPANY.email}`} className="text-sm text-primary hover:underline">{COMPANY.email}</a>
          </div>
          <div className="flex gap-3">
            <Phone className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <a href={`tel:${COMPANY.phoneTel}`} className="text-sm text-primary hover:underline">{COMPANY.phone}</a>
          </div>
          <div className="flex gap-3">
            <Clock className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">{COMPANY.businessHours}</p>
          </div>
        </div>

        <div className="premium-card flex flex-col items-center justify-center p-8 text-center">
          <p className="mb-6 text-muted-foreground">
            Use our contact form for detailed inquiries, demo requests, or billing support.
          </p>
          <Button asChild>
            <Link to="/contact">Go to Contact Page</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default ContactUs;
