import { useQuery } from '@tanstack/react-query'
import { LoaderIcon } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

import { getUser } from '@/api/get-user'
import { HistoricTable } from '@/components/historic-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function Historic() {
  const { data: historic, isLoading: isLoadingHistoric } = useQuery({
    queryKey: ['historic'],
    queryFn: getUser,
    staleTime: Infinity,
  })

  const schedules = Array.isArray(historic?.patient?.schedules)
    ? historic.patient.schedules
    : []
  const examSchedule = Array.isArray(historic?.patient?.examSchedule)
    ? historic.patient.examSchedule
    : []

  return (
    <>
      <Helmet title="Histórico do paciente" />

      <div className="px-0 md:px-8 lg:px-20">
        {isLoadingHistoric ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoaderIcon className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue="consulta" className="space-y-4">
            <TabsList>
              <TabsTrigger value="consulta">Consultas</TabsTrigger>
              <TabsTrigger value="exame">Exames</TabsTrigger>
            </TabsList>

            <TabsContent value="consulta">
              <HistoricTable schedules={schedules} />
            </TabsContent>

            <TabsContent value="exame">
              <HistoricTable examSchedule={examSchedule} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  )
}
