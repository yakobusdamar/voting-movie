# Task Backend — n8n @ sumopod

> Rujuk `docs/api.md` (spec endpoint), `docs/data-model.md` (model data),
> dan **`docs/n8n-setup.md`** (panduan langkah demi langkah setup n8n + Google Sheets).
> Kredensial tidak pernah diletakkan di frontend/GitHub.
> Penyimpanan: **Google Sheets** (2 sheet: `Movies`, `Votes`).
> **Daftar film tidak lewat n8n** — hardcoded di `src/data/movies.ts` di frontend.

## Endpoint
- [ ] `POST /webhook/voting/vote` — submit vote
  - [ ] Body `{ movieId, voterName }`
  - [ ] Validasi `movieId` ada di sheet `Movies`
  - [ ] `voterName` opsional → default "Anonim"
  - [ ] Generate `id` + `createdAt` ISO di sisi n8n
  - [ ] Append baris ke sheet `Votes`
  - [ ] Return `ApiResponse<Vote>`
- [ ] `GET /webhook/voting/results` — rekap suara
  - [ ] Baca sheet `Votes`, hitung count per `movieId`
  - [ ] Join metadata dari sheet `Movies` (title, poster)
  - [ ] Return `[{ movieId, count, title?, poster? }]`

## Data
- [ ] Buat spreadsheet Google dengan sheet `Movies` + `Votes` (ikut template di `docs/n8n-setup.md`)
- [ ] Import daftar film (dari `src/data/movies.ts`) ke sheet `Movies`
- [ ] Verifikasi data film sesuai skema `Movie`

## Error Handling
- [ ] Response selalu `ApiResponse<T>` (`ok`, `data?`, `error?`)
- [ ] HTTP status sesuai (200, 400, 404, 500)
- [ ] Pesan error dalam Bahasa Indonesia yang jelas

## Pengujian
- [ ] Uji `GET /movies` (Postman / curl)
- [ ] Uji `POST /vote` (valid + invalid movieId)
- [ ] Uji `GET /results`
- [ ] Pastikan `VITE_API_BASE` di frontend mengarah ke instance yang benar
