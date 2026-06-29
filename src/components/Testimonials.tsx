import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "R. Venkatesh",
    role: "Managing Director",
    company: "Venkatesh Builders, Madurai",
    quote:
      "Briktra replaced our scattered WhatsApp updates and paper registers. Attendance and site expenses are now visible to management the same day.",
  },
  {
    name: "Priya S.",
    role: "Project Coordinator",
    company: "Southline Constructions",
    quote:
      "The mobile app works well for our supervisors on site. Hindi and Tamil support helped our field teams adopt it quickly.",
  },
  {
    name: "Arun Kumar",
    role: "Civil Contractor",
    company: "AK Infrastructure",
    quote:
      "Project-wise expense tracking and labour reports save us hours every week. The pricing is transparent with no hidden setup fees.",
  },
];

const Testimonials = () => (
  <section className="py-24" aria-labelledby="testimonials-heading">
    <div className="container mx-auto px-4 md:px-6">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <span className="mb-6 flex items-center justify-center gap-2 mx-auto w-fit rounded-full border-2 border-primary/30 bg-primary/10 px-6 py-2.5 text-lg font-bold uppercase tracking-wider text-primary">
          <Star className="h-5 w-5" aria-hidden="true" />
          Customer Success
        </span>
        <h2 id="testimonials-heading" className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl">
          Trusted by Construction Teams
        </h2>
        <p className="text-muted-foreground">
          Placeholder testimonials from early adopters. Replace with verified customer stories as they become available.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map((item) => (
          <blockquote
            key={item.name}
            className="premium-card flex flex-col p-8"
          >
            <Quote className="mb-4 h-8 w-8 text-primary/40" aria-hidden="true" />
            <p className="mb-6 flex-1 text-foreground leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
            <footer>
              <cite className="not-italic">
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.role}, {item.company}
                </p>
              </cite>
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
