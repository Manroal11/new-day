import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { WorkAreas } from "@/components/site/sections";
import { EmptyNote, OutreachCard, ProjectCard, UpcomingCard } from "@/components/site/cards";
import { CATEGORIES, outreachQuery, projectsQuery, upcomingQuery } from "@/lib/content";

export const Route = createFileRoute("/our-work")({
  head: () => ({
    meta: [
      { title: "Our Work — New Day Projects and Outreach" },
      {
        name: "description",
        content:
          "Explore New Day projects across education, skills, enterprise, digital and community, plus upcoming activities and outreach.",
      },
      { property: "og:title", content: "Our Work — New Day Projects and Outreach" },
      {
        property: "og:description",
        content: "Projects, upcoming activities and outreach across five areas of work.",
      },
      { property: "og:url", content: "/our-work" },
    ],
    links: [{ rel: "canonical", href: "/our-work" }],
  }),
  component: OurWork,
});

function OurWork() {
  const [filter, setFilter] = useState<string>("All");
  const { data: projects = [] } = useQuery(projectsQuery);
  const { data: upcoming = [] } = useQuery(upcomingQuery);
  const { data: outreach = [] } = useQuery(outreachQuery);

  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Our Work"
        title="Five areas of work, built around people"
        intro="Every project belongs to a community. Filter by area to see what is happening, what is underway and what comes next."
      />

      <section className="nd-shell pb-16">
        <WorkAreas />
      </section>

      <section className="bg-surface">
        <div className="nd-shell py-20">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-ink lg:text-5xl">
            Projects
          </h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {(["All", ...CATEGORIES] as const).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                className={`rounded-full px-4 py-2 font-sans text-sm transition-colors ${
                  filter === category
                    ? "bg-ink text-paper"
                    : "bg-paper text-ink-soft ring-1 ring-line hover:text-ink"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {filtered.length === 0 ? <EmptyNote>No projects in this category yet.</EmptyNote> : null}
        </div>
      </section>

      <section className="nd-shell py-20">
        <h2 className="font-display text-4xl font-semibold tracking-tight text-ink lg:text-5xl">
          Upcoming activities
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((item) => (
            <UpcomingCard key={item.id} item={item} />
          ))}
        </div>
        {upcoming.length === 0 ? <EmptyNote>New activities will be announced soon.</EmptyNote> : null}
      </section>

      <section className="bg-surface">
        <div className="nd-shell py-20">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-ink lg:text-5xl">
            Outreach
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {outreach.map((item) => (
              <OutreachCard key={item.id} item={item} />
            ))}
          </div>
          {outreach.length === 0 ? <EmptyNote>Outreach activities will appear here.</EmptyNote> : null}
        </div>
      </section>
    </SiteLayout>
  );
}
