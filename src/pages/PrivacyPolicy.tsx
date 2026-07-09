import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { 
  Shield, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  Fingerprint, 
  MapPin, 
  Users, 
  Camera, 
  Mic, 
  HardDrive, 
  Trash2, 
  ChevronRight,
  Globe,
  Building,
  CreditCard
} from "lucide-react";
import { useState, useEffect } from "react";
const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("");
  const sections = [
    { id: "info-we-collect", title: "1. Information We Collect" },
    { id: "how-we-use", title: "2. How We Use Your Information" },
    { id: "data-sharing", title: "3. Data Sharing" },
    { id: "data-security", title: "4. Data Security" },
    { id: "data-retention", title: "5. Data Retention" },
    { id: "user-rights", title: "6. Your Rights & Account Deletion" },
    { id: "children-privacy", title: "7. Children's Privacy" },
    { id: "changes-to-policy", title: "8. Changes to This Policy" },
    { id: "contact-us", title: "9. Contact Us" }
  ];
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };
  const personalInfo = [
    {
      label: "Name",
      description: "Used for your profile and identifying you within your organisation.",
      icon: User,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20"
    },
    {
      label: "Email Address",
      description: "Used for account authentication and notifications.",
      icon: Mail,
      color: "text-green-500 bg-green-500/10 border-green-500/20"
    },
    {
      label: "Phone Number",
      description: "Used for OTP login and team communications.",
      icon: Phone,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20"
    },
    {
      label: "User IDs",
      description: "Internal identifiers used to manage your account.",
      icon: Fingerprint,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
    }
  ];
  const permissions = [
    {
      name: "Location (GPS, Precise & Approximate)",
      access: "Your GPS coordinates",
      when: "Only when you manually tap \"Mark Attendance\" to verify you are on-site. Never in the background.",
      icon: MapPin,
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20"
    },
    {
      name: "Contacts",
      access: "Your device phonebook (read-only)",
      when: "Only when you tap \"Import from Contacts\" to add an employee or supplier. We never store your contact list.",
      icon: Users,
      color: "text-sky-500 bg-sky-500/10 border-sky-500/20"
    },
    {
      name: "Camera",
      access: "Photos taken via the camera",
      when: "Only when you tap a camera button to upload a receipt, site photo, or profile picture.",
      icon: Camera,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      name: "Microphone / Audio",
      access: "Recorded audio clips",
      when: "Only when you tap the record button in Daily Site Notes.",
      icon: Mic,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20"
    },
    {
      name: "Storage / Files",
      access: "Images, PDFs, documents",
      when: "Only when you choose to upload a bill, report, or attachment from your device.",
      icon: HardDrive,
      color: "text-violet-500 bg-violet-500/10 border-violet-500/20"
    }
  ];
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Privacy Policy | Briktra"
        description="Privacy Policy for Briktra mobile application. Learn about how Edgezen Labs collects, uses, protects, and handles your personal data."
        canonical="https://briktra.com/privacy-policy"
      />
      <Header />
      <main className="pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 md:px-6 mb-12">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-4 animate-fade-in">
              <Shield className="h-3.5 w-3.5" />
              Privacy & Trust
            </div>
            <h1 className="mb-4 font-display text-4xl md:text-5xl font-bold text-foreground">
              Privacy Policy for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Briktra</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
              Last Updated: July 6, 2026 &bull; Published by Edgezen Labs
            </p>
          </div>
        </section>
        {/* Intro Banner */}
        <section className="container mx-auto px-4 md:px-6 mb-12 max-w-6xl">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <p className="text-foreground leading-relaxed text-base md:text-lg">
              <strong>Edgezen Labs</strong> ("we," "our," or "us") operates the <strong>Briktra</strong> mobile application ("Service"). This Privacy Policy describes how we collect, use, protect, and handle your personal data when you use the Briktra app.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              By using Briktra, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>
        </section>
        {/* Main Content Layout */}
        <section className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Sidebar Navigation */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-3 mb-3">Contents</p>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between group ${
                      activeSection === section.id
                        ? "bg-primary/10 text-primary border-l-2 border-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span className="truncate">{section.title.split(". ")[1]}</span>
                    <ChevronRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                      activeSection === section.id ? "opacity-100 text-primary" : "text-muted-foreground"
                    }`} />
                  </button>
                ))}
              </div>
            </div>
            {/* Content Column */}
            <div className="lg:col-span-3 space-y-12">
              
              {/* 1. Information We Collect */}
              <section id="info-we-collect" className="scroll-mt-24 space-y-6">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">1. Information We Collect</h2>
                </div>
                {/* 1.1 Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    1.1 Personal Information
                  </h3>
                  <p className="text-muted-foreground">
                    When you register and use Briktra, we may collect the following information:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personalInfo.map((info, idx) => {
                      const IconComp = info.icon;
                      return (
                        <div key={idx} className="p-4 rounded-xl border border-border bg-card flex gap-3.5 hover:shadow-sm transition-all">
                          <div className={`p-2.5 rounded-lg shrink-0 ${info.color.split(" ")[1]} ${info.color.split(" ")[0]} flex items-center justify-center h-10 w-10`}>
                            <IconComp className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground text-sm">{info.label}</h4>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{info.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* 1.2 Device Permissions & Sensitive Data */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    1.2 Device Permissions & Sensitive Data
                  </h3>
                  <p className="text-muted-foreground">
                    To deliver specific features, Briktra requests permissions to access sensitive device resources. We access this data strictly on-demand.
                  </p>
                  <div className="space-y-4">
                    {permissions.map((perm, idx) => {
                      const IconComp = perm.icon;
                      return (
                        <div key={idx} className="p-5 rounded-xl border border-border bg-card flex flex-col md:flex-row md:items-center gap-4 hover:border-border/80 transition-colors">
                          <div className="flex items-center gap-3.5 md:w-1/3 shrink-0">
                            <div className={`p-2.5 rounded-lg shrink-0 ${perm.color.split(" ")[1]} ${perm.color.split(" ")[0]} flex items-center justify-center h-10 w-10`}>
                              <IconComp className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-foreground text-sm">{perm.name}</h4>
                          </div>
                          <div className="flex-1 space-y-1.5 border-t md:border-t-0 pt-3 md:pt-0 border-border/50">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">What We Access</span>
                              <span className="text-xs font-semibold text-foreground">{perm.access}</span>
                            </div>
                            <div className="flex flex-wrap items-start gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary shrink-0">When</span>
                              <p className="text-xs text-muted-foreground leading-relaxed">{perm.when}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* 1.3 Financial & Payment Data */}
                <div className="space-y-3 pt-4">
                  <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    1.3 Financial & Payment Data
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Briktra offers digital subscription plans and transactional features. When you perform transactions within the app:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                    <li>Payments are processed securely via our integrated third-party payment gateway partner, <strong>Cashfree Payments</strong>, which opens its own native payment UI sheet.</li>
                    <li>We do <strong>not</strong> collect, store, or transmit your raw financial details (such as credit card numbers, CVVs, UPI PINs, or net banking credentials) on our servers. All sensitive financial data is entered directly into Cashfree's secure payment interface.</li>
                    <li>We only collect and store transactional metadata (e.g., transaction/order ID, payment status, amount, subscription package type, and timestamp) to activate your subscription and provide customer billing support.</li>
                  </ul>
                </div>

                {/* 1.4 Usage & Diagnostic Data */}
                <div className="space-y-3 pt-4">
                  <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    1.4 Usage & Diagnostic Data
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We collect anonymised crash logs and performance metrics (via Firebase/analytics tools) to improve app stability. This data does not personally identify you.
                  </p>
                </div>
              </section>
              {/* 2. How We Use Your Information */}
              <section id="how-we-use" className="scroll-mt-24 space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">2. How We Use Your Information</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  We use the information collected to:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {[
                    "Provide, operate, and maintain the Briktra Service.",
                    "Verify attendance for construction project management.",
                    "Send account-related notifications and alerts.",
                    "Improve, personalise, and expand the Service.",
                    "Respond to user support requests.",
                    "Monitor and analyse usage and technical issues."
                  ].map((use, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-foreground">{use}</span>
                    </div>
                  ))}
                </div>
              </section>
              {/* 3. Data Sharing */}
              <section id="data-sharing" className="scroll-mt-24 space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">3. Data Sharing</h2>
                </div>
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-semibold text-sm inline-flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 shrink-0" />
                  We do not sell your personal data.
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We may share data with:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                  <li><strong>Service providers & Partners</strong> (including cloud hosting platforms and payment processor partners like <strong>Cashfree Payments</strong>) strictly to deliver the Service, handle subscription billing, and process payment transactions.</li>
                  <li><strong>Legal authorities</strong> if required by law or to protect the rights and safety of our users.</li>
                </ul>
              </section>
              {/* 4. Data Security */}
              <section id="data-security" className="scroll-mt-24 space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">4. Data Security</h2>
                </div>
                <div className="flex gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0 h-12 w-12 flex items-center justify-center">
                    <Lock className="h-6 w-6" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-foreground mb-1 text-base">HTTPS/TLS Encryption</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        All data transmitted between the Briktra app and our servers is protected using <strong>industry-standard HTTPS/TLS encryption</strong>. We apply appropriate technical and organisational measures to prevent unauthorised access, disclosure, or alteration of your data.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1 text-base">Payment Security (Cashfree Payments)</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Furthermore, all payment transactions processed via <strong>Cashfree Payments</strong> are secured under PCI-DSS compliance standards, protecting your billing details using industry-grade secure socket layers and tokenization protocols.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              {/* 5. Data Retention */}
              <section id="data-retention" className="scroll-mt-24 space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">5. Data Retention</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal data for as long as your account is active, or as needed to provide the Service. Upon account deletion, all personal data is permanently purged within <strong>30 days</strong>.
                </p>
              </section>
              {/* 6. Your Rights & Account Deletion */}
              <section id="user-rights" className="scroll-mt-24 space-y-6">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">6. Your Rights & Account Deletion</h2>
                </div>
                <p className="text-muted-foreground">
                  You have the right to:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-card text-center">
                    <h4 className="font-bold text-foreground mb-1.5 text-sm">Access</h4>
                    <p className="text-xs text-muted-foreground">The personal data we hold about you.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card text-center">
                    <h4 className="font-bold text-foreground mb-1.5 text-sm">Correct</h4>
                    <p className="text-xs text-muted-foreground">Inaccurate data via the Profile screen in-app.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card text-center">
                    <h4 className="font-bold text-foreground mb-1.5 text-sm">Delete</h4>
                    <p className="text-xs text-muted-foreground">Your account and all associated personal data.</p>
                  </div>
                </div>
                <div className="mt-6 p-6 rounded-2xl bg-destructive/5 border border-destructive/15 text-card-foreground shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                    <Trash2 className="h-4.5 w-4.5 shrink-0" />
                    How to Delete Your Account
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                    {[
                      { step: "1", title: "Open App", desc: "Launch Briktra on your device." },
                      { step: "2", title: "Go to Profile", desc: "Access bottom navigation or side drawer." },
                      { step: "3", title: "Tap Delete", desc: "Scroll to bottom and select \"Delete Account\"." },
                      { step: "4", title: "Confirm", desc: "Follow confirmation steps to finalize." }
                    ].map((step, idx) => (
                      <div key={idx} className="relative p-3 rounded-lg bg-card border border-border/50">
                        <div className="absolute top-2 right-2 text-[10px] font-black text-muted/30">STEP {step.step}</div>
                        <div className="font-bold text-xs text-foreground mt-2">{step.title}</div>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-normal">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-border/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted-foreground">
                    <p>
                      Alternatively, you may send a deletion request to: <a href="mailto:support@edgezenlabs.com" className="font-bold text-foreground hover:text-primary transition-colors underline">support@edgezenlabs.com</a>
                    </p>
                    <div className="px-2.5 py-1 rounded bg-destructive/10 text-destructive font-semibold shrink-0 text-center">
                      Permanent purge within 30 days
                    </div>
                  </div>
                </div>
              </section>
              {/* 7. Children's Privacy */}
              <section id="children-privacy" className="scroll-mt-24 space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">7. Children's Privacy</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Briktra is designed exclusively for <strong>business users aged 18 and older</strong>. We do not knowingly collect personal data from anyone under the age of 18. If you believe a minor has provided us with personal information, please contact us immediately.
                </p>
              </section>
              {/* 8. Changes to This Policy */}
              <section id="changes-to-policy" className="scroll-mt-24 space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">8. Changes to This Policy</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. You will be notified of any significant changes via the app or by email. Continued use of the Service after changes constitutes acceptance of the updated policy.
                </p>
              </section>
              {/* 9. Contact Us */}
              <section id="contact-us" className="scroll-mt-24 space-y-6">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">9. Contact Us</h2>
                </div>
                <p className="text-muted-foreground">
                  For questions, requests, or concerns about this Privacy Policy:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl border border-border bg-card flex flex-col items-center text-center hover:border-primary/20 transition-colors">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl mb-3.5">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email</span>
                    <a href="mailto:support@edgezenlabs.com" className="text-sm font-semibold text-foreground hover:text-primary transition-colors mt-1 hover:underline">
                      support@edgezenlabs.com
                    </a>
                  </div>
                  <div className="p-5 rounded-2xl border border-border bg-card flex flex-col items-center text-center hover:border-primary/20 transition-colors">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl mb-3.5">
                      <Building className="h-5 w-5" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Company</span>
                    <span className="text-sm font-semibold text-foreground mt-1">
                      Edgezen Labs
                    </span>
                  </div>
                  <div className="p-5 rounded-2xl border border-border bg-card flex flex-col items-center text-center hover:border-primary/20 transition-colors">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl mb-3.5">
                      <Globe className="h-5 w-5" />
                    </div>
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Website</span>
                    <a href="https://www.edgezenlabs.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-foreground hover:text-primary transition-colors mt-1 hover:underline">
                      edgezenlabs.com
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
export default PrivacyPolicy;