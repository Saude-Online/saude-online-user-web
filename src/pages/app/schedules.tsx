import { Helmet } from 'react-helmet-async'

import { NewSchedule } from '@/components/new-schedule'

export function Schedules() {
  return (
    <div>
      <Helmet title="Painel" />

      <div className="flex justify-center p-8">
        <NewSchedule />
      </div>
    </div>
  )
}
