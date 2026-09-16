import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Collection, type Field } from "@/components/admin/Collection";
import { Logo } from "@/components/site/Header";
import { CATEGORIES, STATUSES } from "@/lib/content";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Content Manager — New Day" },
      { name: "description", content: "Manage New Day website content." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Content Manager — New Day" },
      { property: "og:description", content: "Manage New Day website content." },
    ],
  }),
  component: Admin,
});

const projectFields: Field[] = [
  { name: "title", label: "Project title", type: "text", required: true },
  { name: "image_url", label: "Main photo", type: "image", help: "Upload one photo for this project." },
  { name: "location", label: "Location", type: "text" },
  { name: "project_date", label: "Date", type: "date" },
  { name: "category", label: "Category", type: "select", options: CATEGORIES },
  { name: "status", label: "Status", type: "select", options: STATUSES },
  { name: "summary", label: "Short description", type: "textarea", help: "Shown on cards — one or two sentences." },
  { name: "content", label: "Full story", type: "textarea", help: "Shown on the project page. One paragraph per line." },
  { name: "published", label: "Show on website", type: "checkbox" },
];

const outreachFields: Field[] = [
  { name: "title", label: "Activity title", type: "text", required: true },
  { name: "photos", label: "Photos", type: "images", help: "Add as many photos as you like." },
  { name: "location", label: "Location", type: "text" },
  { name: "activity_date", label: "Date", type: "date" },
  { name: "people_reached", label: "People reached", type: "number" },
  { name: "description", label: "Short description", type: "textarea" },
  { name: "content", label: "Full story", type: "textarea" },
  { name: "published", label: "Show on website", type: "checkbox" },
];

const announcementFields: Field[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "image_url", label: "Photo", type: "image" },
  { name: "publish_date", label: "Publish date", type: "date" },
  { name: "summary", label: "Short summary", type: "textarea" },
  { name: "content", label: "Full content", type: "textarea" },
  { name: "published", label: "Show on website", type: "checkbox" },
];

const upcomingFields: Field[] = [
  { name: "title", label: "Activity title", type: "text", required: true },
  { name: "image_url", label: "Photo (optional)", type: "image" },
  { name: "expected_date", label: "Planned date", type: "text", help: 'Free text, e.g. "October 2026".' },
  { name: "location", label: "Location", type: "text" },
  { name: "category", label: "Category", type: "select", options: CATEGORIES },
  { name: "status", label: "Status", type: "select", options: STATUSES },
  { name: "description", label: "Description", type: "textarea" },
  { name: "participation", label: "How people can take part", type: "textarea" },
  { name: "sort_order", label: "Order on the page", type: "number" },
  { name: "published", label: "Show on website", type: "checkbox" },
];

const impactFields: Field[] = [
  { name: "label", label: "What it measures", type: "text", required: true, help: 'e.g. "People Reached".' },
  { name: "value", label: "Number shown", type: "text", required: true, help: 'e.g. "500+".' },
  { name: "sort_order", label: "Order on the page", type: "number" },
];

const TABS = ["Projects", "Outreach", "Updates", "Upcoming", "Impact numbers"] as const;

function Admin() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Projects");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-line bg-paper">
        <div className="nd-shell flex h-16 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link to="/" className="font-sans text-sm text-ink-soft hover:text-ink">
              View website
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="rounded-full bg-ink px-4 py-2 font-sans text-sm font-medium text-paper hover:bg-ink/85"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="nd-shell py-10">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">Content manager</h1>
        <p className="mt-2 font-body text-base text-ink-soft">
          Everything you add here appears on the website straight away.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-full px-4 py-2 font-sans text-sm transition-colors ${
                tab === item ? "bg-ink text-paper" : "bg-paper text-ink-soft ring-1 ring-line hover:text-ink"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {tab === "Projects" ? (
            <Collection
              table="projects"
              queryKey="projects"
              title="Projects"
              description="Work you have delivered or are delivering now."
              fields={projectFields}
              orderBy={{ column: "created_at", ascending: false }}
            />
          ) : null}
          {tab === "Outreach" ? (
            <Collection
              table="outreach"
              queryKey="outreach"
              title="Outreach activities"
              description="Visits, workshops and sessions in the community."
              fields={outreachFields}
              orderBy={{ column: "created_at", ascending: false }}
            />
          ) : null}
          {tab === "Updates" ? (
            <Collection
              table="announcements"
              queryKey="announcements"
              title="Updates & announcements"
              description="News posts shown on the Updates page."
              fields={announcementFields}
              orderBy={{ column: "publish_date", ascending: false }}
            />
          ) : null}
          {tab === "Upcoming" ? (
            <Collection
              table="upcoming_activities"
              queryKey="upcoming_activities"
              title="Upcoming activities"
              description="What is planned next."
              fields={upcomingFields}
              orderBy={{ column: "sort_order" }}
            />
          ) : null}
          {tab === "Impact numbers" ? (
            <Collection
              table="impact_stats"
              queryKey="impact_stats"
              title="Impact numbers"
              description="The four figures shown on the homepage and Impact page."
              fields={impactFields}
              titleField="label"
              slugFrom={null}
              orderBy={{ column: "sort_order" }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
