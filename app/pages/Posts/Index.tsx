import { Link } from '@inertiajs/react'
import type { PageProps } from '../../pages.gen'
import styles from './Index.module.css'

const Index = ({ posts }: PageProps<'Posts/Index'>) => (
  <main className={styles.container}>
    <div className={styles.header}>
      <h1>記事一覧</h1>
      <Link href='/posts/new' className={styles.button}>新規作成</Link>
    </div>
    {posts.length === 0 ? (
      <p className={styles.empty}>記事がありません</p>
    ) : (
      <ul className={styles.list}>
        {posts.map((post) => (
          <li key={post.id} className={styles.item}>
            <Link href={`/posts/${post.id}`} className={styles.title}>
              {post.title}
            </Link>
            <time className={styles.date}>
              {new Date(post.createdAt).toLocaleDateString('ja-JP')}
            </time>
          </li>
        ))}
      </ul>
    )}
  </main>
)

export default Index
