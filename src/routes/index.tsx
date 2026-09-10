import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { GetInvolvedGrid, ImpactStats, WorkAreas } from "@/components/site/sections";
import { EmptyNote, OutreachCard, ProjectCard, UpcomingCard } from "@/components/site/cards";
import { CATEGORIES, outreachQuery, projectsQuery, upcomingQuery } from "@/lib/content";
import { ContactSection } from "@/components/site/ContactSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "New Day — Empowering People, Building Futures" },
      {
        name: "description",
        content:
          "New Day is a social-impact organisation empowering vulnerable people through education, skills, enterprise, technology and sustainable community projects.",
      },
      { property: "og:title", content: "New Day — Empowering People, Building Futures" },
      {
        property: "og:description",
        content:
          "Education, skills, enterprise, digital and community projects that create lasting opportunity.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const [filter, setFilter] = useState<string>("All");
  const { data: projects = [] } = useQuery(projectsQuery);
  const { data: upcoming = [] } = useQuery(upcomingQuery);
  const { data: outreach = [] } = useQuery(outreachQuery);

  const filtered =
    filter === "All" ? projects : projects.filter((project) => project.category === filter);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="nd-shell pt-14 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 font-sans text-xs font-medium text-ink-soft ring-1 ring-line">
              <span className="size-1.5 rounded-full bg-amber" />
              Social impact, not charity
            </span>
            <h1 className="nd-rise mt-6 font-display text-5xl leading-[1.05] font-semibold tracking-tight text-balance text-ink lg:text-7xl">
              A New Day. A New Opportunity. A Better Future.
            </h1>
            <p className="mt-6 max-w-[46ch] font-body text-lg text-pretty text-ink-soft">
              We empower vulnerable people through education, skills, enterprise, technology and
              sustainable income projects — so progress continues long after we arrive.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/get-involved"
                className="rounded-full bg-ink px-6 py-3.5 font-sans text-sm font-medium text-paper transition-colors hover:bg-ink/85"
              >
                Support New Day
              </Link>
              <Link
                to="/our-work"
                className="rounded-full bg-paper px-6 py-3.5 font-sans text-sm font-medium text-ink ring-1 ring-line transition-colors hover:bg-surface"
              >
                See our work
              </Link>
            </div>
            <p className="mt-8 font-sans text-xs tracking-[0.18em] text-ink-soft uppercase">
              Support · Educate · Equip · Build · Grow · Sustain
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="relative">
              <img
                src="/images/hero.jpg"
                alt="Community members learning together in a bright open space"
                width={1200}
                height={900}
                className="aspect-[4/3] w-full rounded-[28px] object-cover"
              />
              <div className="nd-floaty absolute -bottom-6 -left-4 hidden rounded-[20px] bg-paper p-5 shadow-[0_20px_50px_-25px_rgba(41,29,19,0.6)] sm:block">
                <p className="font-display text-3xl font-semibold text-ink">6 steps</p>
                <p className="mt-1 font-body text-xs text-ink-soft">From support to sustainability</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-surface">
        <div className="nd-shell py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-balance text-ink lg:col-span-5 lg:text-4xl">
              We don't hand out solutions. We build them together.
            </h2>
            <p className="font-body text-lg text-pretty text-ink-soft lg:col-span-7">
              New Day works alongside communities to create real, lasting opportunity. We start with
              support, add education and equipment, and stay until the work can grow and sustain
              itself — with dignity, transparency and local ownership at every step.
            </p>
          </div>
        </div>
      </section>

      {/* Our Work */}
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

      {/* Latest work */}
      <section className="bg-surface">
        <div className="nd-shell py-20 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-sans text-xs font-semibold tracking-[0.2em] text-amber-deep uppercase">
                Our Latest Work
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink lg:text-5xl">
                Projects on the ground
              </h2>
            </div>
            <Link to="/our-work" className="font-sans text-sm font-medium text-ink underline-offset-4 hover:underline">
              View all projects →
            </Link>
          </div>

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
            {filtered.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {filtered.length === 0 ? <EmptyNote>No projects in this category yet.</EmptyNote> : null}
        </div>
      </section>

      {/* Upcoming */}
      <section className="nd-shell py-20 lg:py-24">
        <p className="font-sans text-xs font-semibold tracking-[0.2em] text-amber-deep uppercase">
          What's Coming Next
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink lg:text-5xl">
          Upcoming activities
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((item) => (
            <UpcomingCard key={item.id} item={item} />
          ))}
        </div>
        {upcoming.length === 0 ? <EmptyNote>New activities will be announced soon.</EmptyNote> : null}
      </section>

      {/* Outreach */}
      <section className="bg-surface">
        <div className="nd-shell py-20 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-sans text-xs font-semibold tracking-[0.2em] text-amber-deep uppercase">
                Our Outreach
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink lg:text-5xl">
                Out in the community
              </h2>
            </div>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {outreach.slice(0, 3).map((item) => (
              <OutreachCard key={item.id} item={item} />
            ))}
          </div>
          {outreach.length === 0 ? <EmptyNote>Outreach activities will appear here.</EmptyNote> : null}
        </div>
      </section>

      {/* Impact */}
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

      {/* Story */}
      <section className="bg-surface">
        <div className="nd-shell grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-24">
          <img
            src="/images/story.jpg"
            alt="A New Day participant at work in their community"
            loading="lazy"
            width={1000}
            height={1000}
            className="aspect-square w-full rounded-[28px] object-cover"
          />
          <div>
            <p className="font-sans text-xs font-semibold tracking-[0.2em] text-amber-deep uppercase">
              A New Day Story
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance text-ink lg:text-5xl">
              Change begins with one person believing tomorrow can be different
            </h2>
            <p className="mt-6 font-body text-lg text-pretty text-ink-soft">
              Every project starts with a conversation, not a plan. We listen, learn what a community
              already has, and build from there — training, tools, mentorship and the space to grow.
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex rounded-full bg-ink px-6 py-3.5 font-sans text-sm font-medium text-paper transition-colors hover:bg-ink/85"
            >
              Read our story
            </Link>
          </div>
        </div>
      </section>

      <GetInvolvedGrid />
      <ContactSection />
    </SiteLayout>
  );
}
