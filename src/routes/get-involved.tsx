import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { ContactSection } from "@/components/site/ContactSection";

export const Route = createFileRoute("/get-involved")({
  head: () => ({
    meta: [
      { title: "Get Involved — Support New Day" },
      {
        name: "description",
        content:
          "Donate, volunteer, partner or support a specific New Day project and help build lasting opportunity with communities.",
      },
      { property: "og:title", content: "Get Involved — Support New Day" },
      {
        property: "og:description",
        content: "Four ways to help: donate, volunteer, partner or support a project.",
      },
      { property: "og:url", content: "/get-involved" },
    ],
    links: [{ rel: "canonical", href: "/get-involved" }],
  }),
  component: GetInvolved,
});

const WAYS = [
  {
    title: "Donate",
    text: "Your contribution funds training, tools and sustainable income projects. Contact us for details on how to give.",
  },
  {
    title: "Volunteer",
    text: "Teach, mentor, build or share professional expertise. Tell us what you can offer and where you are.",
  },
  {
    title: "Partner",
    text: "Organisations, schools and businesses can co-create programmes with us and share resources.",
  },
  {
    title: "Support a Project",
    text: "Back a specific initiative — a garden, a digital lab, a cooperative — from launch to sustainability.",
  },
];

function GetInvolved() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Get Involved"
        title="Be part of a new day"
        intro="Support looks different for everyone. Choose the way that fits you and send us a message — we'll take it from there."
      />

      <section className="nd-shell pb-20">
        <div className="grid gap-5 sm:grid-cols-2">
          {WAYS.map((way) => (
            <div key={way.title} className="nd-card p-8">
              <h2 className="font-display text-2xl font-semibold text-ink">{way.title}</h2>
              <p className="mt-3 font-body text-base text-pretty text-ink-soft">{way.text}</p>
              <a
                href="#contact"
                className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 font-sans text-sm font-medium text-paper transition-colors hover:bg-ink/85"
              >
                Get in touch
              </a>
            </div>
          ))}
        </div>
      </section>

      <ContactSection />
    </SiteLayout>
  );
}
