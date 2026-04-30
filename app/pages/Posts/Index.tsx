import { Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PageProps } from '../../pages.gen'

const Index = ({ posts }: PageProps<'Posts/Index'>) => (
  <main className='max-w-2xl mx-auto px-4 py-8'>
    <div className='flex items-center justify-between mb-8'>
      <h1 className='text-3xl font-bold'>記事一覧</h1>
      <Button asChild>
        <Link href='/posts/new'>新規作成</Link>
      </Button>
    </div>
    {posts.length === 0 ? (
      <p className='text-muted-foreground'>記事がありません</p>
    ) : (
      <div className='flex flex-col gap-4'>
        {posts.map((post) => (
          <Card key={post.id} className='hover:shadow-md transition-shadow'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg'>
                <Link href={`/posts/${post.id}`} className='hover:underline'>
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <time className='text-sm text-muted-foreground'>
                {new Date(post.createdAt).toLocaleDateString('ja-JP')}
              </time>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </main>
)

export default Index
