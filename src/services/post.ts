import { desc, eq } from 'drizzle-orm'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
import { getDb } from '../db/index'
import { posts } from '../db/schema'
import type * as schema from '../db/schema'
import type { PostInput } from '../schemas/post'

type Db = ReturnType<typeof getDb>

export class PostService {
  constructor(private readonly db: Db) {}

  async findAll() {
    return this.db.select().from(posts).orderBy(desc(posts.createdAt), desc(posts.id))
  }

  async findById(id: number) {
    const [post] = await this.db.select().from(posts).where(eq(posts.id, id))
    return post ?? null
  }

  async create(input: PostInput) {
    const now = new Date()
    const [post] = await this.db
      .insert(posts)
      .values({ title: input.title, body: input.body, createdAt: now, updatedAt: now })
      .returning()
    return post!
  }

  async update(id: number, input: PostInput) {
    const [post] = await this.db
      .update(posts)
      .set({ title: input.title, body: input.body, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning()
    return post ?? null
  }

  async delete(id: number) {
    const deleted = await this.db.delete(posts).where(eq(posts.id, id)).returning()
    return deleted.length > 0
  }
}
