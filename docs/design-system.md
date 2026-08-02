# Design System — shadcn/ui Neobrutalism (Kustom)

## Filosofi

Pakai **tweak dari shadcn/ui neobrutalism**: border tebal, shadow keras (hard shadow),
warna solid, sudut tegas. **Jangan** pakai tema bawaan shadcn yang default (soft/smooth).

## Prinsip Utama

| Elemen | Aturan |
|---|---|
| Border | Tebal (`2px`–`3px`), warna gelap solid (`#000` / `#111`) |
| Shadow | Hard shadow (`4px 4px 0 #000`), bukan blur |
| Warna | Solid & kontras tinggi; aksen kuat |
| Sudut | Sedikit rounding atau `rounded-none`/`rounded-sm` |
| Tipografi | Bold heading, hierarki jelas |
| Tekstur | Bisa pakai pattern/outline di area header/empty state |

## Palet Dasar (referensi)

| Token | Contoh |
|---|---|
| Background | `#FFFDF7` / `#FAFAF3` (kertas) |
| Foreground | `#1A1A1A` |
| Aksen | Kuning `#FFD83D`, merah `#FF5A5F`, biru `#4C6FFF`, hijau `#51CF66` |
| Border / shadow | `#000` |

> Warna final didefinisikan di `tailwind.config.ts` + `src/components/ui` dari shadcn CLI.
> Pastikan kontras cukup (WCAG AA) untuk teks.

## Aksesibilitas & Mobile

- Tap target minimal **44px**.
- Font size base nyaman dibaca di HP.
- State aktif/disabled jelas (outline/opacity).

## Komponen yang Dipakai

Semua dari shadcn CLI (`npx shadcn add <nama>`), lalu divariasikan ke gaya neobrutalism:

- `button`, `card`, `badge`, `input`, `select`, `progress`, `skeleton`, `alert`
- Tambahan kustom: `MovieCard`, `RatingBadge`, `VoteBar`, `PlatformBadge` (badge per platform streaming)

## Aturan Implementasi

1. Jalankan shadcn CLI untuk komponen standar.
2. Modifikasi kelasnya ke gaya neobrutalism (border tebal + hard shadow + warna solid).
3. UI copy dalam **Bahasa Indonesia**. Rating ditampilkan misal `7.4 IMDb`.
