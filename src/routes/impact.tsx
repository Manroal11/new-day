import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { ImpactStats } from "@/components/site/sections";
import { EmptyNote, OutreachCard } from "@/components/site/cards";
import { outreachQuery } from "@/lib/content";
import { ContactSection } from "@/components/site/ContactSection";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact — What New Day Has Achieved So Far" },
      {
        name: "description",
        content:
          "Transparent impact numbers and outreach results from New Day: people reached, sessions delivered, projects launched and partners engaged.",
      },
      { property: "og:title", content: "Impact — What New Day Has Achieved So Far" },
      {
        property: "og:description",
        content: "People reached, training delivered, projects launched — reported openly.",
      },
      { property: "og:url", content: "/impact" },
    ],
    links: [{ rel: "canonical", href: "/impact" }],
  }),
  component: Impact,
});

function Impact() {
  const { data: outreach = [] } = useQuery(outreachQuery);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Impact"
        title="Progress, reported openly"
        intro="We publish what we can measure and keep it current. These numbers are maintained by our team and updated as work is completed."
      />

      <section className="nd-shell pb-20">
        <ImpactStats />
      </section>

      <section className="bg-surface">
        <div className="nd-shell py-20">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-ink lg:text-5xl">
            Outreach results
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {outreach.map((item) => (
              <OutreachCard key={item.id} item={item} />
            ))}
          </div>
          {outreach.length === 0 ? <EmptyNote>Outreach results will appear here.</EmptyNote> : null}
        </div>
      </section>

      <ContactSection />
    </SiteLayout>
  );
}
