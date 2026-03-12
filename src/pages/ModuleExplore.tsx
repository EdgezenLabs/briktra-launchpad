import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  Layers, 
  Users, 
  Package, 
  ChevronRight,
  Zap,
  Building2,
  HardHat,
  Wallet,
  MapPin,
  Camera,
  ClipboardList,
  Newspaper,
  FileBadge,
  UserCheck,
  Briefcase,
  PieChart,
  Globe,
  FileText,
  CalendarDays,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

const LanguagesIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>
);

// All 12 modules exactly from Features.tsx
const modules = [
  {
    id: "labour",
    title: "Labour Management",
    category: "Workforce",
    icon: Users,
    description: "Manage workers assigned to projects with detailed profiles and histories.",
    features: [
      { name: "Worker Profiles", detail: "Detailed history of skills, projects, and performance.", icon: UserCheck },
      { name: "Assignment", detail: "Easily allot workforce to specific project sites.", icon: ClipboardList }
    ]
  },
  {
    id: "contracts",
    title: "Contracts Management",
    category: "Operations",
    icon: FileBadge,
    description: "Create, manage, and track all contractor agreements and terms.",
    features: [
      { name: "Agreement Tracking", detail: "Digital repository for all vendor and labour contracts.", icon: FileText },
      { name: "Term Management", detail: "Monitor compliance with agreed construction milestones.", icon: CalendarDays }
    ]
  },
  {
    id: "attendance",
    title: "Attendance Tracking",
    category: "Workforce",
    icon: UserCheck,
    description: "Record and monitor daily employee and labour attendance seamlessly.",
    features: [
      { name: "Daily Logs", detail: "Seamless marking of attendance for ground-level teams.", icon: MapPin },
      { name: "Real-time Sync", detail: "Instant visibility for the head office on site presence.", icon: Zap }
    ]
  },
  {
    id: "expenses",
    title: "Expenses & Bills",
    category: "Financials",
    icon: Wallet,
    description: "Track all project expenses and process bills accurately in one place.",
    features: [
      { name: "Digital Bills", detail: "Capture and categorize site receipts instantly.", icon: Camera },
      { name: "Category Audit", detail: "Detailed breakdown of where funds are being utilized.", icon: PieChart }
    ]
  },
  {
    id: "salary",
    title: "Salary & Payroll",
    category: "Financials",
    icon: Briefcase,
    description: "Manage complex employee salaries and disburse payments directly.",
    features: [
      { name: "Disbursement", detail: "Automated calculation based on attendance logs.", icon: Wallet },
      { name: "Pay History", detail: "Secure record-keeping of every transaction.", icon: ShieldCheck }
    ]
  },
  {
    id: "advances",
    title: "Advance Tracking",
    category: "Financials",
    icon: CreditCard,
    description: "Record and auto-deduct employee salary advances accurately.",
    features: [
      { name: "Advance Log", detail: "Track loans given to labour or site staff.", icon: FileText },
      { name: "Auto-Deduct", detail: "System-wide sync for deduction during final payroll.", icon: Zap }
    ]
  },
  {
    id: "suppliers",
    title: "Supplier Relations",
    category: "Operations",
    icon: Building2,
    description: "Maintain supplier databases and manage complex material billing.",
    features: [
      { name: "Vendor Database", detail: "Unified list of all material partners and rates.", icon: Globe },
      { name: "Billing Hub", detail: "Streamlined reconciliation of delivery notes and invoices.", icon: FileText }
    ]
  },
  {
    id: "updates",
    title: "Daily Updates & Notes",
    category: "Operations",
    icon: Newspaper,
    description: "Stay in sync with daily site photos, activity feeds, and progress notes.",
    features: [
      { name: "Site Photography", detail: "Upload visual proof of daily construction progress.", icon: Camera },
      { name: "Activity Log", detail: "Daily diary of materials used and work completed.", icon: ClipboardList }
    ]
  },
  {
    id: "wallet",
    title: "Document Wallet",
    category: "Operations",
    icon: FileText,
    description: "Securely store and share all vital project and company documents.",
    features: [
      { name: "Digital Storage", detail: "No more lost blueprints or trade licenses.", icon: ShieldCheck },
      { name: "One-Tap Share", detail: "Quickly export docs for audits or banking.", icon: Zap }
    ]
  },
  {
    id: "roles",
    title: "Role-Based Logins",
    category: "Governance",
    icon: ShieldCheck,
    description: "Custom app access for Admins, Managers, Supervisors, and Employees.",
    features: [
      { name: "Access Control", detail: "Strict permissions based on organizational hierarchy.", icon: LockIcon },
      { name: "Activity Audit", detail: "Track who performed what action inside the ERP.", icon: ClipboardList }
    ]
  },
  {
    id: "multilingual",
    title: "Multilingual Interface",
    category: "Governance",
    icon: Globe,
    description: "Switch seamlessly between English, Tamil, and Hindi for ground-level teams.",
    features: [
      { name: "Vernacular UI", detail: "Lowering adoption barriers for site supervisors.", icon: LanguagesIcon },
      { name: "Region Native", detail: "Localized report generation in multiple languages.", icon: FileText }
    ]
  },
  {
    id: "milestones",
    title: "Milestone Tracking",
    category: "Operations",
    icon: CalendarDays,
    description: "Set start and end dates to visualize progress and prevent delays.",
    features: [
      { name: "Project Health", detail: "Visual indicators for on-track vs delayed tasks.", icon: TrendingUpIcon },
      { name: "Phase Control", detail: "Granular control over specific building stages.", icon: Layers }
    ]
  }
];


const ModuleExplore = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = modules[activeIdx];

  const categories = ["Workforce", "Operations", "Financials", "Governance"];

  const cycleModule = () => {
    setActiveIdx((prev) => (prev + 1) % modules.length);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header />
      
      <main className="pt-24 pb-32">
        <div className="container mx-auto px-4 lg:px-6">
          
          <div className="mb-12">
             <Link to="/" className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-primary/20 transition-all">
              <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium">Exit Product Suite</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Navigation Panel */}
            <div className="lg:col-span-4 space-y-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  Briktra <span className="text-primary italic">Product Suite</span>
                </h1>
                <p className="text-muted-foreground">
                  A professional deep-dive into the 12 core modules that power your construction business.
                </p>
              </div>

              <div className="space-y-8">
                {categories.map(cat => (
                  <div key={cat} className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 px-2">{cat}</p>
                    <div className="space-y-1">
                      {modules.filter(m => m.category === cat).map(m => {
                        const Icon = m.icon;
                        const isActive = current.id === m.id;
                        return (
                          <button
                            key={m.id}
                            onClick={() => setActiveIdx(modules.findIndex(mod => mod.id === m.id))}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                              isActive 
                              ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                              : "hover:bg-secondary/50 text-muted-foreground"
                            }`}
                          >
                            <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground/50"}`} />
                            <span className="text-sm font-semibold">{m.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Preview Panel */}
            <div className="lg:col-span-8 bg-secondary/20 rounded-[2.5rem] border border-border/50 p-8 md:p-12 min-h-[700px] flex items-center justify-center">
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center w-full">
                
                {/* Visual Emulator */}
                <div className="flex justify-center flex-col items-center gap-6">
                   <div 
                    className="relative w-[280px] md:w-[320px] rounded-[3.5rem] bg-zinc-900 p-2.5 shadow-2xl ring-1 ring-white/10 cursor-pointer overflow-hidden group"
                    onClick={cycleModule}
                   >
                     {/* Dynamic Icon Decoration Layer */}
                     <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center opacity-[0.03] pointer-events-none">
                        <current.icon className="h-[400px] w-[400px] text-white" />
                     </div>

                     <div className="relative h-[580px] w-full bg-zinc-950 rounded-[2.8rem] overflow-hidden border border-white/5 flex flex-col">
                        
                        {/* Fake UI Structure */}
                        <div className="p-6 pt-10 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
                           <div className="h-4 w-24 bg-zinc-800 rounded"></div>
                           <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/20"></div>
                        </div>

                        <div className="flex-1 p-6 space-y-6">
                           <div className="h-12 w-full bg-zinc-800/50 rounded-xl flex items-center px-4">
                              <current.icon className="h-5 w-5 text-primary mr-3" />
                              <div className="h-2 w-32 bg-zinc-700/50 rounded"></div>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-4">
                              <div className="h-32 bg-zinc-900 border border-white/5 rounded-2xl flex flex-col justify-end p-4">
                                 <div className="h-1.5 w-1/2 bg-zinc-800 rounded mb-2"></div>
                                 <div className="h-3 w-full bg-primary/20 rounded"></div>
                              </div>
                              <div className="h-32 bg-zinc-900 border border-white/5 rounded-2xl flex flex-col justify-end p-4">
                                 <div className="h-1.5 w-2/3 bg-zinc-800 rounded mb-2"></div>
                                 <div className="h-3 w-full bg-zinc-800 rounded"></div>
                              </div>
                           </div>

                           <div className="h-40 bg-primary/5 border border-primary/20 rounded-2xl flex flex-col items-center justify-center p-6 border-dashed group-hover:bg-primary/10 transition-colors">
                              <span className="text-xl font-bold text-primary/40 text-center mb-1 uppercase tracking-tighter leading-none italic">{current.title}</span>
                              <span className="text-[9px] font-black text-primary/50 tracking-[0.2em]">TOUCH TO ADVANCE</span>
                           </div>

                           <div className="space-y-2">
                              {Array.from({length: 4}).map((_, i) => (
                                <div key={i} className="h-2 w-full bg-zinc-900/50 rounded"></div>
                              ))}
                           </div>
                        </div>
                     </div>
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">Tap to cycle through all 12 modules</p>
                </div>

                {/* Content Details */}
                <div className="space-y-10">
                   <div>
                     <span className="text-xs font-black uppercase tracking-widest text-primary mb-3 block">{current.category} Module</span>
                     <h2 className="text-4xl font-display font-bold mb-4">{current.title}</h2>
                     <p className="text-lg text-muted-foreground leading-relaxed">
                       {current.description}
                     </p>
                   </div>

                   <div className="space-y-4">
                      {current.features.map((f, i) => {
                        const Ficon = f.icon;
                        return (
                          <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-background border border-border shadow-sm group/item hover:border-primary/20 transition-all">
                             <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary group-hover/item:bg-primary/10 group-hover/item:text-primary transition-all">
                                <Ficon className="h-5 w-5" />
                             </div>
                             <div>
                               <h4 className="font-bold text-sm mb-1">{f.name}</h4>
                               <p className="text-xs text-muted-foreground leading-relaxed">{f.detail}</p>
                             </div>
                          </div>
                        );
                      })}
                   </div>

                   <div className="pt-4 flex flex-col sm:flex-row gap-4">
                      <Button size="lg" className="rounded-xl px-8" asChild>
                        <a href="/app/index.html">Start Free Trial</a>
                      </Button>
                   </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ModuleExplore;
