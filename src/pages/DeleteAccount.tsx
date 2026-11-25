import PageShell from "@/components/PageShell";
import { PageHero } from "@/components/site/PageHero";
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
import { COMPANY } from "@/lib/site-config";

const DeleteAccount = () => {
  return (
    <PageShell
      title="Delete Your Account"
      description="How to delete your Briktra account from the app or by email, what data is permanently removed, and which records must be kept for compliance."
      path="/delete-account"
      product={false}
      crumbs={[{ name: "Delete Account", path: "/delete-account" }]}
    >
      <PageHero
        eyebrow="Account Management"
        title="Delete your"
        highlight="Briktra account."
        intro="How to start the deletion, what data is permanently removed, and what we are legally required to keep."
        actions="none"
      />
      <div className="pb-16 pt-12 md:pb-24">
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
                    Account deletion is available to the <strong>organization owner</strong> (the account that
                    originally registered the organization) directly through the settings inside the Briktra mobile app:
                  </p>
                  <ol className="space-y-2 text-xs text-foreground list-decimal pl-4">
                    <li>Open the <strong>Briktra</strong> app on your device.</li>
                    <li>Navigate to your <strong>Profile</strong> (via the bottom navigation or side drawer).</li>
                    <li>Scroll to the bottom of the page and tap <strong className="text-destructive">"Delete Organization"</strong>.</li>
                    <li>Confirm your deletion request on the confirmation dialog.</li>
                  </ol>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Team members are added by the organization owner and don't self-register through the app, so
                    account removal for a team member is requested from your organization's owner/administrator
                    rather than self-service in-app.
                  </p>
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
                      Send an email to: <a href="mailto:contact@edgezenlabs.com" className="font-bold text-foreground hover:text-primary transition-colors underline">contact@edgezenlabs.com</a>
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
                    Upon confirmation by the organization owner, deletion is immediate and permanent:
                  </p>
                  <ul className="space-y-3 text-xs text-muted-foreground list-none">
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <span><strong>Every workspace record:</strong> Projects, employee accounts, labour lists, attendance logs, site expense logs, purchase orders, invoices, and uploaded files (receipts, site photos, PDF bills, voice notes).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <span><strong>Organization identity:</strong> The organization's name and the owner's email/phone number can never be used to register on Briktra again.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-border text-[11px] text-muted-foreground/80 font-medium">
                  Once deleted, the organization cannot be restored.
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
                    If you run into issues deleting your account via the app, send an email request to our support team at <a href="mailto:contact@edgezenlabs.com" className="font-bold text-foreground hover:text-primary transition-colors underline">contact@edgezenlabs.com</a>. We will guide you through and confirm the deletion.
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
      </div>
    </PageShell>
  );
};

export default DeleteAccount;
