import { Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import type { PageProps } from '../pages.gen'

const Home = ({ message }: PageProps<'Home'>) => (
  <main className='max-w-2xl mx-auto px-4 py-16'>
    <h1 className='text-4xl font-bold mb-4'>{message}</h1>
    <p className='text-muted-foreground mb-8'>Hono × Inertia.js × React × D1 のブログサンプルです。</p>
    <Button asChild>
      <Link href='/posts'>記事一覧へ →</Link>
    </Button>
  </main>
)

export default Home
