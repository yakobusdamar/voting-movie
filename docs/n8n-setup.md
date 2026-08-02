# Setup Backend n8n — Voting Film OMK Lingkungan FX

Backend memakai **n8n @ sumopod** + **Google Sheets** sebagai database.
Dokumen ini memandu pembuatan 3 webhook sesuai `docs/api.md`.

## Ringkasan

| Endpoint | Method | Fungsi |
|---|---|---|
| `/webhook/voting/movies` | GET | Kirim daftar film dari sheet `Movies` |
| `/webhook/voting/vote` | POST | Terima vote, simpan baris ke sheet `Votes` |
| `/webhook/voting/results` | GET | Rekap jumlah suara per film |

Semua respon wajib format `ApiResponse<T>`:
```json
{ "ok": true, "data": [...], "error": null }
```

---

## 1. Siapkan Google Sheets

Buat 1 spreadsheet baru (contoh nama: **Voting Film OMK FX**) berisi 2 sheet:

### Sheet `Movies`
| id | title | year | genre | platforms | verifiedAt | imdb | local | poster | synopsis |
|---|---|---|---|---|---|---|---|---|---|
| warkop-dki-reborn | Warkop DKI Reborn: Jangkrik Boss! | 2016 | Komedi | netflix, prime-video | 2026-08-02 | 6.6 | 6.9 |  | Donny, Kasino... |
| cek-toko-sebelah | Cek Toko Sebelah | 2016 | Komedi, Drama | netflix | 2026-08-02 | 7.2 | 8.0 |  | Erwin, manajer... |

> `platforms` dipisah koma: `netflix, prime-video`. `genre` juga dipisah koma.
> Bisa diisi dari `src/data/movies.ts` di repo.

### Sheet `Votes`
| id | movieId | voterName | createdAt |
|---|---|---|---|
| v-1 | cek-toko-sebelah | Budi | 2026-08-02T19:30:00.000Z |
| v-2 | yowis-ben | Anonim | 2026-08-02T19:31:00.000Z |

> Kolom `id` diisi workflow (bisa `v-<timestamp>`), bukan manual.

### Catatan header
- Baris 1 = header persis sesuai nama kolom di atas.
- Jangan beri spasi ekstra / huruf kapital berbeda — n8n mencocokkan nama kolom.

---

## 2. Koneksikan Google Sheets ke n8n

1. Di n8n: **Credentials → Add credential → Google Sheets**.
2. Pilih **OAuth2** → **Sign in with Google**.
3. Login akun yang punya akses spreadsheet, beri izin.
4. Simpan credential (misal nama: `Google Sheets OMK`).
5. Siapkan **Spreadsheet ID**:
   - Buka spreadsheet → URL-nya seperti
     `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`
   - Copy bagian `<SPREADSHEET_ID>`.

---

## 3. Workflow 1 — GET /movies

Node (urutan):
1. **Webhook**
   - HTTP Method: `GET`
   - Path: `voting/movies`
   - Respond: `Using Respond to Webhook node`
2. **Google Sheets** — operation `Get Many Records` (sheet `Movies`)
   - Credential: Google Sheets OMK
   - Spreadsheet ID: `<SPREADSHEET_ID>`
   - Sheet: `Movies`
3. **Code** — format respon
   ```js
   const rows = $input.all();
   const movies = rows.map((r) => ({
     id: r.json.id,
     title: r.json.title,
     year: Number(r.json.year),
     genre: String(r.json.genre || "").split(",").map((g) => g.trim()).filter(Boolean),
     platforms: String(r.json.platforms || "").split(",").map((p) => p.trim()).filter(Boolean),
     verifiedAt: r.json.verifiedAt,
     ratings: {
       imdb: r.json.imdb ? Number(r.json.imdb) : undefined,
       local: r.json.local ? Number(r.json.local) : undefined,
     },
     poster: r.json.poster || undefined,
     synopsis: r.json.synopsis || undefined,
   }));
   return [{ json: { ok: true, data: movies, error: null } }];
   ```
4. **Respond to Webhook**
   - Respond With: `JSON`
   - Response Body: ekspresi `{{ $json }}`
   - Content Type: `application/json`

---

## 4. Workflow 2 — POST /vote

Node (urutan):
1. **Webhook**
   - HTTP Method: `POST`
   - Path: `voting/vote`
   - Respond: `Using Respond to Webhook node`
   - (Opsional) Add Validation: `{{ $json.movieId }}` non-empty
2. **Code** — siapkan baris baru
   ```js
   const body = $input.first().json.body || {};
   const movieId = String(body.movieId || "").trim();
   const voterName = String(body.voterName || "").trim() || "Anonim";
   const id = "v-" + Date.now();
   const createdAt = new Date().toISOString();
   return [{ json: { id, movieId, voterName, createdAt } }];
   ```
3. **Google Sheets** — operation `Append Row` (sheet `Votes`)
   - Credential: Google Sheets OMK
   - Spreadsheet ID: `<SPREADSHEET_ID>`
   - Sheet: `Votes`
   - Options → Fields to Send: `All Fields`
   - (Default) otomatis memetakan `id`, `movieId`, `voterName`, `createdAt` dari item input
4. **Respond to Webhook**
   - Respond With: `JSON`
   - Response Body:
     ```json
     { "ok": true, "data": { "id": "{{ $('Code').item.json.id }}", "movieId": "{{ $('Code').item.json.movieId }}", "voterName": "{{ $('Code').item.json.voterName }}", "createdAt": "{{ $('Code').item.json.createdAt }}" }, "error": null }
     ```
   - Content Type: `application/json`

> **Validasi movieId**: untuk ketat, tambah Google Sheets `Get Many Records` (sheet Movies)
> → filter `id == movieId` → kalau kosong, Respond dengan
> `{ "ok": false, "error": "movieId tidak ditemukan di daftar film" }` (status 400).

---

## 5. Workflow 3 — GET /results

Node (urutan):
1. **Webhook** — GET, Path `voting/results`
2. **Google Sheets** — `Get Many Records` (sheet `Votes`)
3. **Google Sheets** — `Get Many Records` (sheet `Movies`)
4. **Code** — agregasi + join
   ```js
   const votes = $("Google Sheets").first().all();
   const movies = $("Google Sheets").all().at(1).all();
   const counts = {};
   for (const v of votes) {
     const id = v.json.movieId;
     counts[id] = (counts[id] || 0) + 1;
   }
   const titleMap = {};
   const posterMap = {};
   for (const m of movies) {
     titleMap[m.json.id] = m.json.title;
     posterMap[m.json.id] = m.json.poster;
   }
   const data = Object.entries(counts)
     .map(([movieId, count]) => ({
       movieId,
       count,
       title: titleMap[movieId],
       poster: posterMap[movieId],
     }))
     .sort((a, b) => b.count - a.count);
   return [{ json: { ok: true, data, error: null } }];
   ```
5. **Respond to Webhook** — JSON dengan body `{{ $json }}`

---

## 6. Catatan & Konfigurasi

- Base URL frontend: `VITE_API_BASE=https://<instance>.sumopod.com/webhook`
  isi di `.env.local` (jangan commit).
  Endpoint lengkap: `https://<instance>.sumopod.com/webhook/voting/movies` dst.
- n8n webhook produksi memakai path `/webhook/...`. Untuk testing di editor n8n
  ada URL sementara `/webhook-test/...` — hanya berlaku saat workflow dibuka di editor.
- Aktifkan workflow dengan toggle **Active** setelah semua node tersambung.
- Uji dengan Postman / curl (lihat `docs/api.md` untuk contoh request/response).

## Checklist
- [ ] Spreadsheet 2 sheet (`Movies`, `Votes`) siap
- [ ] Credential Google Sheets OAuth terhubung
- [ ] Workflow GET `/movies` berhasil return `{ ok: true, data: [...] }`
- [ ] Workflow POST `/vote` menambah baris di sheet `Votes`
- [ ] Workflow GET `/results` return rekap `{ movieId, count, title, poster }`
- [ ] Semua workflow **Active**
- [ ] `VITE_API_BASE` benar di `.env.local` frontend
