import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Chip, StatusChip } from "@/components/site/cards";
import { formatDate, type Project } from "@/lib/content";
import { ContactSection } from "@/components/site/ContactSection";

const projectQuery = (slug: string) =>
  queryOptions({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();
      if (error) throw new Error(error.message);
      return (data as Project | null) ?? null;
    },
  });

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Project — New Day" },
      { name: "description", content: "A New Day project: what we are building and who it serves." },
      { property: "og:title", content: "Project — New Day" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/projects/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/projects/${params.slug}` }],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const { data: project, isLoading } = useQuery(projectQuery(slug));

  return (
    <SiteLayout>
      <article className="nd-shell py-14 lg:py-20">
        <Link to="/our-work" className="font-sans text-sm text-ink-soft hover:text-ink">
          ← All projects
        </Link>
        {isLoading ? (
          <p className="mt-10 font-body text-ink-soft">Loading…</p>
        ) : !project ? (
          <p className="mt-10 font-body text-ink-soft">This project could not be found.</p>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap gap-2">
              <Chip tone="leaf">{project.category}</Chip>
              <StatusChip status={project.status} />
            </div>
            <h1 className="mt-5 max-w-[24ch] font-display text-4xl font-semibold tracking-tight text-balance text-ink lg:text-6xl">
              {project.title}
            </h1>
            <p className="mt-4 font-body text-sm text-ink-soft">
              {[project.location, formatDate(project.project_date)].filter(Boolean).join(" · ")}
            </p>
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                width={1600}
                height={900}
                className="mt-10 aspect-[16/9] w-full rounded-[28px] object-cover"
              />
            ) : null}
            <p className="mt-10 max-w-[62ch] font-body text-lg text-pretty text-ink">{project.summary}</p>
            {project.content
              ? project.content.split("\n").filter(Boolean).map((paragraph, index) => (
                  <p key={index} className="mt-5 max-w-[62ch] font-body text-base text-pretty text-ink-soft">
                    {paragraph}
                  </p>
                ))
              : null}
          </>
        )}
      </article>
      <ContactSection />
    </SiteLayout>
  );
}
