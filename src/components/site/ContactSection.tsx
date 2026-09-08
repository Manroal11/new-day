import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(1, "Please add a message").max(1500),
});

export function ContactSection() {
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      subject: parsed.data.subject ?? "",
      message: parsed.data.message,
    });
    setBusy(false);
    if (error) {
      toast.error("Message not sent. Please try again.");
      return;
    }
    form.reset();
    toast.success("Thank you — we'll be in touch soon.");
  }

  const field =
    "w-full rounded-2xl bg-surface px-4 py-3 font-body text-sm text-ink ring-1 ring-line placeholder:text-ink-soft/60 focus:ring-2 focus:ring-amber focus:outline-none";

  return (
    <section id="contact" className="nd-shell py-20 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-amber-deep uppercase">
            Contact
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance text-ink lg:text-5xl">
            Let's start a conversation
          </h2>
          <p className="mt-5 max-w-[42ch] font-body text-lg text-pretty text-ink-soft">
            Questions, partnership ideas or an invitation to your community — we'd love to hear from
            you.
          </p>
        </div>
        <form className="grid gap-4 lg:col-span-7" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input id="name" name="name" required maxLength={100} placeholder="Your name" className={field} />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={255}
                placeholder="Email address"
                className={field}
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone
              </label>
              <input id="phone" name="phone" maxLength={40} placeholder="Phone (optional)" className={field} />
            </div>
            <div>
              <label htmlFor="subject" className="sr-only">
                Subject
              </label>
              <input id="subject" name="subject" maxLength={150} placeholder="Subject" className={field} />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="sr-only">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              maxLength={1500}
              placeholder="Your message"
              className={field}
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="justify-self-start rounded-full bg-amber px-6 py-3.5 font-sans text-sm font-medium text-paper transition-colors hover:bg-amber-deep disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
}
