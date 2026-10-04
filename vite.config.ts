import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

function gitSha(): string {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA
  try {
    return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return 'local'
  }
}

// Same values in the client and the prerender build, so hydration matches.
const buildSha = gitSha().slice(0, 7)
const buildDate = new Date().toISOString().slice(0, 10)

export default defineConfig(({ mode }) => ({
  // Relative asset paths: works on GitHub Pages and anywhere else the folder is served from.
  base: './',
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  define: {
    __BUILD_SHA__: JSON.stringify(buildSha),
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  build: {
    outDir: mode === 'single' ? 'dist-single' : 'dist',
    target: 'es2022',
  },
}))
