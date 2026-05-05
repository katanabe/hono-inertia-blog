import { Hono } from 'hono'
import { inertia } from '@hono/inertia'
import { rootView } from './root-view'
import type { Env } from './env'
import { addRoutes } from './routes/index'

const app = new Hono<Env>()
app.use(inertia({ version: '1', rootView }))

const routes = addRoutes(app)

export default routes
export type AppType = typeof routes
