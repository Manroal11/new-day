import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import { formatDate, type Outreach } from "@/lib/content";
import { ContactSection } from "@/components/site/ContactSection";

const outreachItemQuery = (slug: string) =>
  queryOptions({
    queryKey: ["outreach", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("outreach").select("*").eq("slug", slug).maybeSingle();
      if (error) throw new Error(error.message);
      return (data as Outreach | null) ?? null;
    },
  });

export const Route = createFileRoute("/outreach/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Outreach — New Day" },
      { name: "description", content: "A New Day outreach activity: where we went and who took part." },
      { property: "og:title", content: "Outreach — New Day" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/outreach/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/outreach/${params.slug}` }],
  }),
  component: OutreachPage,
});

function OutreachPage() {
  const { slug } = Route.useParams();
  const { data: item, isLoading } = useQuery(outreachItemQuery(slug));

  return (
    <SiteLayout>
      <article className="nd-shell py-14 lg:py-20">
        <Link to="/our-work" className="font-sans text-sm text-ink-soft hover:text-ink">
          ← All outreach
        </Link>
        {isLoading ? (
          <p className="mt-10 font-body text-ink-soft">Loading…</p>
        ) : !item ? (
          <p className="mt-10 font-body text-ink-soft">This activity could not be found.</p>
        ) : (
          <>
            <h1 className="mt-6 max-w-[24ch] font-display text-4xl font-semibold tracking-tight text-balance text-ink lg:text-6xl">
              {item.title}
            </h1>
            <p className="mt-4 font-body text-sm text-ink-soft">
              {[formatDate(item.activity_date), item.location].filter(Boolean).join(" · ")}
              {item.people_reached ? ` · ${item.people_reached} people reached` : ""}
            </p>
            <p className="mt-8 max-w-[62ch] font-body text-lg text-pretty text-ink">{item.description}</p>
            {item.content
              ? item.content.split("\n").filter(Boolean).map((paragraph, index) => (
                  <p key={index} className="mt-5 max-w-[62ch] font-body text-base text-pretty text-ink-soft">
                    {paragraph}
                  </p>
                ))
              : null}
            {item.photos?.length ? (
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {item.photos.map((photo, index) => (
                  <img
                    key={photo + index}
                    src={photo}
                    alt={`${item.title} photo ${index + 1}`}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="aspect-[4/3] w-full rounded-[24px] object-cover"
                  />
                ))}
              </div>
            ) : null}
          </>
        )}
      </article>
      <ContactSection />
    </SiteLayout>
  );
}
