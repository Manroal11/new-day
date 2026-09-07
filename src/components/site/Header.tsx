import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/our-work", label: "Our Work" },
  { to: "/impact", label: "Impact" },
  { to: "/updates", label: "Updates" },
  { to: "/get-involved", label: "Get Involved" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-full bg-amber">
        <span className="nd-floaty size-3.5 rounded-full bg-paper/90" />
      </span>
      <span className="font-sans text-lg font-semibold tracking-tight text-ink">New Day</span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="nd-shell flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 font-sans text-sm text-ink-soft lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-ink font-medium" }}
              className="transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/get-involved"
            className="hidden items-center rounded-full bg-ink px-5 py-2.5 font-sans text-sm font-medium text-paper transition-colors hover:bg-ink/85 lg:inline-flex"
          >
            Support New Day
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid size-9 place-items-center rounded-full border border-line text-ink lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-paper lg:hidden">
          <nav className="nd-shell flex flex-col gap-1 py-4 font-sans text-sm">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-ink font-medium" }}
                className="rounded-2xl px-3 py-2.5 text-ink-soft transition-colors hover:bg-surface"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/get-involved"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-ink px-5 py-3 text-center font-medium text-paper"
            >
              Support New Day
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
