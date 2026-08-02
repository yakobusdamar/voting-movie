# Task Konten Film

> Hanya **film komedi Indonesia** yang **sedang tersedia (available)** di salah satu platform:
> **Netflix**, **Prime Video**, atau **Disney+ Hotstar**.
> Setiap film **wajib punya rating** (IMDb; boleh + rating lokal).
> Verifikasi ketersediaan di masing-masing platform → catat tanggal di `verifiedAt`.

## Platform Streaming

| id | Platform |
|---|---|
| `netflix` | Netflix |
| `prime-video` | Prime Video |
| `disney-plus` | Disney+ Hotstar |

## Proses Per Film
- [ ] Pilih film komedi Indonesia kandidat
- [ ] Cek ketersediaan di tiap platform (Netflix/Prime Video/Disney+ Hotstar)
- [ ] Isi `platforms: StreamingPlatform[]` (minimal 1, boleh kombinasi)
- [ ] Catat `verifiedAt` (tanggal pengecekan)
- [ ] Kumpulkan rating IMDb (1 desimal)
- [ ] Kumpulkan rating lokal bila ada (opsional)
- [ ] Ambil poster stabil (atau simpan di `public/posters/`)
- [ ] Tulis sinopsis singkat (opsional)
- [ ] Update fallback `src/data/movies.ts` + data n8n

## Daftar Film (isi seiring verifikasi)
> Format: `- [ ] Judul (tahun) | IMDb: x.x | Platforms: netflix, prime-video | verifiedAt: YYYY-MM-DD`

- [ ] *(isi di sini)*

## Checklist
- [ ] Semua film di daftar **available** di minimal satu platform (di-verify)
- [ ] Semua film punya rating
- [ ] `verifiedAt` terisi untuk semua film
- [ ] Fallback statis sinkron dengan data n8n
