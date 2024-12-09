import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

import { getUser } from '@/api/get-user'
import { HistoricTable } from '@/components/historic-table'

export function HistoricExamSchedule() {
  const { data: historic, isLoading: isLoadingHistoric } = useQuery({
    queryKey: ['historic'],
    queryFn: getUser,
    staleTime: Infinity,
  })

  const examSchedule = Array.isArray(historic?.patient?.examSchedule)
    ? historic.patient.examSchedule
    : []

  return (
    <>
      <Helmet title="Histórico do paciente" />

      <div className="px-0 md:px-8 lg:px-20">
        {isLoadingHistoric ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <HistoricTable examSchedule={examSchedule} />
        )}
      </div>
    </>
  )
}
