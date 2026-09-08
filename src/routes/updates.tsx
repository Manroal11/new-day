import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { AnnouncementCard, EmptyNote, UpcomingCard } from "@/components/site/cards";
import { announcementsQuery, upcomingQuery } from "@/lib/content";

export const Route = createFileRoute("/updates")({
  head: () => ({
    meta: [
      { title: "Updates — News and Announcements from New Day" },
      {
        name: "description",
        content:
          "The latest announcements, news and upcoming activities from New Day and the communities we work with.",
      },
      { property: "og:title", content: "Updates — News and Announcements from New Day" },
      { property: "og:description", content: "Announcements, news and what's coming next." },
      { property: "og:url", content: "/updates" },
    ],
    links: [{ rel: "canonical", href: "/updates" }],
  }),
  component: Updates,
});

function Updates() {
  const { data: announcements = [] } = useQuery(announcementsQuery);
  const { data: upcoming = [] } = useQuery(upcomingQuery);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Updates"
        title="News from the field"
        intro="Announcements, opportunities and what's coming next."
      />

      <section className="nd-shell pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {announcements.map((item) => (
            <AnnouncementCard key={item.id} item={item} />
          ))}
        </div>
        {announcements.length === 0 ? <EmptyNote>No announcements yet.</EmptyNote> : null}
      </section>

      <section className="bg-surface">
        <div className="nd-shell py-20">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-ink lg:text-5xl">
            What's coming next
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((item) => (
              <UpcomingCard key={item.id} item={item} />
            ))}
          </div>
          {upcoming.length === 0 ? <EmptyNote>New activities will be announced soon.</EmptyNote> : null}
        </div>
      </section>
    </SiteLayout>
  );
}
