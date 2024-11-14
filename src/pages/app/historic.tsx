import { Helmet } from 'react-helmet-async'

export function Historic() {
  return (
    <>
      <Helmet title="Histórico do paciente" />

      <div className="p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Histórico</h1>
      </div>
    </>
  )
}
