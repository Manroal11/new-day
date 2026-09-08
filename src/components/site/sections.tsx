import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { impactQuery } from "@/lib/content";

export const WORK_AREAS = [
  {
    key: "Education",
    letter: "E",
    tone: "amber",
    text: "Knowledge and learning that help people make better decisions and open doors.",
  },
  {
    key: "Skills",
    letter: "S",
    tone: "amber",
    text: "Practical, vocational skills that lead to employment and entrepreneurship.",
  },
  {
    key: "Enterprise",
    letter: "B",
    tone: "amber",
    text: "Sustainable income-generating projects and businesses for communities.",
  },
  {
    key: "Digital",
    letter: "D",
    tone: "leaf",
    text: "Technology, digital skills and new economic opportunities for everyone.",
  },
  {
    key: "Community",
    letter: "C",
    tone: "leaf",
    text: "Initiatives that strengthen food security, livelihoods and resilience.",
  },
] as const;

export function WorkAreas() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {WORK_AREAS.map((area) => (
        <div key={area.key} className="nd-card p-6">
          <span
            className={`grid size-11 place-items-center rounded-[14px] font-sans font-semibold ${
              area.tone === "amber" ? "bg-amber/15 text-amber-deep" : "bg-leaf/15 text-leaf"
            }`}
          >
            {area.letter}
          </span>
          <h3 className="mt-5 font-sans text-lg font-semibold text-ink">{area.key}</h3>
          <p className="mt-2 max-w-[28ch] font-body text-sm text-pretty text-ink-soft">{area.text}</p>
        </div>
      ))}
      <Link to="/our-work" className="group flex flex-col justify-between rounded-[24px] bg-ink p-6 text-paper">
        <p className="font-sans text-xs font-semibold tracking-[0.15em] text-paper/60 uppercase">Explore</p>
        <div>
          <p className="font-display text-2xl font-semibold">See it in action</p>
          <p className="mt-3 font-sans text-sm text-paper/70 transition-colors group-hover:text-paper">
            View all work →
          </p>
        </div>
      </Link>
    </div>
  );
}

export function ImpactStats() {
  const { data: stats = [] } = useQuery(impactQuery);

  return (
    <>
      <div className="mt-12 grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.id}>
            <p className="font-display text-5xl font-semibold tracking-tight text-amber-deep lg:text-6xl">
              {stat.value}
            </p>
            <p className="mt-2 font-sans text-sm font-medium text-ink">{stat.label}</p>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-12 max-w-[52ch] text-center font-body text-base text-pretty text-ink-soft">
        Every number represents a person, a skill gained, an opportunity created, or a community
        taking another step toward sustainability.
      </p>
    </>
  );
}

export function GetInvolvedGrid() {
  const options = [
    { title: "Donate", text: "Help support sustainable projects and programs.", cta: "Give today" },
    { title: "Volunteer", text: "Share your skills, time and experience.", cta: "Join a team" },
    { title: "Partner", text: "Work with New Day to create meaningful impact.", cta: "Start a dialogue" },
    { title: "Support a Project", text: "Fund or resource a specific initiative.", cta: "Browse projects" },
  ];

  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="absolute -top-24 -right-16 size-72 rounded-full bg-amber/25 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-leaf/20 blur-3xl" />
      <div className="nd-shell relative py-20 lg:py-24">
        <div className="text-center">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-amber uppercase">
            Be Part of a New Day
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-balance text-paper lg:text-5xl">
            Four ways to build a better future
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {options.map((option) => (
            <div key={option.title} className="rounded-[22px] bg-paper/[0.06] p-6 ring-1 ring-paper/10">
              <p className="font-sans text-lg font-semibold text-paper">{option.title}</p>
              <p className="mt-2 font-body text-sm text-pretty text-paper/60">{option.text}</p>
              <Link
                to="/get-involved"
                className="mt-5 inline-flex font-sans text-sm font-medium text-amber transition-colors hover:text-paper"
              >
                {option.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
