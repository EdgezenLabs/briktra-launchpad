import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/**
 * Questions as an accordion. Answers stay in the HTML while closed so search
 * engines index them; headingLevel keeps the page outline unbroken (2 when
 * the list sits directly under the page's H1, 3 under a section H2).
 */
const FaqList = ({
  items,
  headingLevel = 3,
}: {
  items: { q: string; a: string }[];
  headingLevel?: 2 | 3;
}) => (
  <Accordion type="single" collapsible className="divide-y divide-border rounded-2xl border border-border bg-card">
    {items.map((f, i) => (
      <AccordionItem key={f.q} value={`q${i}`} className="border-none px-5">
        <AccordionTrigger headingLevel={headingLevel} className="text-left font-semibold text-foreground hover:no-underline">
          {f.q}
        </AccordionTrigger>
        <AccordionContent forceMount className="leading-relaxed text-muted-foreground">
          {f.a}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export default FaqList;
