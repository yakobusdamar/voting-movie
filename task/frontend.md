# Task Frontend

> Rujuk `docs/design-system.md` (neobrutalism) & `docs/data-model.md` (tipe data).

## Setup
- [ ] Scaffold Vite (React + TS)
- [ ] Tailwind CSS + config (`tailwind.config.ts`)
- [ ] shadcn CLI: init + `components.json` (neobrutalism tweak)
- [ ] `src/lib/utils.ts` (cn)
- [ ] Struktur folder `src/{components,lib,data,hooks,pages,api}`

## Komponen (shadcn + kustom neobrutalism)
- [ ] `button`, `card`, `badge`, `input`, `select`, `progress`, `skeleton`, `alert`
- [ ] `MovieCard` (poster, judul, tahun, rating, badge platform)
- [ ] `RatingBadge` (tampilkan `7.4 IMDb`)
- [ ] `PlatformBadge` (badge per platform streaming: Netflix/Prime/Disney)
- [ ] `VoteBar` (progress bar hasil voting)

## Pages
- [ ] `Vote.tsx` — halaman utama `/`: pilih film + nama + submit
- [ ] `Movies.tsx` — daftar film `/movies` + rating + badge platform
- [ ] `MovieDetail.tsx` — detail film `/movies/:id`
- [ ] `Results.tsx` — papan hasil voting real-time

## State & Data
- [ ] Zustand store (movies, votes, status loading/error)
- [ ] `useMovies` hook
- [ ] `useVotes` hook
- [ ] Fallback `src/data/movies.ts` + banner "data lama"

## API
- [ ] `src/api/client.ts` (fetch ke `VITE_API_BASE`)
- [ ] Error state UI untuk tiap endpoint
- [ ] Timeout/abort fetch

## Routing
- [ ] react-router-dom: `/`, `/movies`, `/movies/:id`, `/results`
- [ ] SPA fallback index.html (untuk GitHub Pages)

## Kualitas
- [ ] `npm run typecheck` lolos
- [ ] `npm run lint` lolos
- [ ] Mobile-first (tap ≥ 44px, kontras WCAG AA)
