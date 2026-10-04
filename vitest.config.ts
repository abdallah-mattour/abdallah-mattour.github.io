import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig({ mode: 'test', command: 'serve' }),
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      coverage: {
        provider: 'v8',
        include: ['src/lib/**', 'src/hooks/**', 'src/components/**'],
        exclude: ['**/*.test.*'],
        thresholds: { lines: 90, functions: 85, branches: 80, statements: 90 },
        reporter: ['text-summary', 'lcov'],
      },
    },
  }),
)
