# Setup Backend n8n — Voting Film OMK Lingkungan FX

Backend memakai **n8n @ sumopod** + **Google Sheets** sebagai database.
Dokumen ini memandu pembuatan 2 webhook sesuai `docs/api.md`.

> **Daftar film TIDAK di n8n.** Film hardcoded di `src/data/movies.ts` di frontend.
> n8n hanya menyimpan vote dan menghitung hasil. Frontend yang mencocokkan
> `movieId` → judul/poster dari data hardcoded.
> Tidak perlu sheet `Movies` — cukup **satu sheet `Votes`**.

## Ringkasan

| Endpoint | Method | Fungsi |
|---|---|---|
| `/webhook/voting/vote` | POST | Terima vote, simpan baris ke sheet `Votes` |
| `/webhook/voting/results` | GET | Hitung jumlah suara per `movieId` |

Semua respon wajib format `ApiResponse<T>`:
```json
{ "ok": true, "data": [...], "error": null }
```

---

## 1. Siapkan Google Sheets

Buat 1 spreadsheet (contoh nama: **Voting Film OMK FX**) berisi **satu sheet `Votes`**:

| id | movieId | voterName | createdAt |
|---|---|---|---|
| v-1 | cek-toko-sebelah | Budi | 2026-08-02T19:30:00.000Z |
| v-2 | yowis-ben | Anonim | 2026-08-02T19:31:00.000Z |

- Baris 1 = header persis sesuai nama kolom (tanpa spasi ekstra).
- Kolom `id` diisi workflow (bisa `v-<timestamp>`), bukan manual.

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

## 3. Workflow 1 — POST /vote

Node (urutan):
1. **Webhook**
   - HTTP Method: `POST`
   - Path: `voting/vote`
   - Respond: `Using Respond to Webhook node`
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

> Opsional validasi: tambah node **IF** setelah Webhook
> `{{ $json.body.movieId }}` tidak boleh kosong → kalau kosong, Respond status 400
> `{ "ok": false, "error": "movieId wajib diisi" }`.

---

## 4. Workflow 2 — GET /results

Node (urutan):
1. **Webhook** — GET, Path `voting/results`
2. **Google Sheets** — `Get Many Records` (sheet `Votes`)
3. **Code** — hitung suara per `movieId`
   ```js
   const votes = $input.all();
   const counts = {};
   for (const v of votes) {
     const id = v.json.movieId;
     counts[id] = (counts[id] || 0) + 1;
   }
   const data = Object.entries(counts)
     .map(([movieId, count]) => ({ movieId, count }))
     .sort((a, b) => b.count - a.count);
   return [{ json: { ok: true, data, error: null } }];
   ```
4. **Respond to Webhook** — JSON dengan body `{{ $json }}`

> Frontend mencocokkan `movieId` → judul/poster dari data hardcoded, jadi n8n
> tidak perlu mengirim `title`/`poster`.

---

## 5. Catatan & Konfigurasi

- Base URL frontend: `VITE_API_BASE=https://<instance>.sumopod.com/webhook`
  isi di `.env.local` (jangan commit).
  Endpoint lengkap: `https://<instance>.sumopod.com/webhook/voting/vote` dst.
- n8n webhook produksi memakai path `/webhook/...`. Untuk testing di editor n8n
  ada URL sementara `/webhook-test/...` — hanya berlaku saat workflow dibuka di editor.
- Aktifkan workflow dengan toggle **Active** setelah semua node tersambung.
- Uji dengan Postman / curl (lihat `docs/api.md` untuk contoh request/response).

## Checklist
- [ ] Spreadsheet dengan sheet `Votes` siap
- [ ] Credential Google Sheets OAuth terhubung
- [ ] Workflow POST `/vote` menambah baris di sheet `Votes`
- [ ] Workflow GET `/results` return rekap `[{ movieId, count }]`
- [ ] Semua workflow **Active**
- [ ] `VITE_API_BASE` benar di `.env.local` frontend
