# Roadmap — Voting Film OMK Lingkungan FX

> Task list menggunakan checkbox. Centang saat selesai.
> Detail teknis rujuk ke `docs/*`.

## Fase 0 — Setup Proyek
- [ ] Inisialisasi repo git + remote GitHub
- [ ] Scaffold Vite (React + TS)
- [ ] Setup Tailwind CSS + shadcn/ui (neobrutalism theme)
- [ ] Setup router (react-router-dom): `/`, `/movies`, `/movies/:id`, `/results`
- [ ] Setup Zustand store
- [ ] Setup env (`VITE_API_BASE`), buat `.env.example`
- [ ] Setup lint + typecheck (`npm run lint`, `npm run typecheck`)

## Fase 1 — Data Film
- [ ] Kumpulkan daftar film komedi Indonesia (kandidat)
- [ ] Verifikasi ketersediaan di platform (Netflix/Prime Video/Disney+ Hotstar, catat `verifiedAt`)
- [ ] Kumpulkan rating IMDb / lokal per film
- [ ] Susun fallback data statis `src/data/movies.ts`
- [ ] Siapkan skema JSON untuk impor ke n8n

## Fase 2 — Backend n8n @ sumopod
- [ ] Buat webhook `GET /webhook/voting/movies`
- [ ] Buat webhook `POST /webhook/voting/vote`
- [ ] Buat webhook `GET /webhook/voting/results`
- [ ] Isi database n8n dengan daftar film
- [ ] Validasi: movieId harus ada, voterName opsional
- [ ] Uji semua endpoint (Postman / curl)

## Fase 3 — Frontend
- [ ] Page Vote (utama `/`): pilih film + nama + submit vote
- [ ] Page Movies (`/movies`): daftar film + rating + badge platform
- [ ] Page MovieDetail (`/movies/:id`): detail + info platform
- [ ] Page Results: papan hasil voting (progress bar)
- [ ] Komponen neobrutalism: MovieCard, RatingBadge, PlatformBadge, VoteBar
- [ ] Hooks: `useMovies`, `useVotes`
- [ ] API client (`src/api/client.ts`) dengan error handling
- [ ] Fallback data statis + banner "data lama" saat n8n offline

## Fase 4 — Deploy
- [ ] Buat workflow GitHub Actions → GitHub Pages
- [ ] Atur `base` path di `vite.config.ts`
- [ ] SPA fallback ke index.html
- [ ] Deploy pertama + verifikasi di browser
- [ ] Cek mobile-first & aksesibilitas (tap ≥ 44px, kontras)

## Fase 5 — Peluncuran
- [ ] Tes bersama anggota OMK (voting + lihat hasil)
- [ ] Perbaiki bug temuan
- [ ] Dokumentasikan cara update film
