import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { EmptyNote, UpcomingCard } from "@/components/site/cards";
import { upcomingQuery } from "@/lib/content";

export const Route = createFileRoute("/upcoming")({
  head: () => ({
    meta: [
      { title: "Upcoming Activities — New Day" },
      {
        name: "description",
        content:
          "Planned New Day projects and outreach activities, with dates, locations and how you can take part.",
      },
      { property: "og:title", content: "Upcoming Activities — New Day" },
      {
        property: "og:description",
        content: "What New Day is planning next, and how to take part.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/upcoming" },
    ],
    links: [{ rel: "canonical", href: "/upcoming" }],
  }),
  component: UpcomingPage,
});

function UpcomingPage() {
  const { data: upcoming = [] } = useQuery(upcomingQuery);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Upcoming"
        title="What's coming next"
        intro="Activities we are planning. Dates may shift as we work with each community — get in touch if you'd like to take part."
      />

      <section className="nd-shell pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((item) => (
            <UpcomingCard key={item.id} item={item} />
          ))}
        </div>
        {upcoming.length === 0 ? <EmptyNote>New activities will be announced soon.</EmptyNote> : null}
      </section>
    </SiteLayout>
  );
}
