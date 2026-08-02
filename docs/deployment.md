# Deploy — GitHub Pages

## Alur

1. Push ke branch utama (misal `main`).
2. GitHub Actions `deploy.yml` jalan: checkout → setup node → `npm ci` → `npm run build`.
3. Folder `dist` dideploy ke branch `gh-pages`.
4. Settings → Pages → Source: **branch `gh-pages`**.

## Base Path

- GitHub Pages memakai `/repository-name/`.
- Atur `base` di `vite.config.ts` sesuai nama repo, contoh:
  ```ts
  export default defineConfig({
    base: process.env.VITE_BASE_PATH || '/voting-movie/',
    // ...
  })
  ```

## Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

## Checklist Setelah Deploy

- [ ] Build sukses di Actions.
- [ ] Branch `gh-pages` ter-update.
- [ ] Cek hasil di browser (refresh hard / cache-clear).
- [ ] Routing SPA berfungsi (fallback ke index.html di `vite.config.ts`).
- [ ] `VITE_API_BASE` benar di environment build.

## Catatan

- Semua data dipakai dari n8n sumopod, bukan dari GitHub.
- `.env.local` berisi `VITE_API_BASE` — **jangan commit**; sediakan `.env.example`.
