import { Hono } from 'hono'
import { inertia } from '@hono/inertia'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { desc, eq } from 'drizzle-orm'
import { rootView } from './root-view'
import { getDb } from './db/index'
import { posts } from './db/schema'

type Env = {
  Bindings: {
    DB: D1Database
  }
}

const postInputSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(80, 'タイトルは80文字以内で入力してください'),
  body: z
    .string()
    .min(1, '本文は必須です')
    .max(2000, '本文は2000文字以内で入力してください'),
})
type PostInput = z.infer<typeof postInputSchema>

const toFieldErrors = (
  error: z.core.$ZodError<unknown>
): Record<string, string> => {
  const out: Record<string, string> = {}
  const flat = z.flattenError(error)
  for (const [key, messages] of Object.entries(flat.fieldErrors)) {
    const msgs = messages as string[] | undefined
    const first = msgs?.[0]
    if (first) out[key] = first
  }
  return out
}

const recoverInput = (data: unknown): PostInput => {
  const obj = (data ?? {}) as Partial<PostInput>
  return {
    title: typeof obj.title === 'string' ? obj.title : '',
    body: typeof obj.body === 'string' ? obj.body : '',
  }
}

const app = new Hono<Env>()
app.use(inertia({ version: '1', rootView }))

const routes = app
  .get('/', (c) => c.render('Home', { message: 'Hello, Hono × Inertia!' }))
  .get('/posts', async (c) => {
    const db = getDb(c.env.DB)
    const allPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
    return c.render('Posts/Index', { posts: allPosts })
  })
  .get('/posts/new', (c) =>
    c.render('Posts/New', {
      values: { title: '', body: '' },
      errors: {} as Record<string, string>,
    })
  )
  .post(
    '/posts',
    zValidator('json', postInputSchema, (result, c) => {
      if (!result.success) {
        return c.render('Posts/New', {
          values: recoverInput(result.data),
          errors: toFieldErrors(result.error),
        })
      }
    }),
    async (c) => {
      const db = getDb(c.env.DB)
      const input = c.req.valid('json')
      const now = new Date()
      const [post] = await db
        .insert(posts)
        .values({ title: input.title, body: input.body, createdAt: now, updatedAt: now })
        .returning()
      return c.redirect(`/posts/${post!.id}`, 303)
    }
  )
  .get('/posts/:id{[0-9]+}', async (c) => {
    const id = Number(c.req.param('id'))
    const db = getDb(c.env.DB)
    const [post] = await db.select().from(posts).where(eq(posts.id, id))
    if (!post) return c.notFound()
    return c.render('Posts/Show', { post })
  })
  .get('/posts/:id{[0-9]+}/edit', async (c) => {
    const id = Number(c.req.param('id'))
    const db = getDb(c.env.DB)
    const [post] = await db.select().from(posts).where(eq(posts.id, id))
    if (!post) return c.notFound()
    return c.render('Posts/Edit', {
      post,
      errors: {} as Record<string, string>,
    })
  })
  .patch(
    '/posts/:id{[0-9]+}',
    zValidator('json', postInputSchema, async (result, c) => {
      if (!result.success) {
        const id = Number(c.req.param('id'))
        const db = getDb(c.env.DB)
        const [post] = await db.select().from(posts).where(eq(posts.id, id))
        if (!post) return c.notFound()
        return c.render('Posts/Edit', {
          post: { ...post, ...recoverInput(result.data) },
          errors: toFieldErrors(result.error),
        })
      }
    }),
    async (c) => {
      const id = Number(c.req.param('id'))
      const db = getDb(c.env.DB)
      const input = c.req.valid('json')
      const [post] = await db
        .update(posts)
        .set({ title: input.title, body: input.body, updatedAt: new Date() })
        .where(eq(posts.id, id))
        .returning()
      if (!post) return c.notFound()
      return c.redirect(`/posts/${post.id}`, 303)
    }
  )
  .delete('/posts/:id{[0-9]+}', async (c) => {
    const id = Number(c.req.param('id'))
    const db = getDb(c.env.DB)
    const deleted = await db.delete(posts).where(eq(posts.id, id)).returning()
    if (deleted.length === 0) return c.notFound()
    return c.redirect('/posts', 303)
  })

export default routes
export type AppType = typeof routes
