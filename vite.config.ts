import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'
import { inertiaPages } from '@hono/inertia/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    inertiaPages({ serverModule: '../src/server' }),
    tailwindcss(),
    cloudflare(),
    ssrPlugin(),
  ],
  resolve: {
    alias: {
      '@': new URL('./', import.meta.url).pathname,
    },
  },
})
