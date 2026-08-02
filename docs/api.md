# API — Webhook n8n @ sumopod

## Base URL

`https://<instance>.sumopod.com/webhook/...`

> Diisi dari environment `VITE_API_BASE` (`.env.local`), bukan hardcode.

## Endpoint

| Endpoint | Method | Deskripsi | Request | Response |
|---|---|---|---|---|
| `/webhook/voting/movies` | GET | Daftar film komedi Indonesia tersedia di platform streaming + rating | — | `ApiResponse<Movie[]>` |
| `/webhook/voting/vote` | POST | Submit vote | `{ movieId, voterName }` | `ApiResponse<Vote>` |
| `/webhook/voting/results` | GET | Rekap jumlah suara per film | — | `ApiResponse<ResultItem[]>` |

## Bentuk Respon Standar

```ts
interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
```

## Contoh

### GET /movies → 200
```json
{
  "ok": true,
  "data": [
    {
      "id": "warkop-dki-reborn",
      "title": "Warkop DKI Reborn: Jangkrik Boss! Part 1",
      "year": 2016,
      "genre": ["Komedi"],
      "platforms": ["netflix", "prime-video"],
      "verifiedAt": "2026-08-02",
      "ratings": { "imdb": 6.6 }
    }
  ]
}
```

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

### POST /vote → 400 (film tidak valid)
```json
{ "ok": false, "error": "movieId tidak ditemukan di daftar film" }
```

## Aturan di Sisi n8n

- Validasi `movieId` harus ada di daftar film.
- `voterName` opsional (bisa kosong / default "Anonim").
- Simpan `createdAt` ISO datetime dari sisi n8n.
- `/results` mengembalikan agregasi `[{ movieId, count }]` beserta metadata film (title, poster) agar frontend tidak perlu double-fetch.
