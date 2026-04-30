import { renderToString } from 'react-dom/server'
import { Link, Script, ViteClient } from 'vite-ssr-components/react'
import { serializePage, type RootView } from '@hono/inertia'

export const rootView: RootView = (page) => {
  const viteClient = renderToString(<ViteClient />)
  const script = renderToString(<Script src='/src/client.tsx' />)
  const serialized = serializePage(page)

  return `<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Hono × Inertia Blog</title>${viteClient}${script}</head><body><script data-page="app" type="application/json">${serialized}</script><div id="app"></div></body></html>`
}
