import PageShell from "@/components/PageShell";
import { SITE } from "@/lib/site-config";
import { FAQS } from "@/lib/content";
import FaqList from "@/components/site/FaqList";
import { CtaBand } from "@/components/site/Blocks";
import { PageHero } from "@/components/site/PageHero";

const FAQPage = () => (
  <PageShell
    title="FAQ: Free Trial, Plans, Devices & Data Safety"
    description="Answers to what contractors ask about Briktra: the 30-day free trial, plans and logins, BOQ, Android and web, data safety, payments and cancelling."
    path="/faq"
    crumbs={[{ name: "FAQ", path: "/faq" }]}
    jsonLd={[
      {
        "@type": "FAQPage",
        "@id": `${SITE.url}/faq#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ]}
  >
    <PageHero
      eyebrow="Questions"
      title="Questions about"
      highlight="Briktra."
      intro="Answers about the free trial, plans, devices, data safety and payments. Can't find yours? WhatsApp us and a person will reply."
      actions="contact"
    />
    <section className="relative z-10 -mt-10 pb-24">
      <div className="container mx-auto max-w-3xl px-4 md:px-6">
        <div className="rounded-[2rem] border border-border bg-card p-3 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.4)] md:p-5">
          <FaqList items={FAQS} headingLevel={2} />
        </div>
      </div>
    </section>
    <CtaBand />
  </PageShell>
);

export default FAQPage;
