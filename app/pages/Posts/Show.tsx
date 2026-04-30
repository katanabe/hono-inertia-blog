import { Link, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PageProps } from '../../pages.gen'

const Show = ({ post }: PageProps<'Posts/Show'>) => {
  const handleDelete = () => {
    if (!confirm('この記事を削除しますか？')) return
    router.delete(`/posts/${post.id}`)
  }

  return (
    <main className='max-w-2xl mx-auto px-4 py-8'>
      <Link href='/posts' className='text-sm text-muted-foreground hover:text-foreground mb-6 inline-block'>
        ← 一覧へ
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>{post.title}</CardTitle>
          <time className='text-sm text-muted-foreground'>
            {new Date(post.createdAt).toLocaleDateString('ja-JP')}
          </time>
        </CardHeader>
        <CardContent>
          <p className='whitespace-pre-wrap leading-relaxed'>{post.body}</p>
        </CardContent>
      </Card>
      <div className='flex gap-3 mt-6'>
        <Button asChild variant='outline'>
          <Link href={`/posts/${post.id}/edit`}>編集</Link>
        </Button>
        <Button variant='destructive' onClick={handleDelete}>削除</Button>
      </div>
    </main>
  )
}

export default Show
