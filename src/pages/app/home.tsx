import { CalendarHeart, History } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

import { FeatureCard } from '@/components/feature-card'

export function Home() {
  return (
    <>
      <Helmet title="Home" />

      <div className="p-8">
        <h1 className="text-2xl font-semibold tracking-tight lg:pl-20">
          O que você precisa hoje?
        </h1>
        <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 lg:px-20">
          <FeatureCard
            icon={CalendarHeart}
            title="Agendamento"
            description="Agende consulta, exames e procedimentos com facilidade."
            to="schedule"
          />
          <FeatureCard
            icon={History}
            title="Histórico"
            description="Confira seu histórico de consultas, exames e anamneses."
            to="historic"
          />
        </div>
      </div>
    </>
  )
}
