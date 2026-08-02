# Task Backend — n8n @ sumopod

> Rujuk `docs/api.md` (spec endpoint) & `docs/data-model.md` (model data).
> Kredensial tidak pernah diletakkan di frontend/GitHub.

## Endpoint
- [ ] `GET /webhook/voting/movies` — daftar film
  - [ ] Return `ApiResponse<Movie[]>`
- [ ] `POST /webhook/voting/vote` — submit vote
  - [ ] Body `{ movieId, voterName }`
  - [ ] Validasi `movieId` ada di daftar film
  - [ ] `voterName` opsional → default "Anonim"
  - [ ] Simpan `createdAt` ISO dari sisi n8n
  - [ ] Return `ApiResponse<Vote>`
- [ ] `GET /webhook/voting/results` — rekap suara
  - [ ] Return `[{ movieId, count, title?, poster? }]`
  - [ ] Sertakan metadata film (biar frontend tidak double-fetch)

## Data
- [ ] Buat struktur penyimpanan (built-in n8n / DB internal)
- [ ] Import daftar film (dari `docs` / `src/data/movies.ts`)
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
