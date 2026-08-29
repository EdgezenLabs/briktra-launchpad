import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import ScrollToTop from "./components/ScrollToTop";

// WEB-009: the production bundle was a single ~545KB chunk (everything
// eager-loaded up front). Index (the homepage, by far the most common
// entry point) stays eager so there's no loading flash on first paint;
// every other route is code-split into its own chunk, fetched only when
// a visitor actually navigates there.
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const CancellationPolicy = lazy(() => import("./pages/CancellationPolicy"));
const ShippingDeliveryPolicy = lazy(() => import("./pages/ShippingDeliveryPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const SecurityPolicy = lazy(() => import("./pages/SecurityPolicy"));
const DataDeletionPolicy = lazy(() => import("./pages/DataDeletionPolicy"));
const DeleteAccount = lazy(() => import("./pages/DeleteAccount"));
const AcceptableUsePolicy = lazy(() => import("./pages/AcceptableUsePolicy"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const FeaturesPage = lazy(() => import("./pages/FeaturesPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const ModuleExplore = lazy(() => import("./pages/ModuleExplore"));
const InvitationHandoff = lazy(() => import("./pages/InvitationHandoff"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <ScrollToTop />
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/about-us" element={<Navigate to="/about" replace />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/cancellation-policy" element={<CancellationPolicy />} />
              <Route path="/shipping-delivery-policy" element={<ShippingDeliveryPolicy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/security-policy" element={<SecurityPolicy />} />
              <Route path="/data-deletion-policy" element={<DataDeletionPolicy />} />
              <Route path="/delete-account" element={<DeleteAccount />} />
              <Route path="/acceptable-use-policy" element={<AcceptableUsePolicy />} />
              <Route path="/explore" element={<ModuleExplore />} />
              <Route path="/invite" element={<InvitationHandoff />} />
              <Route path="/app/*" element={null} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
