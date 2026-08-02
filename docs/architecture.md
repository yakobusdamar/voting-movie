# Arsitektur & Alur Data

## Diagram

```
[ HP user ] --> GitHub Pages (static: React/Vite)
                    |
                    | fetch
                    v
            [ n8n webhook @ sumopod ]
               - endpoint film  (GET /movies)
               - endpoint vote  (POST /vote)
               - endpoint hasil (GET /results)
               - penyimpanan data (built-in n8n / DB)
```

## Prinsip

- Frontend **100% static** di GitHub Pages — tanpa server sendiri.
- Semua data (daftar film + hasil voting) hidup di **n8n sumopod**.
- Frontend hanya memanggil webhook n8n; **tidak ada secret/API key** di sisi frontend.
- Jika n8n offline → fallback ke data statis (`src/data/movies.ts`) + banner "data lama".

## Lapisan Frontend

| Lapisan | Lokasi | Peran |
|---|---|---|
| Pages | `src/pages/` | Vote (utama, pilih film), Movies (daftar), MovieDetail (detail), Results (papan hasil) |
| Components | `src/components/` | shadcn/ui + komponen kustom neobrutalism |
| Hooks | `src/hooks/` | `useMovies`, `useVotes` |
| API | `src/api/client.ts` | wrapper fetch ke webhook n8n |
| Data fallback | `src/data/movies.ts` | daftar film statis saat n8n offline |
| State | Zustand store | cache movies, status voting |

## Env

| Variable | Keterangan |
|---|---|
| `VITE_API_BASE` | Base URL webhook n8n (`.env.local`, jangan commit) |

## Konsistensi

- Bentuk respon API selalu `ApiResponse<T>` → `{ ok, data?, error? }`.
- Frontend menangani `error` sebagai UI error state yang jelas, bukan crash.
