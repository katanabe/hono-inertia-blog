import { Link, router } from '@inertiajs/react'
import type { PageProps } from '../../pages.gen'
import styles from './Show.module.css'

const Show = ({ post }: PageProps<'Posts/Show'>) => {
  const handleDelete = () => {
    if (!confirm('この記事を削除しますか？')) return
    router.delete(`/posts/${post.id}`)
  }

  return (
    <main className={styles.container}>
      <Link href='/posts' className={styles.back}>← 一覧へ</Link>
      <article className={styles.article}>
        <h1 className={styles.title}>{post.title}</h1>
        <time className={styles.date}>
          {new Date(post.createdAt).toLocaleDateString('ja-JP')}
        </time>
        <p className={styles.body}>{post.body}</p>
      </article>
      <div className={styles.actions}>
        <Link href={`/posts/${post.id}/edit`} className={styles.editButton}>編集</Link>
        <button onClick={handleDelete} className={styles.deleteButton}>削除</button>
      </div>
    </main>
  )
}

export default Show
