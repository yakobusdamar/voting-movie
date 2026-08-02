# AGENTS.md — Aplikasi Voting Film OMK Lingkungan FX

## Ringkasan Proyek

Mobile web app untuk voting "mau nonton apa besok" di kegiatan **OMK Lingkungan FX**.
Anggota memilih satu film dari daftar **film komedi Indonesia** yang tersedia di salah satu
platform streaming (Netflix, Prime Video, Disney+ Hotstar), masing-masing disertai **score rating**
(IMDb dan/atau rating lain). Hasil voting ditampilkan real-time. Aplikasi di-publish ke
**GitHub Pages**. Backend berupa webhook **n8n** yang di-hosting di **sumopod** (bertindak sebagai
API + database).

## Batasan & Aturan Penting

- **Konten film**: hanya film komedi Indonesia yang **sedang tersedia (available)** di salah satu
  platform: **Netflix**, **Prime Video**, atau **Disney+ Hotstar**. Jangan tambahkan film yang tidak
  ada di platform tersebut.
- **Rating**: tiap film wajib punya score rating (sumber utama IMDb; boleh ditambah rating lokal seperti
  Film Indonesia ratings bila tersedia).
- **Verifikasi ketersediaan**: sebelum menambahkan/memperbarui daftar film, cek ketersediaan di
  masing-masing platform. Tandai tanggal terakhir diverifikasi.
- **Bahasa UI**: Bahasa Indonesia (casual, sesuai konteks OMK). Tidak wajib bahasa Inggris.
- **Target perangkat**: mobile-first. Desktop tetap rapi tapi prioritas pengalaman di HP.
- **Urutan halaman**: halaman utama (`/`) adalah **Vote**. Daftar film di `/movies`, detail film di
  `/movies/:id`, hasil voting di `/results`.

## Tech Stack

| Lapisan | Pilihan |
|---|---|
| Framework | React + Vite + TypeScript |
| Styling | Tailwind CSS + **shadcn/ui dengan tema neobrutalism (kustomisasi)** |
| Routing | react-router-dom |
| State (client) | Zustand |
| HTTP | fetch / axios ke webhook n8n |
| Deploy | GitHub Actions → GitHub Pages |
| Backend | n8n webhook di `sumopod` (menggantikan API + database) |

> Catatan: pakai tweak dari shadcn/ui neobrutalism (border tebal, shadow keras, warna solid).
> Jangan memakai tema bawaan shadcn yang default; yang dipakai varian neobrutalism.

## Arsitektur & Alur Data

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

- Frontend 100% static di GitHub Pages (tanpa server sendiri).
- **Daftar film hardcoded** di `src/data/movies.ts` (dikelola manual/scraping oleh agent, update via commit).
- Data voting + hasil hidup di **n8n sumopod** (Google Sheets).
- Frontend memanggil webhook n8n hanya untuk kirim vote dan baca hasil.
- Tidak ada secret/API key di frontend. Semua kredensial di sisi n8n.

## Model Data

### Film
```ts
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

type StreamingPlatform = "netflix" | "prime-video" | "disney-plus";
```

### Vote
```ts
interface Vote {
  id: string;
  movieId: string;       // merujuk Movie.id
  voterName: string;     // nama peserta OMK (opsional / bisa alias)
  createdAt: string;     // ISO datetime
}
```

### Respon API (standar, dari n8n)
```ts
interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
```

## API (Webhook n8n — dihosting di sumopod)

Base URL: `https://<instance>.sumopod.com/webhook/...` (isi dari environment, bukan hardcode).

| Endpoint | Method | Deskripsi |
|---|---|---|
| `/webhook/voting/vote` | POST | Submit vote `{ movieId, voterName }` |
| `/webhook/voting/results` | GET | Rekap hasil voting (jumlah suara per film) |

- Daftar film **tidak** lewat n8n — sudah hardcoded di `src/data/movies.ts`.
- Semua konsumsi via env variable `VITE_API_BASE`.
- Jika n8n offline, vote tersimpan lokal (localStorage) + banner "tersimpan lokal".
- Tangani error n8n dengan `ApiResponse.error` yang jelas + UI error state.

## Struktur Direktori (target)

```
voting-movie/
├── .github/workflows/deploy.yml   # CI deploy ke GitHub Pages
├── public/
├── src/
│   ├── components/                # komponen shadcn/ui + kustom
│   │   └── ui/                    # output dari shadcn CLI (tema neobrutalism)
│   ├── lib/
│   │   └── utils.ts               # shadcn cn() dll
│   ├── data/
│   │   └── movies.ts              # fallback daftar film statis
│   ├── hooks/
│   │   ├── useMovies.ts
│   │   └── useVotes.ts
│   ├── pages/
│   │   ├── Vote.tsx                # halaman utama (/): form pilih film
│   │   ├── Movies.tsx              # daftar film (/movies)
│   │   ├── MovieDetail.tsx         # detail film (/movies/:id)
│   │   └── Results.tsx             # papan hasil voting
│   ├── api/
│   │   └── client.ts               # wrapper webhook n8n
│   ├── lib/
│   │   ├── utils.ts                # shadcn cn() dll
│   │   ├── types.ts                # tipe data (Movie, Vote, dll)
│   │   └── platforms.ts            # meta platform streaming
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── AGENTS.md
```

## Setup & Perintah

```bash
npm install            # install deps
npm run dev            # dev server (Vite)
npm run build          # build produksi
npm run preview        # preview build lokal
npm run lint           # eslint
npm run typecheck      # tsc --noEmit
npm run format         # prettier (jika dipakai)
```

- Sebelum push, WAJIB: `npm run typecheck` dan `npm run lint` lolos.
- Pengerjaan fitur baru: buat branch, ikuti konvensi commit repo.

## Konvensi

- Komponen baru pakai pola yang sama seperti komponen shadcn/ui yang sudah ada.
- Jangan menambah library baru tanpa konfirmasi / tanpa dicek dulu apakah sudah dipakai.
- UI copy dalam Bahasa Indonesia. Angka rating ditampilkan sebagai `7.4 IMDb` dsb.
- Poster/cover: utamakan URL stabil; kalau rapuh, simpan di `public/posters/`.
- `VITE_API_BASE` didefinisikan di `.env.local` (jangan commit). Sediakan `.env.example`.

## Deploy (GitHub Pages)

- Custom domain: file `public/CNAME` berisi domain (mis. `damarpradiptojati.my.id`).
- Base path `/` (domain root) → `base: process.env.VITE_BASE_PATH || "/"` di `vite.config.ts`.
  Kalau tanpa custom domain, override dengan `VITE_BASE_PATH=/<repo>/ npm run build`.
- GitHub Actions `deploy.yml`: checkout → setup node → `npm ci` → `npm run build` →
  deploy artefak `dist` via `actions/deploy-pages`.
- Arahkan Settings → Pages → Source ke **GitHub Actions** + isi Custom domain.
- DNS root domain → 4 A record `185.199.108.153` dkk (atau CNAME subdomain → `<user>.github.io`).
- Selalu cek hasil build setelah deploy (cache browser).

## Tugas rutin yang perlu dilakukan agent

1. Menambah/mengupdate film → verifikasi ketersediaan platform streaming + rating, update `verifiedAt`.
2. Membuat endpoint n8n sesuai skema API di atas.
3. Memastikan UI mobile-first dan aksesibel (tap target ≥ 44px, kontras cukup).
4. Menjaga fallback data statis tetap sinkron dengan data n8n.
