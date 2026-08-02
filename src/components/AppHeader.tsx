import { BarChart3, Popcorn, Ticket, Vote as VoteIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Vote", icon: VoteIcon, end: true },
  { to: "/movies", label: "Film", icon: Ticket },
  { to: "/results", label: "Hasil", icon: BarChart3 },
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b-2 border-neon-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-sm border-2 border-neon-border bg-primary shadow-neobrutal-sm">
            <Popcorn className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden font-extrabold leading-tight sm:block">
            Nonton Apa Besok?
          </span>
        </NavLink>

        <nav className="flex items-center gap-2" aria-label="Navigasi utama">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "inline-flex h-11 items-center gap-1.5 rounded-sm border-2 border-neon-border px-3 text-sm font-bold shadow-neobrutal-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                  isActive ? "bg-primary" : "bg-card hover:bg-muted",
                )
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
