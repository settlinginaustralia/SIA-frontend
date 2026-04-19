/**
 * GitHub Pages serves /path/to/deep/route as 404 unless a 404.html exists.
 * Copy the SPA shell so client-side routing can load.
 */
import { copyFileSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = join(__dirname, '..', 'dist')
const indexHtml = join(dist, 'index.html')
const notFound = join(dist, '404.html')

if (!existsSync(indexHtml)) {
  console.error('dist/index.html not found. Run vite build first.')
  process.exit(1)
}

copyFileSync(indexHtml, notFound)
console.log('gh-pages: wrote dist/404.html (SPA fallback)')
