import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Cross, Frown, Loader2 } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

import { getUser } from '@/api/get-user'
import { HistoricTable } from '@/components/historic-table'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
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
  const anamneses = Array.isArray(historic?.patient?.anamneses)
    ? historic.patient.anamneses
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
          <Tabs defaultValue="consulta" className="space-y-4">
            <TabsList>
              <TabsTrigger value="consulta">Consultas</TabsTrigger>
              <TabsTrigger value="exame">Exames</TabsTrigger>
              <TabsTrigger value="anamnese">Anamneses</TabsTrigger>
            </TabsList>

            <TabsContent value="consulta">
              <HistoricTable schedules={schedules} />
            </TabsContent>

            <TabsContent value="exame">
              <HistoricTable examSchedule={examSchedule} />
            </TabsContent>

            <TabsContent value="anamnese">
              <div className="space-y-4 pb-8">
                <div className="flex flex-row items-center gap-3">
                  <Cross className="h-6 w-6 text-primary" />
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Histórico de anamneses
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  Consulte seu histórico de consultas e exames
                </p>
              </div>
              {anamneses && anamneses.length > 0 ? (
                <Card className="p-4">
                  {anamneses.map((anamnese, index) => (
                    <ul key={anamnese.id}>
                      <li>
                        <Label>Efetuada em:</Label>{' '}
                        {format(
                          new Date(anamnese.createdAt),
                          "dd/MM/yyyy 'às' HH:mm",
                        )}
                      </li>
                      <li>
                        <Label>Idade:</Label> {anamnese.age} anos
                      </li>
                      <li>
                        <Label>Peso:</Label> {anamnese.weight} kg
                      </li>
                      <li>
                        <Label>Altura:</Label> {anamnese.height} m
                      </li>
                      <li>
                        <Label>Sintomas:</Label> {anamnese.symptoms}
                      </li>
                      <li>
                        <Label>Histórico médico:</Label>{' '}
                        {anamnese.medicalHistory}
                      </li>
                      <li>
                        <Label>Alergias:</Label> {anamnese.allergies}
                        {index < (anamneses?.length ?? 0) - 1 && (
                          <Separator className="my-4" />
                        )}
                      </li>
                    </ul>
                  ))}
                </Card>
              ) : (
                <div className="flex items-center justify-center gap-4 py-20 text-muted-foreground">
                  <Frown />
                  <Label className="text-lg">Sem resultados.</Label>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  )
}
