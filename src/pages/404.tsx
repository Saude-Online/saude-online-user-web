import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 space-y-4 text-center">
      <h1 className="mb-4 text-7xl font-extrabold tracking-wider lg:text-9xl">
        404
      </h1>
      <p className="mb-4 text-3xl font-bold md:text-4xl">Algo está errado...</p>
      <p className="mb-4 text-lg font-normal text-muted-foreground">
        Desculpe, não conseguimos encontrar essa página.
      </p>
      <Button variant="secondary" asChild>
        <Link to="/">Voltar para o início</Link>
      </Button>
    </div>
  )
}
