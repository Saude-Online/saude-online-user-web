import { CalendarHeart, ClipboardPlus, Clock, Cross } from 'lucide-react'
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
            icon={Clock}
            title="Minhas consultas"
            description="Confira seu histórico de consultas."
            to="historic-schedule"
          />
          <FeatureCard
            icon={ClipboardPlus}
            title="Meus exames"
            description="Confira seu histórico de exames."
            to="historic-exam-schedule"
          />
          <FeatureCard
            icon={Cross}
            title="Retornos médicos"
            description="Confira seu histórico de retornos médicos."
            to="medical-returns"
          />
        </div>
      </div>
    </>
  )
}
