import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex flex-1 flex-col items-center justify-center py-32 text-center px-4">
        <p className="text-8xl font-bold text-primary/20 mb-4" aria-hidden="true">404</p>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          This lesson or page doesn&apos;t exist yet. Try searching, or head back to the curriculum.
        </p>
        <div className="flex gap-3">
          <Button render={<Link href="/phases" />}>Browse Phases</Button>
          <Button variant="outline" render={<Link href="/" />}>Home</Button>
        </div>
      </main>
      <Footer />
    </>
  )
}
