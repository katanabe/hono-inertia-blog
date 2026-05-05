import type { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import type { Env } from '../env'
import { getPostService } from '../services/index'
import { postInputSchema, postIdSchema, toFieldErrors, recoverInput } from '../schemas/post'

const paramId = zValidator('param', postIdSchema)

export const addRoutes = <A extends Hono<Env>>(app: A) =>
  app
    .get('/', (c) => c.render('Home', { message: 'Hello, Hono × Inertia!' }))
    .get('/posts', async (c) => {
      const posts = await getPostService(c).findAll()
      return c.render('Posts/Index', { posts })
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
        const post = await getPostService(c).create(c.req.valid('json'))
        return c.redirect(`/posts/${post.id}`, 303)
      }
    )
    .get('/posts/:id', paramId, async (c) => {
      const { id } = c.req.valid('param')
      const post = await getPostService(c).findById(id)
      if (!post) return c.notFound()
      return c.render('Posts/Show', { post })
    })
    .get('/posts/:id/edit', paramId, async (c) => {
      const { id } = c.req.valid('param')
      const post = await getPostService(c).findById(id)
      if (!post) return c.notFound()
      return c.render('Posts/Edit', { post, errors: {} as Record<string, string> })
    })
    .patch(
      '/posts/:id',
      paramId,
      zValidator('json', postInputSchema, async (result, c) => {
        if (!result.success) {
          const id = Number(c.req.param('id'))
          const post = await getPostService(c as Parameters<typeof getPostService>[0]).findById(id)
          if (!post) return c.notFound()
          return c.render('Posts/Edit', {
            post: { ...post, ...recoverInput(result.data) },
            errors: toFieldErrors(result.error),
          })
        }
      }),
      async (c) => {
        const { id } = c.req.valid('param')
        const post = await getPostService(c).update(id, c.req.valid('json'))
        if (!post) return c.notFound()
        return c.redirect(`/posts/${post.id}`, 303)
      }
    )
    .delete('/posts/:id', paramId, async (c) => {
      const { id } = c.req.valid('param')
      const deleted = await getPostService(c).delete(id)
      if (!deleted) return c.notFound()
      return c.redirect('/posts', 303)
    })
