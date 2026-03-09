import { Mail, MapPin, Building2 } from "lucide-react";

const ContactUs = () => {
  return (
    <section id="contact" className="relative bg-muted/50 py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Contact Us
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            We're Here to Help
          </h2>
          <p className="mb-12 text-lg text-muted-foreground">
            Have questions or need assistance? Reach out to our team directly.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Sunil Email */}
            <a
              href="mailto:sunil.jas@edgezenlabs.com"
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md justify-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Mail className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-lg">Sunil Jas</p>
                <p className="text-sm text-muted-foreground transition-colors group-hover:text-primary mt-1">sunil.jas@edgezenlabs.com</p>
              </div>
            </a>

            {/* Sujith Email */}
            <a
              href="mailto:sujith@edgezenlabs.com"
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md justify-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Mail className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-lg">Sujith Padmini</p>
                <p className="text-sm text-muted-foreground transition-colors group-hover:text-primary mt-1">sujith@edgezenlabs.com</p>
              </div>
            </a>

            {/* Headquarters & Support */}
            <div className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Building2 className="h-6 w-6" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-lg">Edgezen Labs</p>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Madurai, Tamilnadu, India
                </p>
                <a href="mailto:support@briktra.com" className="text-sm font-medium text-primary hover:underline">
                  support@briktra.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
