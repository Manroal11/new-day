import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const CATEGORIES = ["Education", "Skills", "Enterprise", "Digital", "Community"] as const;
export const STATUSES = ["Planning", "Upcoming", "In Progress", "Completed"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Status = (typeof STATUSES)[number];

export type Project = {
  id: string;
  title: string;
  slug: string;
  location: string;
  project_date: string | null;
  summary: string;
  content: string;
  category: string;
  status: string;
  image_url: string | null;
  featured: boolean;
  published: boolean;
};

export type Outreach = {
  id: string;
  title: string;
  slug: string;
  location: string;
  activity_date: string | null;
  description: string;
  content: string;
  people_reached: number | null;
  photos: string[];
  published: boolean;
};

export type Announcement = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image_url: string | null;
  publish_date: string;
  published: boolean;
};

export type Upcoming = {
  id: string;
  title: string;
  slug: string;
  location: string;
  expected_date: string;
  description: string;
  participation: string;
  status: string;
  category: string;
  image_url: string | null;
  sort_order: number;
  published: boolean;
};

export type ImpactStat = {
  id: string;
  label: string;
  value: string;
  sort_order: number;
};

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return (result.data ?? []) as T;
}

export const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: async () =>
    unwrap<Project[]>(
      await supabase
        .from("projects")
        .select("*")
        .order("project_date", { ascending: false, nullsFirst: false }),
    ),
});

export const outreachQuery = queryOptions({
  queryKey: ["outreach"],
  queryFn: async () =>
    unwrap<Outreach[]>(
      await supabase
        .from("outreach")
        .select("*")
        .order("activity_date", { ascending: false, nullsFirst: false }),
    ),
});

export const announcementsQuery = queryOptions({
  queryKey: ["announcements"],
  queryFn: async () =>
    unwrap<Announcement[]>(
      await supabase.from("announcements").select("*").order("publish_date", { ascending: false }),
    ),
});

export const upcomingQuery = queryOptions({
  queryKey: ["upcoming_activities"],
  queryFn: async () =>
    unwrap<Upcoming[]>(
      await supabase.from("upcoming_activities").select("*").order("sort_order"),
    ),
});

export const impactQuery = queryOptions({
  queryKey: ["impact_stats"],
  queryFn: async () =>
    unwrap<ImpactStat[]>(await supabase.from("impact_stats").select("*").order("sort_order")),
});

export function formatDate(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric", day: "numeric" });
}

/** A project or an outreach activity, shown in one combined list. */
export type Activity = {
  id: string;
  kind: "Project" | "Outreach";
  title: string;
  slug: string;
  location: string;
  date: string | null;
  summary: string;
  status: string;
  category: string;
  image: string | null;
};

export function toActivities(projects: Project[], outreach: Outreach[]): Activity[] {
  const fromProjects: Activity[] = projects.map((p) => ({
    id: p.id,
    kind: "Project",
    title: p.title,
    slug: p.slug,
    location: p.location,
    date: p.project_date,
    summary: p.summary,
    status: p.status,
    category: p.category,
    image: p.image_url,
  }));
  const fromOutreach: Activity[] = outreach.map((o) => ({
    id: o.id,
    kind: "Outreach",
    title: o.title,
    slug: o.slug,
    location: o.location,
    date: o.activity_date,
    summary: o.description,
    status: "Completed",
    category: "Community",
    image: o.photos?.[0] ?? null,
  }));
  return [...fromProjects, ...fromOutreach].sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  );
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
