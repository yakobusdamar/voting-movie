# API — Webhook n8n @ sumopod

## Base URL

`https://<instance>.sumopod.com/webhook/...`

> Diisi dari environment `VITE_API_BASE` (`.env.local`), bukan hardcode.

## Endpoint

| Endpoint | Method | Deskripsi | Request | Response |
|---|---|---|---|---|
| `/webhook/voting/vote` | POST | Submit vote | `{ movieId, voterName }` | `ApiResponse<Vote>` |
| `/webhook/voting/results` | GET | Rekap jumlah suara per film | — | `ApiResponse<ResultItem[]>` |

> **Daftar film tidak lewat API.** Film hardcoded di `src/data/movies.ts` di frontend.
> n8n hanya mengurusi vote + hasil (cukup satu sheet `Votes`).

## Bentuk Respon Standar

```ts
interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
```

## Contoh

### POST /vote → 200
```json
{
  "ok": true,
  "data": {
    "id": "v-20260802-001",
    "movieId": "warkop-dki-reborn",
    "voterName": "Budi",
    "createdAt": "2026-08-02T19:30:00.000Z"
  }
}
```

### POST /vote → 400 (movieId kosong)
```json
{ "ok": false, "error": "movieId wajib diisi" }
```

### GET /results → 200
```json
{
  "ok": true,
  "data": [
    { "movieId": "cek-toko-sebelah", "count": 5 },
    { "movieId": "yowis-ben", "count": 3 }
  ]
}
```

## Aturan di Sisi n8n

- `voterName` opsional (bisa kosong / default "Anonim").
- Simpan `createdAt` ISO datetime dari sisi n8n.
- `/results` mengembalikan agregasi `[{ movieId, count }]`. Frontend mencocokkan
  `movieId` → judul/poster dari data hardcoded (`src/data/movies.ts`).
