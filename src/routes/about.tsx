import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { GetInvolvedGrid } from "@/components/site/sections";
import { ContactSection } from "@/components/site/ContactSection";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About New Day — Our Story and Philosophy" },
      {
        name: "description",
        content:
          "New Day is a social-impact organisation built on a simple philosophy: Support, Educate, Equip, Build, Grow, Sustain.",
      },
      { property: "og:title", content: "About New Day — Our Story and Philosophy" },
      {
        property: "og:description",
        content: "Why New Day exists and how we work alongside communities to create lasting opportunity.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const STEPS = [
  { title: "Support", text: "Meet people where they are, with respect and without conditions." },
  { title: "Educate", text: "Share knowledge that widens what's possible." },
  { title: "Equip", text: "Provide the tools, training and resources to act." },
  { title: "Build", text: "Create projects and enterprises with local ownership." },
  { title: "Grow", text: "Strengthen what works and expand it carefully." },
  { title: "Sustain", text: "Hand over income and capacity that outlives us." },
];

function About() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="About"
        title="A social-impact organisation — not a charity"
        intro="We believe people are not problems to be solved. Given the right support, skills and tools, communities build their own futures. Our role is to walk alongside them until that work stands on its own."
      />

      <section className="nd-shell pb-16">
        <img
          src="/images/outreach-youth.jpg"
          alt="A skills workshop in progress with participants working together"
          loading="lazy"
          width={1600}
          height={900}
          className="aspect-[16/9] w-full rounded-[28px] object-cover"
        />
      </section>

      <section className="bg-surface">
        <div className="nd-shell py-20 lg:py-24">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-amber-deep uppercase">
            Our Philosophy
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink lg:text-5xl">
            Six steps, in order
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.title} className="nd-card p-6">
                <p className="font-display text-3xl font-semibold text-amber-deep">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-sans text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 font-body text-sm text-pretty text-ink-soft">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="nd-shell py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-balance text-ink lg:text-4xl">
              What guides us
            </h2>
            <p className="mt-5 font-body text-lg text-pretty text-ink-soft">
              Dignity first. Transparency in everything we report. Local ownership of every project.
              Sustainability over short-term relief. And the belief that a single day can change the
              direction of a life.
            </p>
          </div>
          <div className="rounded-[28px] bg-surface p-8">
            <h3 className="font-sans text-lg font-semibold text-ink">Our promise</h3>
            <ul className="mt-5 space-y-4 font-body text-sm text-ink-soft">
              <li>We publish our projects, outreach and results openly.</li>
              <li>We design programmes with communities, never for them.</li>
              <li>We measure progress in skills, income and independence.</li>
              <li>We stay until the work can continue without us.</li>
            </ul>
          </div>
        </div>
      </section>

      <GetInvolvedGrid />
      <ContactSection />
    </SiteLayout>
  );
}
