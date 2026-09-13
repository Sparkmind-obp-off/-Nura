import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        main: './src/index.tsx',
        wrangler: { configPath: './wrangler.jsonc' },
        miniflare: { d1Databases: ['DB'] },
      },
    },
  },
})
