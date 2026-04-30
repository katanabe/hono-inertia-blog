import { Link, router } from '@inertiajs/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { PageProps } from '../../pages.gen'

const New = ({ values, errors }: PageProps<'Posts/New'>) => {
  const [form, setForm] = useState(values)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.post('/posts', form)
  }

  return (
    <main className='max-w-2xl mx-auto px-4 py-8'>
      <Link href='/posts' className='text-sm text-muted-foreground hover:text-foreground mb-6 inline-block'>
        ← 一覧へ
      </Link>
      <h1 className='text-3xl font-bold mb-8'>新規作成</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='title'>タイトル</Label>
          <Input
            id='title'
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && <p className='text-sm text-destructive'>{errors.title}</p>}
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='body'>本文</Label>
          <Textarea
            id='body'
            value={form.body}
            rows={10}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
          />
          {errors.body && <p className='text-sm text-destructive'>{errors.body}</p>}
        </div>
        <div className='flex items-center gap-4'>
          <Button type='submit'>作成</Button>
          <Link href='/posts' className='text-sm text-muted-foreground hover:text-foreground'>
            キャンセル
          </Link>
        </div>
      </form>
    </main>
  )
}

export default New
