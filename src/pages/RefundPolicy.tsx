import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24 md:px-6 md:py-32">
        <div className="mx-auto max-w-3xl prose prose-slate dark:prose-invert">
          <h1 className="mb-8 font-display text-4xl font-bold">Refund Policy</h1>
          <p className="text-muted-foreground mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Subscription Plans</h2>
              <p>Briktra offers subscription-based access to our mobile-first ERP solution. Subscribers can choose between monthly and annual billing cycles.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Cancellation Policy</h2>
              <p>You may cancel your subscription at any time. When you cancel, your subscription will remain active until the end of your current billing period. We do not provide refunds or credits for any partial subscription periods or unused services.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Refund Eligibility</h2>
              <p>In general, fees charged by Briktra are non-refundable. We may, however, make exceptions in our sole discretion in cases of billing errors or extenuating circumstances.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Requesting a Refund</h2>
              <p>To request a refund exception, please contact our support team explaining the circumstances of your request.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Contact Information</h2>
              <p>If you have any questions about this Refund Policy, please contact us at:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Email: support@briktra.com</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
