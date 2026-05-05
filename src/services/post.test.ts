import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { env } from 'cloudflare:workers'
import { getDb } from '../db/index'
import { PostService } from './post'

const getService = () => new PostService(getDb(env.DB))

beforeAll(async () => {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `).run()
})

beforeEach(async () => {
  await env.DB.prepare('DELETE FROM posts').run()
})

describe('PostService', () => {
  describe('create', () => {
    it('投稿を作成してidが採番される', async () => {
      const post = await getService().create({ title: 'タイトル', body: '本文' })
      expect(post.id).toBeTypeOf('number')
      expect(post.title).toBe('タイトル')
      expect(post.body).toBe('本文')
    })
  })

  describe('findAll', () => {
    it('新しい順で返る', async () => {
      const svc = getService()
      await svc.create({ title: '古い', body: '本文' })
      await svc.create({ title: '新しい', body: '本文' })
      const posts = await svc.findAll()
      expect(posts[0]!.title).toBe('新しい')
      expect(posts[1]!.title).toBe('古い')
    })

    it('0件のとき空配列', async () => {
      const posts = await getService().findAll()
      expect(posts).toEqual([])
    })
  })

  describe('findById', () => {
    it('存在するIDで投稿が返る', async () => {
      const created = await getService().create({ title: 'タイトル', body: '本文' })
      const post = await getService().findById(created.id)
      expect(post?.id).toBe(created.id)
    })

    it('存在しないIDでnullが返る', async () => {
      const post = await getService().findById(999999)
      expect(post).toBeNull()
    })
  })

  describe('update', () => {
    it('投稿を更新できる', async () => {
      const created = await getService().create({ title: '旧タイトル', body: '旧本文' })
      const updated = await getService().update(created.id, { title: '新タイトル', body: '新本文' })
      expect(updated?.title).toBe('新タイトル')
      expect(updated?.body).toBe('新本文')
    })

    it('存在しないIDでnullが返る', async () => {
      const result = await getService().update(999999, { title: 'x', body: 'y' })
      expect(result).toBeNull()
    })
  })

  describe('delete', () => {
    it('投稿を削除できる', async () => {
      const created = await getService().create({ title: 'タイトル', body: '本文' })
      const result = await getService().delete(created.id)
      expect(result).toBe(true)
      expect(await getService().findById(created.id)).toBeNull()
    })

    it('存在しないIDでfalseが返る', async () => {
      const result = await getService().delete(999999)
      expect(result).toBe(false)
    })
  })
})
