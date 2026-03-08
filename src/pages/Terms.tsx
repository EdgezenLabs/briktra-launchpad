import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24 md:px-6 md:py-32">
        <div className="mx-auto max-w-3xl prose prose-slate dark:prose-invert">
          <h1 className="mb-8 font-display text-4xl font-bold">Terms & Conditions</h1>
          <p className="text-muted-foreground mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using the Briktra platform, you agree to be bound by these Terms & Conditions. If you do not agree to all of these terms, do not use our services.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
              <p>Briktra provides a mobile-first ERP solution for construction companies to manage projects, labor, materials, vendors, and expenses. We reserve the right to modify or discontinue any part of the service with or without notice.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">3. User Responsibilities</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when registering for the service.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Limitation of Liability</h2>
              <p>Briktra shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Contact Information</h2>
              <p>For any questions regarding these terms, please contact us at:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Email: sunil.jas@edgezenlabs.com</li>
                <li>Email: sujith@edgezenlabs.com</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
