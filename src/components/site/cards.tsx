import { Link } from "@tanstack/react-router";
import type { Activity, Announcement, Outreach, Project, Upcoming } from "@/lib/content";
import { formatDate } from "@/lib/content";

export function ActivityCard({ item }: { item: Activity }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[24px] bg-paper ring-1 ring-ink/5 transition-shadow duration-300 hover:shadow-[0_22px_50px_-28px_rgba(41,29,19,0.55)]">
      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          width={800}
          height={600}
          className="aspect-[4/3] w-full object-cover"
        />
      ) : (
        <div className="aspect-[4/3] w-full bg-surface" />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <Chip tone="leaf">{item.kind}</Chip>
          <StatusChip status={item.status} />
        </div>
        <h3 className="font-sans text-lg font-semibold text-ink">{item.title}</h3>
        <p className="mt-1 font-body text-xs text-ink-soft">
          {[item.location, formatDate(item.date)].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-3 font-body text-sm text-pretty text-ink-soft">{item.summary}</p>
        {item.kind === "Project" ? (
          <Link
            to="/projects/$slug"
            params={{ slug: item.slug }}
            className="mt-4 inline-flex font-sans text-sm font-medium text-amber-deep transition-colors hover:text-ink"
          >
            View more →
          </Link>
        ) : (
          <Link
            to="/outreach/$slug"
            params={{ slug: item.slug }}
            className="mt-4 inline-flex font-sans text-sm font-medium text-amber-deep transition-colors hover:text-ink"
          >
            View more →
          </Link>
        )}
      </div>
    </article>
  );
}

export function Chip({ children, tone = "amber" }: { children: string; tone?: "amber" | "leaf" | "ink" }) {
  const tones = {
    amber: "bg-amber/15 text-amber-deep",
    leaf: "bg-leaf/15 text-leaf",
    ink: "bg-ink/10 text-ink",
  } as const;
  return (
    <span className={`rounded-full px-3 py-1 font-sans text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function StatusChip({ status }: { status: string }) {
  return <Chip tone={status === "Completed" ? "leaf" : status === "In Progress" ? "ink" : "amber"}>{status}</Chip>;
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="overflow-hidden rounded-[24px] bg-paper ring-1 ring-ink/5 transition-shadow duration-300 hover:shadow-[0_22px_50px_-28px_rgba(41,29,19,0.55)]">
      {project.image_url ? (
        <img
          src={project.image_url}
          alt={project.title}
          loading="lazy"
          width={800}
          height={600}
          className="aspect-[4/3] w-full object-cover"
        />
      ) : (
        <div className="aspect-[4/3] w-full bg-surface" />
      )}
      <div className="p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <Chip tone="leaf">{project.category}</Chip>
          <StatusChip status={project.status} />
        </div>
        <h3 className="font-sans text-lg font-semibold text-ink">{project.title}</h3>
        <p className="mt-1 font-body text-xs text-ink-soft">
          {[project.location, formatDate(project.project_date)].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-3 font-body text-sm text-pretty text-ink-soft">{project.summary}</p>
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="mt-4 inline-flex font-sans text-sm font-medium text-amber-deep transition-colors hover:text-ink"
        >
          View project →
        </Link>
      </div>
    </article>
  );
}

export function OutreachCard({ item }: { item: Outreach }) {
  const photo = item.photos?.[0];
  return (
    <article className="overflow-hidden rounded-[24px] bg-paper ring-1 ring-ink/5 transition-shadow duration-300 hover:shadow-[0_22px_50px_-28px_rgba(41,29,19,0.55)]">
      {photo ? (
        <img
          src={photo}
          alt={item.title}
          loading="lazy"
          width={800}
          height={600}
          className="aspect-[4/3] w-full object-cover"
        />
      ) : null}
      <div className="p-5">
        <p className="font-body text-xs text-ink-soft">
          {[formatDate(item.activity_date), item.location].filter(Boolean).join(" · ")}
        </p>
        <h3 className="mt-2 font-sans text-lg font-semibold text-ink">{item.title}</h3>
        <p className="mt-2 font-body text-sm text-pretty text-ink-soft">{item.description}</p>
        {item.people_reached ? (
          <p className="mt-3 font-sans text-sm font-medium text-leaf">
            {item.people_reached} people reached
          </p>
        ) : null}
        <Link
          to="/outreach/$slug"
          params={{ slug: item.slug }}
          className="mt-4 inline-flex font-sans text-sm font-medium text-amber-deep transition-colors hover:text-ink"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}

export function AnnouncementCard({ item }: { item: Announcement }) {
  return (
    <article className="overflow-hidden rounded-[24px] bg-paper ring-1 ring-ink/5 transition-shadow duration-300 hover:shadow-[0_22px_50px_-28px_rgba(41,29,19,0.55)]">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.title}
          loading="lazy"
          width={800}
          height={600}
          className="aspect-[16/9] w-full object-cover"
        />
      ) : null}
      <div className="p-5">
        <p className="font-body text-xs text-ink-soft">{formatDate(item.publish_date)}</p>
        <h3 className="mt-2 font-sans text-lg font-semibold text-ink">{item.title}</h3>
        <p className="mt-2 font-body text-sm text-pretty text-ink-soft">{item.summary}</p>
        <Link
          to="/updates/$slug"
          params={{ slug: item.slug }}
          className="mt-4 inline-flex font-sans text-sm font-medium text-amber-deep transition-colors hover:text-ink"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}

export function UpcomingCard({ item }: { item: Upcoming }) {
  return (
    <div className="overflow-hidden rounded-[24px] bg-paper ring-1 ring-ink/5 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(41,29,19,0.5)]">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.title}
          loading="lazy"
          width={800}
          height={600}
          className="aspect-[16/9] w-full object-cover"
        />
      ) : null}
      <div className="p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="font-display text-2xl font-semibold text-ink">{item.expected_date}</span>
        <StatusChip status={item.status} />
      </div>
      {item.category ? (
        <div className="mt-3">
          <Chip tone="leaf">{item.category}</Chip>
        </div>
      ) : null}
      <h3 className="mt-4 font-sans text-lg font-semibold text-ink">{item.title}</h3>
      <p className="mt-1 font-body text-xs text-ink-soft">{item.location}</p>
      <p className="mt-3 font-body text-sm text-pretty text-ink-soft">{item.description}</p>
      {item.participation ? (
        <p className="mt-3 font-body text-sm text-pretty text-ink">
          <span className="font-sans font-semibold">How to take part: </span>
          {item.participation}
        </p>
      ) : null}
      </div>
    </div>
  );
}

export function EmptyNote({ children }: { children: string }) {
  return (
    <p className="rounded-[24px] bg-surface p-8 text-center font-body text-sm text-ink-soft">
      {children}
    </p>
  );
}
