# Arsitektur & Alur Data

## Diagram

```
[ HP user ] --> GitHub Pages (static: React/Vite)
                    |
                    | fetch (vote & hasil saja)
                    v
            [ n8n webhook @ sumopod ]
               - endpoint vote  (POST /vote)
               - endpoint hasil (GET /results)
               - penyimpanan data (Google Sheets)
```

## Prinsip

- Frontend **100% static** di GitHub Pages — tanpa server sendiri.
- **Daftar film hardcoded** di `src/data/movies.ts` (dikelola manual/scraping oleh agent).
- Data voting + hasil hidup di **n8n sumopod** (Google Sheets).
- Frontend hanya memanggil webhook n8n untuk vote + hasil; **tidak ada secret/API key** di sisi frontend.
- Jika n8n offline → vote tersimpan lokal (localStorage) + banner "tersimpan lokal".

## Lapisan Frontend

| Lapisan | Lokasi | Peran |
|---|---|---|
| Pages | `src/pages/` | Vote (utama, pilih film), Movies (daftar), MovieDetail (detail), Results (papan hasil) |
| Components | `src/components/` | shadcn/ui + komponen kustom neobrutalism |
| Hooks | `src/hooks/` | `useMovies`, `useVotes` |
| API | `src/api/client.ts` | wrapper fetch ke webhook n8n (vote & hasil) |
| Data film | `src/data/movies.ts` | daftar film statis (hardcoded) |
| State | Zustand store | cache movies, status voting |

## Env

| Variable | Keterangan |
|---|---|
| `VITE_API_BASE` | Base URL webhook n8n (`.env.local`, jangan commit) |

## Konsistensi

- Bentuk respon API selalu `ApiResponse<T>` → `{ ok, data?, error? }`.
- Frontend menangani `error` sebagai UI error state yang jelas, bukan crash.
