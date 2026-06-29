import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { COMPANY, PAYMENT, SITE } from "@/lib/site-config";

export const FAQ_ITEMS = [
  {
    question: "What is Briktra?",
    answer:
      "Briktra is a cloud-based construction project management and ERP platform. It helps contractors and builders manage projects, sites, labour, attendance, expenses, inventory, billing, and reports from web and mobile.",
  },
  {
    question: "Is Briktra a subscription service?",
    answer:
      "Yes. Briktra is offered as a monthly or annual SaaS subscription. You choose a plan based on your team size and project needs. All prices are exclusive of applicable GST unless stated otherwise.",
  },
  {
    question: "How do I start a free trial?",
    answer:
      "Click Start Free Trial on our website to open the Briktra app, create your account, and explore the platform. You can upgrade to a paid plan when you are ready.",
  },
  {
    question: "What payment methods are accepted?",
    answer: `${PAYMENT.disclaimer} We accept standard online payment methods supported by Cashfree, including UPI, cards, and net banking.`,
  },
  {
    question: "Will I receive an invoice for my subscription?",
    answer:
      "Yes. After successful payment, a tax invoice is generated and available in your Briktra account under payment history. Invoices include applicable GST details.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes. You may cancel at any time from your account settings. Your access continues until the end of the current billing period. See our Cancellation Policy for details.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Subscription fees are generally non-refundable. Exceptions may apply for billing errors or as described in our Refund Policy. Contact us within 7 days of payment if you believe a charge was made in error.",
  },
  {
    question: "Is physical shipping involved?",
    answer:
      "No. Briktra is a cloud software service. There are no physical products to ship. Access is provided digitally upon account activation and subscription confirmation.",
  },
  {
    question: "How do I contact support?",
    answer: `Email us at ${COMPANY.email}, call ${COMPANY.phone}, or use the contact form on our website. Support hours: ${COMPANY.businessHours}.`,
  },
];

interface FAQProps {
  showViewAll?: boolean;
  limit?: number;
}

const FAQ = ({ showViewAll = true, limit }: FAQProps) => {
  const items = limit ? FAQ_ITEMS.slice(0, limit) : FAQ_ITEMS;

  return (
    <section id="faq" className="bg-secondary/30 py-24" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="mb-6 flex items-center justify-center gap-2 mx-auto w-fit rounded-full border-2 border-primary/30 bg-primary/10 px-6 py-2.5 text-lg font-bold uppercase tracking-wider text-primary">
            <HelpCircle className="h-5 w-5" aria-hidden="true" />
            FAQ
          </span>
          <h2 id="faq-heading" className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Clear answers about {SITE.name}, subscriptions, payments, and support.
          </p>
        </div>

        <Accordion type="single" collapsible className="mx-auto max-w-3xl">
          {items.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-left font-semibold">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {showViewAll && limit && (
          <p className="mt-8 text-center">
            <Link to="/faq" className="font-medium text-primary hover:underline">
              View all FAQs →
            </Link>
          </p>
        )}
      </div>
    </section>
  );
};

export default FAQ;
