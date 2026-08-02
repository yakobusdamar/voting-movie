# Model Data

## Movie

```ts
type StreamingPlatform = "netflix" | "prime-video" | "disney-plus";

interface Movie {
  id: string;            // slug unik, misal "warkop-dki-reborn"
  title: string;         // judul film
  year: number;
  genre: string[];       // contoh: ["Komedi"]
  platforms: StreamingPlatform[];  // ["netflix"] | ["prime-video"] | ["disney-plus"] | kombinasi
  verifiedAt: string;    // tanggal cek ketersediaan, ISO date
  ratings: {
    imdb?: number;       // 0-10, 1 desimal
    local?: number;      // rating lokal/penonton, opsional
  };
  poster?: string;       // URL poster (hindari hotlink bermasalah)
  synopsis?: string;     // sinopsis singkat
}
```

### Catatan

- `id` = slug, dipakai sebagai referensi vote.
- `platforms` = daftar platform tempat film **sedang tersedia** (minimal 1).
- `verifiedAt` wajib diisi saat film diverifikasi/diperbarui.

## Vote

```ts
interface Vote {
  id: string;
  movieId: string;       // merujuk Movie.id
  voterName: string;     // nama peserta OMK (opsional / bisa alias)
  createdAt: string;     // ISO datetime
}
```

## ApiResponse

```ts
interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
```

## ResultItem (dari /results)

```ts
interface ResultItem {
  movieId: string;
  count: number;
  title?: string;        // metadata film (agar frontend tidak double-fetch)
  poster?: string;
}
```
