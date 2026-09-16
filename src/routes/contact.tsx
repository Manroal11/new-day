import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import { ContactSection } from "@/components/site/ContactSection";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact New Day — Talk With Our Team" },
      {
        name: "description",
        content:
          "Get in touch with New Day about projects, volunteering, partnerships or an invitation to your community.",
      },
      { property: "og:title", content: "Contact New Day — Talk With Our Team" },
      {
        property: "og:description",
        content: "Questions, ideas or partnerships — send the New Day team a message.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Contact"
        title="Let's start a conversation"
        intro="We read every message and reply as soon as we can."
      />
      <ContactSection />
    </SiteLayout>
  );
}
