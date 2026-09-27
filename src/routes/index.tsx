import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { GetInvolvedGrid, ImpactStats, Pathway, WorkAreas } from "@/components/site/sections";
import {
  ActivityCard,
  AnnouncementCard,
  EmptyNote,
  UpcomingCard,
} from "@/components/site/cards";
import {
  announcementsQuery,
  outreachQuery,
  projectsQuery,
  toActivities,
  upcomingQuery,
} from "@/lib/content";
import { ContactSection } from "@/components/site/ContactSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "New Day — Empowering People, Building Futures" },
      {
        name: "description",
        content:
          "New Day empowers people and communities with knowledge, skills and opportunities to build sustainable futures.",
      },
      { property: "og:title", content: "New Day — Empowering People, Building Futures" },
      {
        property: "og:description",
        content:
          "Education, skills, enterprise, digital and community work that creates lasting opportunity.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const { data: projects = [] } = useQuery(projectsQuery);
  const { data: outreach = [] } = useQuery(outreachQuery);
  const { data: upcoming = [] } = useQuery(upcomingQuery);
  const { data: announcements = [] } = useQuery(announcementsQuery);

  const latest = toActivities(projects, outreach).slice(0, 3);

  return (
    <SiteLayout>
      {/* 1. Hero */}
      <section className="nd-shell pt-14 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 font-sans text-xs font-medium text-ink-soft ring-1 ring-line">
              <span className="size-1.5 rounded-full bg-amber" />
              Empowering People. Building Futures.
            </span>
            <h1 className="nd-rise mt-6 font-display text-5xl leading-[1.05] font-semibold tracking-tight text-balance text-ink lg:text-7xl">
              A New Day. A New Opportunity. A Better Future.
            </h1>
            <p className="mt-6 max-w-[46ch] font-body text-lg text-pretty text-ink-soft">
              New Day empowers people and communities with knowledge, skills and opportunities to
              build sustainable futures.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/projects-outreach"
                className="rounded-full bg-ink px-6 py-3.5 font-sans text-sm font-medium text-paper transition-colors hover:bg-ink/85"
              >
                See Our Work
              </Link>
              <Link
                to="/get-involved"
                className="rounded-full bg-paper px-6 py-3.5 font-sans text-sm font-medium text-ink ring-1 ring-line transition-colors hover:bg-surface"
              >
                Get Involved
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <img
              src="/images/hero.jpg"
              alt="Community members learning together in a bright open space"
              width={1200}
              height={900}
              className="aspect-[4/3] w-full rounded-[28px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. Why New Day */}
      <section className="bg-surface">
        <div className="nd-shell py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-sans text-xs font-semibold tracking-[0.2em] text-amber-deep uppercase">
                Why New Day
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance text-ink lg:text-4xl">
                We build opportunity with people, as a team.
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="font-body text-lg text-pretty text-ink-soft">
                New Day is a social-impact organisation at the start of its journey. We work
                alongside people who have been left with limited options, and stay long enough 
                for the work to stand on its own.
              </p>
              <div className="mt-8">
                <Pathway />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Work */}
      <section className="nd-shell py-20 lg:py-24">
        <p className="font-sans text-xs font-semibold tracking-[0.2em] text-amber-deep uppercase">
          Our Work
        </p>
        <h2 className="mt-3 max-w-[20ch] font-display text-4xl font-semibold tracking-tight text-balance text-ink lg:text-5xl">
          Five areas, one purpose
        </h2>
        <div className="mt-12">
          <WorkAreas />
        </div>
      </section>

      {/* 4. Latest projects & outreach */}
      <section className="bg-surface">
        <div className="nd-shell py-20 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-sans text-xs font-semibold tracking-[0.2em] text-amber-deep uppercase">
                Latest
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink lg:text-5xl">
                Projects & outreach
              </h2>
            </div>
            <Link
              to="/projects-outreach"
              className="font-sans text-sm font-medium text-ink underline-offset-4 hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((item) => (
              <ActivityCard key={`${item.kind}-${item.id}`} item={item} />
            ))}
          </div>
          {latest.length === 0 ? (
            <EmptyNote>Our first activities will be published here soon.</EmptyNote>
          ) : null}
        </div>
      </section>

      {/* 5. Upcoming */}
      <section className="nd-shell py-20 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-sans text-xs font-semibold tracking-[0.2em] text-amber-deep uppercase">
              What's Coming Next
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink lg:text-5xl">
              Upcoming activities
            </h2>
          </div>
          <Link to="/upcoming" className="font-sans text-sm font-medium text-ink underline-offset-4 hover:underline">
            See all upcoming →
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.slice(0, 3).map((item) => (
            <UpcomingCard key={item.id} item={item} />
          ))}
        </div>
        {upcoming.length === 0 ? <EmptyNote>New activities will be announced soon.</EmptyNote> : null}
      </section>

      {/* Latest updates */}
      {announcements.length > 0 ? (
        <section className="bg-surface">
          <div className="nd-shell py-20 lg:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="font-sans text-xs font-semibold tracking-[0.2em] text-amber-deep uppercase">
                  Updates
                </p>
                <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink lg:text-5xl">
                  Latest news
                </h2>
              </div>
              <Link to="/updates" className="font-sans text-sm font-medium text-ink underline-offset-4 hover:underline">
                All updates →
              </Link>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {announcements.slice(0, 3).map((item) => (
                <AnnouncementCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 6. Impact */}
      <section className="nd-shell py-20 lg:py-24">
        <div className="text-center">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-amber-deep uppercase">
            Our Impact
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance text-ink lg:text-5xl">
            Progress we can measure
          </h2>
        </div>
        <ImpactStats />
      </section>

      {/* 7. Get involved */}
      <GetInvolvedGrid />

      {/* 8. Contact */}
      <ContactSection />
    </SiteLayout>
  );
}
