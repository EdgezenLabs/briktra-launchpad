import { Mail } from "lucide-react";

const ContactUs = () => {
  return (
    <section id="contact" className="relative bg-black/5 py-16 dark:bg-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            Contact Us
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Have questions or need assistance? Reach out to our team directly.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            {/* Sunil Email */}
            <a
              href="mailto:sunil.jas@edgezenlabs.com"
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md sm:w-1/2"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Mail className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Sunil Jas</p>
                <p className="text-sm text-muted-foreground transition-colors group-hover:text-primary">sunil.jas@edgezenlabs.com</p>
              </div>
            </a>

            {/* Sujith Email */}
            <a
              href="mailto:sujith@edgezenlabs.com"
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md sm:w-1/2"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Mail className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Sujith Padmini</p>
                <p className="text-sm text-muted-foreground transition-colors group-hover:text-primary">sujith@edgezenlabs.com</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
