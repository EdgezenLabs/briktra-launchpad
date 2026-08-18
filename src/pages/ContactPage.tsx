import { useState } from "react";
import PageShell from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { COMPANY, formatAddressMultiline, formatAddressSingleLine, SITE } from "@/lib/site-config";
import { Building2, Clock, Mail, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com/prod";
      const res = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      if (res.ok) {
        toast({
          title: "Message Sent Successfully! 🎉",
          description: "Thank you for reaching out. We have received your message and will get back to you shortly.",
        });
        form.reset();
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to send message.");
      }
    } catch (err: unknown) {
      console.warn("API contact form submission issue, launching mailto backup:", err instanceof Error ? err.message : err);
      const mailto = `mailto:${COMPANY.email}?subject=${encodeURIComponent(
        `[Briktra Contact] ${subject}`
      )}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`
      )}`;
      window.location.href = mailto;

      toast({
        title: "Opening Email Client",
        description: "Launching your email application to complete sending your message.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell
      title="Contact"
      description={`Contact Briktra support — ${COMPANY.legalName}, Madurai. Email, phone, and business hours.`}
      canonical={`${SITE.url}/contact`}
    >
      <section className="bg-secondary/30 pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl">
            Contact {SITE.name} Support
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Questions about subscriptions, billing, or the platform? Our team is here to help.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto grid gap-12 px-4 md:grid-cols-2 md:px-6">
          <div className="space-y-8">
            <div className="premium-card p-8">
              <h2 className="mb-6 font-display text-2xl font-bold">Business Information</h2>
              <dl className="space-y-6">
                <div className="flex gap-4">
                  <Building2 className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-foreground">Registered Business Name</dt>
                    <dd className="text-muted-foreground">{COMPANY.legalName}</dd>
                    <dd className="text-sm text-muted-foreground">GSTIN: {COMPANY.gstin}</dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-foreground">Registered Address</dt>
                    <dd className="whitespace-pre-line text-muted-foreground">{formatAddressMultiline()}</dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-foreground">Email</dt>
                    <dd>
                      <a href={`mailto:${COMPANY.email}`} className="text-primary hover:underline">
                        {COMPANY.email}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-foreground">Phone</dt>
                    <dd>
                      <a href={`tel:${COMPANY.phoneTel}`} className="text-primary hover:underline">
                        {COMPANY.phone}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-foreground">Business Hours</dt>
                    <dd className="text-muted-foreground">{COMPANY.businessHours}</dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* WEB-011: was a dashed placeholder div with static text; now a
                real embed geocoded from the actual office address, no API
                key required (Google's legacy no-key query-embed format). */}
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title="Briktra office location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(formatAddressSingleLine())}&output=embed`}
                className="h-48 w-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="premium-card space-y-6 p-8" aria-label="Contact form">
            <h2 className="font-display text-2xl font-bold">Send a Message</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" required autoComplete="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 9876543210" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input id="subject" name="subject" required placeholder="Demo Inquiry / Subscription Question" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea id="message" name="message" rows={5} required placeholder="Tell us how we can help you..." />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Sending Message..." : "Send Message"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              By submitting, you agree to our{" "}
              <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </section>
    </PageShell>
  );
};

export default ContactPage;
