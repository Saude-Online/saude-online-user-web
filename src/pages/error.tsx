import { Link, useRouteError } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function Error() {
  const error = useRouteError() as Error

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 space-y-4 text-center">
      <h1 className="text-3xl font-bold">Whoops, algo aconteceu...</h1>
      <p className="mb-4 text-lg font-normal text-muted-foreground">
        Um erro aconteceu na aplicação, abaixo você encontra mais detalhes:
      </p>
      <pre>{error?.message || JSON.stringify(error)}</pre>
      <Button variant="secondary" asChild>
        <Link to="/">Voltar para o início</Link>
      </Button>
    </div>
  )
}
