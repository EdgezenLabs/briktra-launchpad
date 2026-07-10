import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/RefundPolicy";
import CancellationPolicy from "./pages/CancellationPolicy";
import ShippingDeliveryPolicy from "./pages/ShippingDeliveryPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import SecurityPolicy from "./pages/SecurityPolicy";
import DataDeletionPolicy from "./pages/DataDeletionPolicy";
import DeleteAccount from "./pages/DeleteAccount";
import AcceptableUsePolicy from "./pages/AcceptableUsePolicy";
import AboutUs from "./pages/AboutUs";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import ModuleExplore from "./pages/ModuleExplore";
import ScrollToTop from "./components/ScrollToTop";

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
            <Route path="/app/*" element={null} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
