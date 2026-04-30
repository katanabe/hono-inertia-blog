import { Link, router } from '@inertiajs/react'
import { useState } from 'react'
import type { PageProps } from '../../pages.gen'
import styles from './New.module.css'

const New = ({ values, errors }: PageProps<'Posts/New'>) => {
  const [form, setForm] = useState(values)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.post('/posts', form)
  }

  return (
    <main className={styles.container}>
      <Link href='/posts' className={styles.back}>← 一覧へ</Link>
      <h1>新規作成</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor='title'>タイトル</label>
          <input
            id='title'
            type='text'
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && <span className={styles.error}>{errors.title}</span>}
        </div>
        <div className={styles.field}>
          <label htmlFor='body'>本文</label>
          <textarea
            id='body'
            value={form.body}
            rows={10}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
          />
          {errors.body && <span className={styles.error}>{errors.body}</span>}
        </div>
        <div className={styles.actions}>
          <button type='submit' className={styles.submitButton}>作成</button>
          <Link href='/posts' className={styles.cancelLink}>キャンセル</Link>
        </div>
      </form>
    </main>
  )
}

export default New
