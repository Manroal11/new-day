import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "./Header";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/our-work", label: "Our Work" },
  { to: "/impact", label: "Impact" },
  { to: "/updates", label: "Updates" },
  { to: "/get-involved", label: "Get Involved" },
] as const;

export function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function subscribe(event: React.FormEvent) {
    event.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 255) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: value });
    setBusy(false);
    if (error && !error.message.includes("duplicate")) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setEmail("");
    toast.success("Thank you — you're on the list.");
  }

  return (
    <footer className="bg-paper">
      <div className="nd-shell py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-4 font-body text-sm text-ink-soft">
              Empowering People. Building Futures. Learn. Build. Grow. Sustain.
            </p>
          </div>
          <div className="lg:col-span-3">
            <p className="font-sans text-sm font-semibold text-ink">Quick links</p>
            <ul className="mt-4 space-y-2.5 font-body text-sm text-ink-soft">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            <p className="font-sans text-sm font-semibold text-ink">Stay Connected</p>
            <p className="mt-2 font-body text-sm text-ink-soft">
              Receive updates about New Day projects, outreach and opportunities.
            </p>
            <form className="mt-4 flex gap-2" onSubmit={subscribe}>
              <label htmlFor="newsletter-email" className="sr-only">
                Your email
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 rounded-full bg-surface px-5 py-3 font-body text-sm text-ink ring-1 ring-line placeholder:text-ink-soft/60 focus:ring-2 focus:ring-amber focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-amber px-5 py-3 font-sans text-sm font-medium text-paper transition-colors hover:bg-amber-deep disabled:opacity-60"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 font-body text-xs text-ink-soft">
          <p>© 2026 New Day. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="https://instagram.com" className="transition-colors hover:text-ink">
              Instagram
            </a>
            <a href="https://linkedin.com" className="transition-colors hover:text-ink">
              LinkedIn
            </a>
            <a href="https://facebook.com" className="transition-colors hover:text-ink">
              Facebook
            </a>
            <Link to="/auth" className="transition-colors hover:text-ink">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
