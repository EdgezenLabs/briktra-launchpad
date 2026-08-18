import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, ShieldCheck, Cloud, Heart, Headphones, CreditCard, Sparkles, Building2, HardHat, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAYMENT, SITE } from "@/lib/site-config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type PlanKey = 'starter' | 'pro' | 'premium';

interface PricingPlan {
  key: PlanKey;
  name: string;
  subtitle: string;
  icon: JSX.Element;
  monthlyPrice: string;
  yearlyPrice: string;
  monthlyEquivalent: string;
  yearlySavings: string;
  popular: boolean;
  color: string;
  includes: string[];
  notIncluded?: string[];
  includesHeader?: string;
}

const pricingData: Record<PlanKey, PricingPlan> = {
  starter: {
    key: "starter",
    name: "Starter",
    subtitle: "For small contractors getting started.",
    icon: <HardHat className="w-8 h-8 text-green-500" />,
    monthlyPrice: "₹999",
    yearlyPrice: "₹9,999",
    monthlyEquivalent: "₹999 / month",
    yearlySavings: "Save ₹1,989 with yearly plan",
    popular: false,
    color: "green",
    includes: [
      "2 Projects",
      "Unlimited Employees",
      "Attendance Tracking",
      "Expense & Bill Management",
      "Daily Site Notes & Photo Log",
      "Multi-language (EN/HI/TA)",
      "Digital Document Wallet",
      "Email Support",
    ],
    notIncluded: [
      "Payroll Export & Salary Advance",
      "Inventory Management",
      "GPS Attendance",
      "Sub-projects & Contracts",
      "Advanced Analytics",
      "AI Smart Assign",
    ],
  },
  pro: {
    key: "pro",
    name: "Pro",
    subtitle: "For growing contractors & construction companies.",
    icon: <Building2 className="w-8 h-8 text-orange-500" />,
    monthlyPrice: "₹1,999",
    yearlyPrice: "₹19,999",
    monthlyEquivalent: "₹1,999 / month",
    yearlySavings: "Save ₹3,989 with yearly plan",
    popular: true,
    color: "orange",
    includesHeader: "Everything in Starter, plus:",
    includes: [
      "5 Projects",
      "Sub-projects (Nested Hierarchy)",
      "Contract Creation & Management",
      "Unlimited Employees",
      "Payroll Management",
      "Salary Advance Tracking (Karzaa — advance against wages)",
      "Contractor Management",
      "Inventory & Stock Management",
      "GPS Attendance",
      "AI Smart Assign to Project",
      "Portfolio & Profitability Reports",
      "Export Reports (PDF / Excel)",
      "Broadcast Notifications",
      "Priority Email & Chat Support",
    ],
    notIncluded: [],
  },
  premium: {
    key: "premium",
    name: "Premium",
    subtitle: "For established builders & construction firms.",
    icon: <Crown className="w-8 h-8 text-purple-500" />,
    monthlyPrice: "₹3,999",
    yearlyPrice: "₹39,999",
    monthlyEquivalent: "₹3,999 / month",
    yearlySavings: "Save ₹7,989 with yearly plan",
    popular: false,
    color: "purple",
    includesHeader: "Everything in Pro, plus:",
    includes: [
      "Unlimited Projects",
      "White Label PDF Reports",
      "Purchase Orders",
      "Advanced Financial Analytics",
      "Expense Approval Workflow",
      "Auto Payroll Generation",
      "Low Stock Alerts",
      "Dedicated Account Manager",
      "WhatsApp & Phone Support",
      "Premium Onboarding & Training",
      "API Access",
    ],
    notIncluded: [],
  },
};

interface FeatureItem {
  name: string;
  starter: string | boolean;
  pro: string | boolean;
  premium: string | boolean;
}

interface FeatureCategory {
  category: string;
  items: FeatureItem[];
}

// Full feature breakdown from Excel matrix
const detailedFeatures: FeatureCategory[] = [
  {
    category: "Projects & Worksites",
    items: [
      { name: "Create projects / worksites", starter: "2 Projects", pro: "5 Projects", premium: "Unlimited" },
      { name: "Sub-projects (nested hierarchy)", starter: false, pro: true, premium: true },
      { name: "Project overview & progress tracking", starter: true, pro: true, premium: true },
      { name: "Project setup wizard (onboarding)", starter: true, pro: true, premium: true },
      { name: "Project comparison report (sub-projects)", starter: false, pro: true, premium: true },
      { name: "Project type categorization", starter: true, pro: true, premium: true },
    ]
  },
  {
    category: "Team & Labour Management",
    items: [
      { name: "Add employees / workers", starter: true, pro: true, premium: true },
      { name: "Employee roles (admin / supervisor / employee)", starter: true, pro: true, premium: true },
      { name: "Smart Assign to project (AI matching)", starter: false, pro: true, premium: true },
      { name: "Contractor management", starter: "Partial", pro: true, premium: true },
      { name: "Supervisor assignment per project", starter: true, pro: true, premium: true },
      { name: "Labour cost tracking per worker", starter: true, pro: true, premium: true },
    ]
  },
  {
    category: "Attendance & Time Tracking",
    items: [
      { name: "Mark daily attendance (present / absent / half-day)", starter: true, pro: true, premium: true },
      { name: "GPS-tagged attendance", starter: false, pro: true, premium: true },
      { name: "Bulk attendance import (CSV)", starter: false, pro: true, premium: true },
      { name: "Attendance reports (daily / weekly / monthly)", starter: "Partial", pro: true, premium: true },
      { name: "Overtime / advance tracking", starter: false, pro: true, premium: true },
    ]
  },
  {
    category: "Payroll & Salary Management",
    items: [
      { name: "Payroll calculation (wages × attendance)", starter: "Partial", pro: true, premium: true },
      { name: "Payroll wizard (guided calculation)", starter: false, pro: true, premium: true },
      { name: "Salary advance management (Karzaa — advance against wages)", starter: false, pro: true, premium: true },
      { name: "Payroll PDF export", starter: false, pro: true, premium: true },
      { name: "Auto-generate payroll from attendance", starter: false, pro: "Partial", premium: true },
      { name: "Employee salary reports", starter: false, pro: true, premium: true },
    ]
  },
  {
    category: "Expenses & Bills",
    items: [
      { name: "Add project expenses", starter: true, pro: true, premium: true },
      { name: "Bill management (create / edit / share)", starter: true, pro: true, premium: true },
      { name: "Receipt photo capture / upload", starter: true, pro: true, premium: true },
      { name: "Expense categorization & tags", starter: "Partial", pro: true, premium: true },
      { name: "Financial P&L analytics per project", starter: false, pro: true, premium: true },
      { name: "Expense approval workflow", starter: false, pro: "Partial", premium: true },
    ]
  },
  {
    category: "Supplier & Procurement",
    items: [
      { name: "Supplier directory (add / edit)", starter: "Partial", pro: true, premium: true },
      { name: "Supplier bills linkage", starter: false, pro: true, premium: true },
      { name: "Stock / material inventory tracking", starter: false, pro: true, premium: true },
      { name: "Stock reports & low-stock alerts", starter: false, pro: "Partial", premium: true },
      { name: "Purchase order generation", starter: false, pro: false, premium: true },
    ]
  },
  {
    category: "Contracts & Documents",
    items: [
      { name: "Contract creation & management", starter: false, pro: true, premium: true },
      { name: "Digital document wallet (store files)", starter: true, pro: true, premium: true },
      { name: "White-label PDF reports", starter: false, pro: false, premium: true },
      { name: "Daily site notes / photo log", starter: true, pro: true, premium: true },
    ]
  },
  {
    category: "Reports & Analytics",
    items: [
      { name: "Dashboard KPI overview", starter: true, pro: true, premium: true },
      { name: "Project-level reports (cost, progress)", starter: "Partial", pro: true, premium: true },
      { name: "Cross-project portfolio analytics", starter: false, pro: true, premium: true },
      { name: "Profitability analysis (P&L per project)", starter: false, pro: true, premium: true },
      { name: "Custom report PDF export", starter: false, pro: true, premium: true },
      { name: "Financial analytics (cash flow, budget vs actual)", starter: false, pro: "Partial", premium: true },
    ]
  },
  {
    category: "Notifications & Communication",
    items: [
      { name: "Push notifications (FCM)", starter: true, pro: true, premium: true },
      { name: "Broadcast messages to workers", starter: false, pro: true, premium: true },
      { name: "Renewal / plan expiry reminders", starter: true, pro: true, premium: true },
      { name: "Promotional banners", starter: false, pro: false, premium: true },
    ]
  },
  {
    category: "Authentication & Security",
    items: [
      { name: "Email / phone login (OTP)", starter: true, pro: true, premium: true },
      { name: "Biometric login (Face ID / Fingerprint)", starter: true, pro: true, premium: true },
      { name: "Two-tier password security", starter: true, pro: true, premium: true },
      { name: "Role-based access control (RBAC)", starter: true, pro: true, premium: true },
    ]
  },
  {
    category: "Localization & UX",
    items: [
      { name: "Multi-language support (EN / HI / TA)", starter: true, pro: true, premium: true },
      { name: "Responsive / PWA web app", starter: true, pro: true, premium: true },
      { name: "Dark mode", starter: true, pro: true, premium: true },
    ]
  },
  {
    category: "Onboarding & Support",
    items: [
      { name: "Interactive onboarding tour (6-step)", starter: true, pro: true, premium: true },
      { name: "In-app help / FAQ sheet", starter: true, pro: true, premium: true },
      { name: "Email support", starter: true, pro: true, premium: true },
      { name: "Priority email / chat support", starter: false, pro: true, premium: true },
      { name: "Dedicated account manager", starter: false, pro: false, premium: true },
      { name: "Phone / WhatsApp support", starter: false, pro: false, premium: true },
    ]
  },
  {
    category: "Payments & Subscription Billing",
    items: [
      { name: "Cashfree payment gateway integration", starter: true, pro: true, premium: true },
      { name: "Monthly / Annual billing", starter: true, pro: true, premium: true },
      { name: "Promo code / referral discount", starter: true, pro: true, premium: true },
      { name: "Auto-debit / subscription renewal", starter: false, pro: true, premium: true },
      { name: "Payment history & invoices", starter: true, pro: true, premium: true },
    ]
  }
];



const Features = () => (
  <div className="mt-20 grid grid-cols-1 md:grid-cols-5 gap-6 border-y border-border/50 py-12">
    <div className="flex flex-col items-center text-center px-4">
      <ShieldCheck className="w-8 h-8 mb-4 text-green-500" />
      <h4 className="font-semibold mb-2">Secure & Reliable</h4>
      <p className="text-xs text-muted-foreground">
        Your data is protected with enterprise-grade security.{" "}
        <Link to="/security-policy" className="underline hover:text-foreground">
          See our security practices
        </Link>
        .
      </p>
    </div>
    <div className="flex flex-col items-center text-center px-4 border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0">
      <Cloud className="w-8 h-8 mb-4 text-blue-500" />
      <h4 className="font-semibold mb-2">Work Anywhere</h4>
      <p className="text-xs text-muted-foreground">Mobile & Web - manage your projects on the go.</p>
    </div>
    <div className="flex flex-col items-center text-center px-4 border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0">
      <Heart className="w-8 h-8 mb-4 text-orange-500" />
      <h4 className="font-semibold mb-2">Loved by Contractors</h4>
      <p className="text-xs text-muted-foreground">Built for Indian construction businesses.</p>
    </div>
    <div className="flex flex-col items-center text-center px-4 border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0">
      <Headphones className="w-8 h-8 mb-4 text-purple-500" />
      <h4 className="font-semibold mb-2">We're Here to Help</h4>
      <p className="text-xs text-muted-foreground">Fast support when you need it the most.</p>
    </div>
    <div className="flex flex-col items-center text-center px-4 border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0">
      <CreditCard className="w-8 h-8 mb-4 text-blue-400" />
      <h4 className="font-semibold mb-2">Cancel Anytime</h4>
      <p className="text-xs text-muted-foreground">No long-term lock-in. Upgrade or downgrade anytime.</p>
    </div>
  </div>
);

interface PricingProps {
  standalone?: boolean;
}

const Pricing = ({ standalone = false }: PricingProps) => {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section id="pricing" className={`py-24 ${standalone ? "bg-background" : "bg-[#fafafa]"}`}>
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          {!standalone && (
            <h2 className="mb-6 font-display text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Simple Pricing. Powerful Results.
            </h2>
          )}
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4">
            Choose the plan that fits your team. Upgrade or downgrade at any time. No hidden charges.
          </p>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto mb-10">
            All prices are exclusive of 18% GST. Tax invoices are generated for every subscription payment.
            {PAYMENT.disclaimer}
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <div className="bg-slate-100 p-1.5 rounded-full inline-flex items-center relative">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${!isYearly ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${isYearly ? 'bg-primary text-primary-foreground shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Yearly
              </button>

              {/* Arrow annotation */}
              {isYearly && (
                <div className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 translate-x-full items-center text-green-600 whitespace-nowrap">
                  <svg width="40" height="20" viewBox="0 0 50 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <path d="M48 10C35 15 20 20 2 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10 2C5 5 2 10 2 10C5 12 10 15 10 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span className="font-handwriting text-lg font-bold -rotate-3">Save up to 17-20%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto items-start">
          
          {Object.values(pricingData).map((plan, index) => (
            <div key={index} className={`bg-white rounded-3xl p-8 border ${plan.popular ? 'border-2 border-primary shadow-xl hover:shadow-2xl transform lg:-translate-y-4' : 'border-slate-200 shadow-sm hover:shadow-xl'} transition-all duration-300 relative flex flex-col h-full`}>

              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg z-10">
                  <Sparkles className="w-4 h-4" /> MOST POPULAR
                </div>
              )}

              <div className={`flex items-center gap-4 mb-6 ${plan.popular ? 'mt-2' : ''}`}>
                <div className={`w-16 h-16 rounded-full bg-${plan.color}-50 flex items-center justify-center`}>
                  {plan.icon}
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${plan.popular ? 'text-primary' : `text-${plan.color}-600 text-slate-900`}`}>{plan.name}</h3>
                  <p className="text-sm text-slate-500">{plan.subtitle}</p>
                </div>
              </div>

              <div className="mb-6 text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-slate-500 font-medium">/{isYearly ? 'year' : 'month'}</span>
                </div>
                {isYearly && <p className="text-sm text-slate-400 mt-1 line-through">{plan.monthlyPrice} / month</p>}
              </div>

              <div className={`mb-8 text-center py-1.5 rounded-full text-sm font-medium ${isYearly ? (plan.popular ? 'bg-primary/10 text-primary' : `bg-${plan.color}-50 text-${plan.color}-700`) : 'opacity-0'}`}>
                {plan.yearlySavings}
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  {plan.includesHeader && <p className={`text-sm font-bold mb-4 ${plan.popular ? 'text-primary' : `text-${plan.color}-600`}`}>{plan.includesHeader}</p>}
                  {!plan.includesHeader && <p className="text-sm font-bold text-green-600 mb-4">Includes:</p>}
                  <ul className="space-y-3">
                    {plan.includes.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                        <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-primary' : `text-${plan.color}-500`}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {plan.notIncluded && plan.notIncluded.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-red-500 mb-4">Not included:</p>
                    <ul className="space-y-3">
                      {plan.notIncluded.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                          <X className="w-5 h-5 text-red-400 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* View Full Feature List Dialog */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="text-slate-500 hover:text-slate-900 text-sm font-medium h-auto py-2">
                      View all features for {plan.name} →
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white">
                    <DialogHeader className="px-6 py-6 border-b border-slate-100 bg-slate-50/50">
                      <DialogTitle className="text-2xl flex items-center gap-3">
                        {plan.icon} {plan.name} Plan Details
                      </DialogTitle>
                      <DialogDescription>
                        A comprehensive breakdown of all features included in this tier.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
                      {detailedFeatures.map((category, idx) => (
                        <div key={idx}>
                          <h4 className="font-bold text-sm text-slate-900 bg-slate-100 px-3 py-2 rounded-md mb-4 sticky top-0 z-10">{category.category}</h4>
                          <ul className="space-y-3 px-2">
                            {category.items.map((item, i) => {
                              const val = item[plan.key];
                              return (
                                <li key={i} className="flex items-center justify-between text-sm py-2 border-b border-slate-50 last:border-0">
                                  <span className={`font-medium ${val === false ? 'text-slate-400' : 'text-slate-700'}`}>{item.name}</span>
                                  <span className="flex-shrink-0 text-right ml-4">
                                    {val === true ? (
                                      <Check className="w-5 h-5 text-green-500 inline" />
                                    ) : val === false ? (
                                      <X className="w-4 h-4 text-slate-300 inline" />
                                    ) : (
                                      <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full whitespace-nowrap">{val}</span>
                                    )}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mt-6">
                <Button 
                  className={`w-full py-6 rounded-xl font-semibold text-base transition-colors ${plan.popular ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25' : `border-${plan.color}-500 text-${plan.color}-600 hover:bg-${plan.color}-50 hover:text-${plan.color}-700`}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  asChild
                >
                  <a href={SITE.appUrl}>Start Free Trial</a>
                </Button>
                <p className="text-xs text-center text-slate-400 mt-3">
                  Subscription billed monthly or annually ·{" "}
                  <Link to="/terms" className="underline hover:text-slate-600">Terms</Link>
                </p>
              </div>
            </div>
          ))}
          
        </div>

        <Features />

        <div className="mt-12 mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
          <p className="mb-2 font-semibold text-slate-800">Subscription Terms</p>
          <p>
            {SITE.name} is a cloud software subscription. Access is provided digitally — no physical products are shipped.
            Cancel anytime per our{" "}
            <Link to="/cancellation-policy" className="text-primary underline">Cancellation Policy</Link>.
            Refunds are governed by our{" "}
            <Link to="/refund-policy" className="text-primary underline">Refund Policy</Link>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
