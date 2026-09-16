import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { Pathway, WorkAreas } from "@/components/site/sections";

export const Route = createFileRoute("/our-work")({
  head: () => ({
    meta: [
      { title: "Our Work — Five Areas, One Purpose | New Day" },
      {
        name: "description",
        content:
          "How New Day works: education, skills, enterprise, digital and community, following a simple path of educate, equip, empower and sustain.",
      },
      { property: "og:title", content: "Our Work — Five Areas, One Purpose | New Day" },
      {
        property: "og:description",
        content: "Education, skills, enterprise, digital and community work at New Day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/our-work" },
    ],
    links: [{ rel: "canonical", href: "/our-work" }],
  }),
  component: OurWork,
});

function OurWork() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Our Work"
        title="Five areas of work, built around people"
        intro="We start with what a community already has, then add the learning, tools and support it needs to keep going."
      />

      <section className="nd-shell pb-16">
        <WorkAreas />
      </section>

      <section className="bg-surface">
        <div className="nd-shell py-20">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink lg:text-4xl">
            How we work
          </h2>
          <p className="mt-4 max-w-[56ch] font-body text-lg text-pretty text-ink-soft">
            Each activity follows the same simple path, so progress continues long after we arrive.
          </p>
          <div className="mt-8">
            <Pathway />
          </div>
          <Link
            to="/projects-outreach"
            className="mt-10 inline-flex rounded-full bg-ink px-6 py-3.5 font-sans text-sm font-medium text-paper transition-colors hover:bg-ink/85"
          >
            See projects & outreach
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
