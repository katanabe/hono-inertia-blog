import { Link } from '@inertiajs/react'
import type { PageProps } from '../pages.gen'

const Home = ({ message }: PageProps<'Home'>) => (
  <main style={{ maxWidth: 800, margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
    <h1>{message}</h1>
    <Link href='/posts'>記事一覧へ →</Link>
  </main>
)

export default Home
