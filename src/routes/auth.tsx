import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Header";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Team Sign In — New Day" },
      { name: "description", content: "Sign in to manage New Day website content." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Team Sign In — New Day" },
      { property: "og:description", content: "Content management access for the New Day team." },
      { property: "og:url", content: "/auth" },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      navigate({ to: "/admin", replace: true });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + "/admin" },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      navigate({ to: "/admin", replace: true });
    } else {
      toast.success("Check your email to confirm your account.");
    }
  }

  const field =
    "w-full rounded-2xl bg-surface px-4 py-3 font-body text-sm text-ink ring-1 ring-line focus:ring-2 focus:ring-amber focus:outline-none";

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-5">
      <div className="w-full max-w-sm">
        <Logo />
        <h1 className="mt-8 font-display text-3xl font-semibold tracking-tight text-ink">
          {mode === "signin" ? "Team sign in" : "Create your account"}
        </h1>
        <p className="mt-2 font-body text-sm text-ink-soft">
          Manage projects, outreach, updates and impact numbers.
        </p>
        <form className="mt-8 grid gap-3" onSubmit={submit}>
          <label htmlFor="email" className="font-sans text-sm text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
          />
          <label htmlFor="password" className="mt-2 font-sans text-sm text-ink">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={field}
          />
          <button
            type="submit"
            disabled={busy}
            className="mt-4 rounded-full bg-ink px-6 py-3.5 font-sans text-sm font-medium text-paper transition-colors hover:bg-ink/85 disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-5 font-sans text-sm text-amber-deep hover:text-ink"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
        <div className="mt-8">
          <Link to="/" className="font-sans text-sm text-ink-soft hover:text-ink">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
