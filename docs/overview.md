# Overview — Voting Film OMK Lingkungan FX

## Tujuan

Mobile web app untuk voting **"mau nonton apa besok"** di kegiatan OMK Lingkungan FX.
Anggota memilih satu film dari daftar **film komedi Indonesia** yang tersedia di salah satu
platform streaming (**Netflix**, **Prime Video**, **Disney+ Hotstar**), setiap film disertai
**score rating** (IMDb dan/atau rating lain).

## Alur Pengguna

1. Pengguna membuka app (di HP, dari GitHub Pages). Halaman utama langsung **Vote**.
2. Memilih satu film dan submit vote (dengan nama/alias).
3. Menjelajah daftar film di `/movies` dan detail tiap film di `/movies/:id`.
4. Semua orang bisa melihat hasil voting real-time di `/results`.

## Batasan Penting

- Hanya **film komedi Indonesia yang sedang available** di Netflix / Prime Video / Disney+ Hotstar.
- Setiap film **wajib punya rating** (sumber utama IMDb, boleh + rating lokal).
- Ketersediaan platform harus **diverifikasi** dan dicatat tanggalnya (`verifiedAt`).
- UI dalam **Bahasa Indonesia**, casual sesuai konteks OMK.
- **Mobile-first** (target utama HP).
- Urutan halaman: `/` = Vote, `/movies` = daftar, `/movies/:id` = detail, `/results` = hasil.

## Tech Stack Ringkas

| Lapisan | Pilihan |
|---|---|
| Framework | React + Vite + TypeScript |
| Styling | Tailwind CSS + shadcn/ui (neobrutalism) |
| State | Zustand |
| Data film | Hardcoded di `src/data/movies.ts` (dikelola agent) |
| Backend | n8n webhook @ sumopod (vote + hasil saja, Google Sheets) |
| Deploy | GitHub Pages |

## Status

Scaffold proyek. Detail teknis ada di file `docs/*` dan task di `task/*`.
