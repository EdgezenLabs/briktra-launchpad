import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24 md:px-6 md:py-32">
        <div className="mx-auto max-w-3xl prose prose-slate dark:prose-invert">
          <h1 className="mb-8 font-display text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
              <p>We collect information that you provide directly to us when you register for an account, use our services, or communicate with us. This may include your name, email address, phone number, company details, and any other information you choose to provide.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to operate, maintain, and improve our services, communicate with you, process transactions, and personalize your experience on the Briktra platform.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Data Security</h2>
              <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
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

export default PrivacyPolicy;
