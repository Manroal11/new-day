import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import { formatDate, type Announcement } from "@/lib/content";
import { ContactSection } from "@/components/site/ContactSection";

const announcementQuery = (slug: string) =>
  queryOptions({
    queryKey: ["announcement", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return (data as Announcement | null) ?? null;
    },
  });

export const Route = createFileRoute("/updates/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Update — New Day" },
      { name: "description", content: "News and announcements from New Day." },
      { property: "og:title", content: "Update — New Day" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/updates/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/updates/${params.slug}` }],
  }),
  component: UpdatePage,
});

function UpdatePage() {
  const { slug } = Route.useParams();
  const { data: item, isLoading } = useQuery(announcementQuery(slug));

  return (
    <SiteLayout>
      <article className="nd-shell py-14 lg:py-20">
        <Link to="/updates" className="font-sans text-sm text-ink-soft hover:text-ink">
          ← All updates
        </Link>
        {isLoading ? (
          <p className="mt-10 font-body text-ink-soft">Loading…</p>
        ) : !item ? (
          <p className="mt-10 font-body text-ink-soft">This update could not be found.</p>
        ) : (
          <>
            <h1 className="mt-6 max-w-[24ch] font-display text-4xl font-semibold tracking-tight text-balance text-ink lg:text-6xl">
              {item.title}
            </h1>
            <p className="mt-4 font-body text-sm text-ink-soft">{formatDate(item.publish_date)}</p>
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                width={1600}
                height={900}
                className="mt-10 aspect-[16/9] w-full rounded-[28px] object-cover"
              />
            ) : null}
            <p className="mt-10 max-w-[62ch] font-body text-lg text-pretty text-ink">{item.summary}</p>
            {item.content
              ? item.content.split("\n").filter(Boolean).map((paragraph, index) => (
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
