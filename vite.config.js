import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Project Pages URL: https://<user>.github.io/<repo>/
// - Local dev: base stays "/"
// - gh-pages build: pass repo base, e.g. `npm run build:gh` (edit repo name in package.json if needed)
// - Or: VITE_BASE_PATH=/YourRepo/ npm run build
const base =
  process.env.VITE_BASE_PATH ||
  (process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/')

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
