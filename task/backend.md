# Task Backend — n8n @ sumopod

> Rujuk `docs/api.md` (spec endpoint), `docs/data-model.md` (model data),
> dan **`docs/n8n-setup.md`** (panduan langkah demi langkah setup n8n + Google Sheets).
> Kredensial tidak pernah diletakkan di frontend/GitHub.
> Penyimpanan: **Google Sheets** (cukup 1 sheet `Votes`).
> **Daftar film tidak di n8n** — hardcoded di `src/data/movies.ts` di frontend.

## Endpoint
- [ ] `POST /webhook/voting/vote` — submit vote
  - [ ] Body `{ movieId, voterName }`
  - [ ] `voterName` opsional → default "Anonim"
  - [ ] Generate `id` + `createdAt` ISO di sisi n8n
  - [ ] Append baris ke sheet `Votes`
  - [ ] Return `ApiResponse<Vote>`
- [ ] `GET /webhook/voting/results` — rekap suara
  - [ ] Baca sheet `Votes`, hitung count per `movieId`
  - [ ] Return `[{ movieId, count }]` (frontend cocokkan judul/poster dari hardcoded)

## Data
- [ ] Buat spreadsheet Google dengan sheet `Votes` (ikut template di `docs/n8n-setup.md`)

## Error Handling
- [ ] Response selalu `ApiResponse<T>` (`ok`, `data?`, `error?`)
- [ ] HTTP status sesuai (200, 400, 404, 500)
- [ ] Pesan error dalam Bahasa Indonesia yang jelas

## Pengujian
- [ ] Uji `GET /movies` (Postman / curl)
- [ ] Uji `POST /vote` (valid + invalid movieId)
- [ ] Uji `GET /results`
- [ ] Pastikan `VITE_API_BASE` di frontend mengarah ke instance yang benar
