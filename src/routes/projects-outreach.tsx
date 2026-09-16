import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { ActivityCard, EmptyNote } from "@/components/site/cards";
import { outreachQuery, projectsQuery, toActivities } from "@/lib/content";

export const Route = createFileRoute("/projects-outreach")({
  head: () => ({
    meta: [
      { title: "Projects & Outreach — New Day" },
      {
        name: "description",
        content:
          "Every New Day project and outreach activity in one place — education, skills, enterprise, digital and community work with the people we serve.",
      },
      { property: "og:title", content: "Projects & Outreach — New Day" },
      {
        property: "og:description",
        content: "All New Day projects and outreach activities in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/projects-outreach" },
    ],
    links: [{ rel: "canonical", href: "/projects-outreach" }],
  }),
  component: ProjectsOutreach,
});

const FILTERS = ["All", "Project", "Outreach"] as const;

function ProjectsOutreach() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const { data: projects = [] } = useQuery(projectsQuery);
  const { data: outreach = [] } = useQuery(outreachQuery);

  const activities = toActivities(projects, outreach);
  const shown = filter === "All" ? activities : activities.filter((a) => a.kind === filter);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Projects & Outreach"
        title="What we are doing, and where"
        intro="One place for all New Day activity — projects underway and time spent with communities."
      />

      <section className="nd-shell pb-20">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 font-sans text-sm transition-colors ${
                filter === item
                  ? "bg-ink text-paper"
                  : "bg-paper text-ink-soft ring-1 ring-line hover:text-ink"
              }`}
            >
              {item === "All" ? "All" : `${item}s`}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((item) => (
            <ActivityCard key={`${item.kind}-${item.id}`} item={item} />
          ))}
        </div>
        {shown.length === 0 ? <EmptyNote>Nothing published here yet.</EmptyNote> : null}
      </section>
    </SiteLayout>
  );
}
