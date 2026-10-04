// Build step after `vite build`:
// 1. Render the React app to static HTML, so the page is complete before JavaScript loads
//    (fast first paint, readable by search engines and link previews).
// 2. Inline the stylesheet, so the first paint doesn't wait for an extra request.
// 3. Preload the headline font, so the big name doesn't shift when the font arrives.
import { readFile, readdir, writeFile, rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const outDir = process.argv[2] ?? 'dist'
const htmlPath = path.resolve(outDir, 'index.html')
const { render } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href)

let html = await readFile(htmlPath, 'utf8')
if (!html.includes('<!--app-->')) throw new Error(`No <!--app--> placeholder in ${htmlPath}`)
html = html.replace('<!--app-->', render())

const cssLink = html.match(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/)
if (cssLink) {
  const css = await readFile(path.resolve(outDir, cssLink[1]), 'utf8')
  // url(./font.woff2) was relative to assets/; the page lives one level up.
  const inlined = css.replace(/url\(\.\/(?!assets\/)/g, 'url(./assets/')
  html = html.replace(cssLink[0], () => `<style>${inlined}</style>`)
  await rm(path.resolve(outDir, cssLink[1]))
}

const assets = await readdir(path.resolve(outDir, 'assets')).catch(() => [])
const headline = assets.find((f) => /^archivo-latin-wdth-normal-.*\.woff2$/.test(f))
if (headline) {
  html = html.replace('</title>', `</title>\n    <link rel="preload" href="./assets/${headline}" as="font" type="font/woff2" crossorigin />`)
}

await writeFile(htmlPath, html)
if (outDir === 'dist') await rm('dist-ssr', { recursive: true, force: true })
console.log(`prerendered ${htmlPath} (${(html.length / 1024).toFixed(1)} KB)`)
