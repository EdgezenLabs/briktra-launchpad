import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import SkipLink from "@/components/SkipLink";
import { 
  Trash2, 
  Settings, 
  User, 
  Mail, 
  Clock, 
  AlertTriangle, 
  FileText, 
  CheckCircle,
  ShieldAlert
} from "lucide-react";
import { COMPANY, SITE } from "@/lib/site-config";

const DeleteAccount = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Delete Account | Briktra"
        description="Learn how to delete your Briktra account, what data will be deleted, and what records are retained for compliance."
        canonical={`${SITE.url}/delete-account`}
      />
      <SkipLink />
      <Header />
      
      <main id="main-content" className="pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 md:px-6 mb-12">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive mb-4 animate-fade-in">
              <Trash2 className="h-3.5 w-3.5" />
              Account Management
            </div>
            <h1 className="mb-4 font-display text-4xl md:text-5xl font-bold text-foreground">
              Delete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-destructive to-orange-500">Briktra Account</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
              We understand you may want to delete your account. Here is a transparent guide on how to initiate the deletion process, what data is permanently removed, and what we are legally required to retain.
            </p>
          </div>
        </section>

        {/* Content Layout */}
        <section className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="grid grid-cols-1 gap-8">
            
            {/* Step-by-Step Instructions */}
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Settings className="h-5.5 w-5.5 text-primary" />
                How to Delete Your Account
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Method 1: App */}
                <div className="space-y-4 p-5 rounded-xl border border-border bg-muted/30">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                    Method 1: Inside the Mobile App
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You can quickly delete your account directly through the settings inside the Briktra mobile app.
                    What you see depends on your role:
                  </p>
                  <ol className="space-y-2 text-xs text-foreground list-decimal pl-4">
                    <li>Open the <strong>Briktra</strong> app on your device.</li>
                    <li>Navigate to your <strong>Profile</strong> (via the bottom navigation or side drawer).</li>
                    <li>
                      Scroll to the bottom and tap <strong className="text-destructive">"Delete Organization"</strong> (organization owners
                      only — this deletes the whole company workspace) or <strong className="text-destructive">"Delete My Account"</strong> (every
                      other team member — this deletes only your own account, not the organization's data).
                    </li>
                    <li>Confirm your deletion request on the confirmation dialog.</li>
                  </ol>
                </div>

                {/* Method 2: Web Support */}
                <div className="space-y-4 p-5 rounded-xl border border-border bg-muted/30">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    Method 2: If you cannot access the App
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If you have already uninstalled the application or can no longer log in, you can request manual deletion:
                  </p>
                  <ul className="space-y-2 text-xs text-foreground list-disc pl-4">
                    <li>
                      Send an email to: <a href="mailto:support@edgezenlabs.com" className="font-bold text-foreground hover:text-primary transition-colors underline">support@edgezenlabs.com</a>
                    </li>
                    <li>Please send the request from the <strong>registered email address</strong> associated with your Briktra account.</li>
                    <li>Include your registered <strong>phone number</strong> and <strong>business name</strong> to help us verify your identity.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Data Handling breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deleted Data */}
              <div className="rounded-2xl border border-emerald-500/20 bg-card p-6 md:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5.5 w-5.5 text-emerald-500" />
                    What Data Will Be Deleted
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    What's removed depends on which action you take:
                  </p>
                  <ul className="space-y-3 text-xs text-muted-foreground list-none">
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <span><strong>"Delete Organization" (owners only):</strong> Every project, employee record, labour list, attendance log, site expense, purchase order, invoice, and uploaded file (receipts, site photos, PDF bills, voice notes) in the workspace — deleted immediately and permanently, along with every team member's account. Your email/phone/organization name can never be used to register on Briktra again.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <span><strong>"Delete My Account" (team members):</strong> Deactivates your own login and signs you out everywhere. It does not delete the organization's data — your historical entries (attendance, expenses, etc.) are retained as part of your employer's business records, with your account access removed.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-border text-[11px] text-muted-foreground/80 font-medium">
                  Organization deletion cannot be undone. Contact your administrator to fully remove an individual account's retained records.
                </div>
              </div>

              {/* Retained Data */}
              <div className="rounded-2xl border border-amber-500/20 bg-card p-6 md:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <ShieldAlert className="h-5.5 w-5.5 text-amber-500" />
                    What Data We May Retain
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Certain information is legally required to be archived or retained under tax and corporate laws:
                  </p>
                  <ul className="space-y-3 text-xs text-muted-foreground list-none">
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span><strong>Billing & Invoices:</strong> Subscription payment invoices, GST transaction details, and order IDs are archived for tax and audit compliance (retained as required by local tax law, typically up to 8 years in India).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span><strong>Disputes & Legal Records:</strong> Customer support tickets and communications related to active disputes, refunds, or legal queries.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span><strong>Aggregated Diagnostics:</strong> Fully anonymised telemetry logs with personal identifiers completely removed to help maintain system health.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-border text-[11px] text-muted-foreground/80 font-medium">
                  We process and retain data strictly to fulfill regulatory and legal compliance obligations.
                </div>
              </div>
            </div>

            {/* Timeframe & Support */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Timeline Card */}
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm flex gap-4">
                <div className="p-3.5 bg-primary/10 text-primary rounded-xl shrink-0 h-12 w-12 flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1 text-base">Deletion Timeline</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Organization deletion happens <strong>immediately</strong> — there is no waiting period. Data in system backup archives is overwritten on our normal backup rotation cycle. If you request deletion by email instead of through the app, allow time for us to verify your identity first.
                  </p>
                </div>
              </div>

              {/* Support Card */}
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm flex gap-4">
                <div className="p-3.5 bg-destructive/10 text-destructive rounded-xl shrink-0 h-12 w-12 flex items-center justify-center">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1 text-base">Support & Help</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    If you run into issues deleting your account via the app, send an email request to our support team at <a href="mailto:support@edgezenlabs.com" className="font-bold text-foreground hover:text-primary transition-colors underline">support@edgezenlabs.com</a>. We will guide you through and confirm the deletion.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer Alert */}
            <div className="rounded-xl border border-destructive/15 bg-destructive/5 p-4 flex gap-3 text-card-foreground">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <h4 className="font-bold text-xs text-destructive">Warning: Permanent Deletion</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
                  Deleting your account is permanent. This will delete all organization data, member seats, labour details, attendance logs, and project reports. All remaining active subscription value is forfeited.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DeleteAccount;
