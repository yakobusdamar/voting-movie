# Deploy — GitHub Pages

## Alur

1. Push ke branch utama (misal `main`).
2. GitHub Actions `deploy.yml` jalan: checkout → setup node → `npm ci` → `npm run build`.
3. Folder `dist` dideploy ke GitHub Pages (artefak + `actions/deploy-pages`).
4. Settings → Pages → Source: **GitHub Actions**.

## Base Path

- Proyek ini memakai **custom domain** di root → `base` default `/`.
- Kalau fallback ke URL `github.io` tanpa custom domain, override via env:
  ```sh
  VITE_BASE_PATH=/voting-movie/ npm run build
  ```
- Konfigurasi `vite.config.ts`:
  ```ts
  base: process.env.VITE_BASE_PATH || "/",
  ```

## Custom Domain

- File `public/CNAME` berisi domain (mis. `damarpradiptojati.my.id`) → ikut ter-deploy.
- Settings → Pages → **Custom domain**: isi domain → Save.
- DNS (di registrar / Cloudflare):
  - Root domain → 4 A record:
    `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - Atau subdomain → CNAME `www` → `yakobusdamar.github.io`
- Tunggu propagasi DNS (beberapa menit). Centang "Enforce HTTPS" setelah aktif.
