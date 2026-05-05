import type { Context } from 'hono'
import type { Env } from '../env'
import { getDb } from '../db/index'
import { PostService } from './post'

export const getPostService = (c: Context<Env>) =>
  new PostService(getDb(c.env.DB))
