import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="nd-shell pt-14 pb-10 lg:pt-20">
      <p className="font-sans text-xs font-semibold tracking-[0.2em] text-amber-deep uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance text-ink lg:text-5xl">
        {title}
      </h1>
      {intro ? (
        <p className="mt-5 max-w-[52ch] font-body text-lg text-pretty text-ink-soft">{intro}</p>
      ) : null}
    </section>
  );
}
