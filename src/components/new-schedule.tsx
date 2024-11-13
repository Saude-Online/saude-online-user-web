import { useMutation, useQuery } from '@tanstack/react-query'
import {
  type CalendarEvent,
  google,
  office365,
  outlook,
  yahoo,
} from 'calendar-link'
import { format, isBefore, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar as CalendarIcon,
  Check,
  Clock,
  Heart,
  Stethoscope,
} from 'lucide-react'
import { useState } from 'react'

import { getSpecialties } from '@/api/get-specialties'
import { getUser, type PatientProps } from '@/api/get-user'
import { getUsers } from '@/api/get-users'
import { registerSchedule } from '@/api/register-schedule'
import { TimeSlots } from '@/components/times-slots'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/components/ui/use-toast'
import { queryClient } from '@/lib/react-query'
import { axiosErrorHandler } from '@/utils/axiosErrorHandler'

export interface DoctorProps {
  id: string
  name: string
  username: string
  crm: string
  role: string
  patient: PatientProps
  createdAt: Date
  updatedAt: Date
}

const times = [
  {
    time: '09:00',
  },
  {
    time: '09:30',
  },
  {
    time: '10:00',
  },
  {
    time: '10:30',
  },
  {
    time: '11:00',
  },
  {
    time: '11:30',
  },
  {
    time: '13:30',
  },
  {
    time: '14:00',
  },
  {
    time: '14:30',
  },
  {
    time: '15:00',
  },
  {
    time: '15:30',
  },
  {
    time: '16:00',
  },
  {
    time: '16:30',
  },
]

export function NewSchedule() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: Infinity,
  })

  const { data: specialties = [] as { id: string; name: string }[] } = useQuery(
    {
      queryKey: ['specialties'],
      queryFn: getSpecialties,
      staleTime: Infinity,
    },
  )

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers({ isDoctor: true }),
    staleTime: Infinity,
  })

  const { mutateAsync: registerScheduleFn } = useMutation({
    mutationFn: registerSchedule,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['schedules'] })

      toast({
        variant: 'default',
        title: 'Agendamento',
        description: 'Agendado realizado!',
        action: (
          <ToastAction altText="Fazer login">
            Adicionar ao calendário
          </ToastAction>
        ),
        onClick: () => setIsOpenAlertDialog(true),
      })
    },
  })

  const [specialty, setSpecialty] = useState<{
    id: string
    name: string
  } | null>(null)
  const [specialist, setSpecialist] = useState<DoctorProps | null>(
    user?.crm ? user : null,
  )
  const [date, setDate] = useState<Date>()
  const [hour, setHour] = useState<string | null>(null)
  const [isOpenAlertDialog, setIsOpenAlertDialog] = useState<boolean>(false)

  const filteredDoctors = specialty
    ? users?.filter(
        (doctor) =>
          Array.isArray(doctor.specialties) &&
          doctor.specialties.some(
            (docSpecialty: { id: string }) => docSpecialty.id === specialty.id,
          ),
      )
    : users

  const dateHour =
    date && hour ? `${format(date, 'yyyy-MM-dd')}T${hour}:00` : ''

  async function handleCreateNewSchedule() {
    try {
      if (!specialist || !date || !hour) {
        return toast({
          variant: 'destructive',
          title: 'Agendamento',
          description: 'Preencha todos os campos para agendar.',
        })
      }

      await registerScheduleFn({
        specialistId: specialist?.id ?? '',
        patientId: user?.patient.id ?? '',
        dateHour,
      })
    } catch (error) {
      const errorMessage = axiosErrorHandler(error)
      toast({
        variant: 'destructive',
        title: 'Agendamento',
        description: errorMessage,
      })
    }
  }

  const event: CalendarEvent = {
    title: 'Consulta médica',
    description: 'Agendamento de consulta médica - Saúde Online',
    start: `${dateHour.replace('T', ' ')} +0300`,
    duration: [30, 'minutes'],
  }

  const googleUrl = google(event)
  const outlookUrl = outlook(event)
  const office365Url = office365(event)
  const yahooUrl = yahoo(event)

  const handleOpenCalendar = (url: string) => {
    window.open(url, '_blank')
    setIsOpenAlertDialog(false)

    setDate(undefined)
    setHour(null)
    setSpecialist(user?.crm ? user : null)
  }

  return (
    <div className="flex items-center">
      <AlertDialog open={isOpenAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Adicionar ao calendário pessoal</AlertDialogTitle>
            <AlertDialogDescription>
              Escolha o calendário que deseja adicionar o agendamento
            </AlertDialogDescription>
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button size="sm" onClick={() => handleOpenCalendar(googleUrl)}>
                Google Calendar
              </Button>
              <Button size="sm" onClick={() => handleOpenCalendar(outlookUrl)}>
                Outlook
              </Button>
              <Button
                size="sm"
                onClick={() => handleOpenCalendar(office365Url)}
              >
                Office 365
              </Button>
              <Button size="sm" onClick={() => handleOpenCalendar(yahooUrl)}>
                Yahoo Calendar
              </Button>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex-col justify-between rounded-lg p-10 md:flex">
        <div className="space-y-4">
          <div className="flex flex-row items-center gap-3">
            <Clock className="h-6 w-6 text-primary" />

            <h1 className="text-2xl font-semibold tracking-tight">
              Novo agendamento
            </h1>
          </div>
          <p className="pb-2 text-sm text-muted-foreground">
            Selecione um médico, data e horário para agendar uma consulta.
          </p>

          <div className="flex flex-col space-y-4">
            <div className="flex flex-col gap-2">
              <Label>Paciente</Label>
              <Input disabled value={user?.name} />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <div className="flex flex-col gap-2">
                  <Label>Especialidade</Label>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Heart className="mr-4 h-4 w-4 text-primary" />
                    {specialty ? (
                      specialty.name
                    ) : (
                      <span className="text-muted-foreground">
                        Selecione a especialidade
                      </span>
                    )}
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <Command>
                  <CommandInput placeholder="Pesquise especialidades..." />
                  <CommandList>
                    <CommandEmpty>
                      Nenhuma especialidade encontrada
                    </CommandEmpty>
                    <CommandGroup>
                      {Array.isArray(specialties) &&
                        specialties.map((spec) => (
                          <CommandItem
                            key={spec.id}
                            onSelect={() => setSpecialty(spec)}
                          >
                            {spec.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <div className="flex flex-col gap-2">
                  <Label>Médico</Label>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Stethoscope className="mr-4 h-4 w-4 text-primary" />
                    {specialist ? (
                      specialist.name
                    ) : (
                      <span className="text-muted-foreground">
                        Selecione o médico
                      </span>
                    )}
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <Command>
                  <CommandInput placeholder="Pesquise médicos..." />
                  <CommandList>
                    <CommandEmpty>Nenhum médico encontrado</CommandEmpty>
                    <CommandGroup>
                      {filteredDoctors?.map((doc) => (
                        <CommandItem
                          key={doc.id}
                          onSelect={() => setSpecialist(doc)}
                        >
                          {doc.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <div className="flex flex-col gap-2">
                  <Label>Data</Label>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-4 h-4 w-4 text-primary" />
                    {date ? (
                      format(date, 'PPP', { locale: ptBR })
                    ) : (
                      <span className="text-muted-foreground">
                        Selecione a data
                      </span>
                    )}
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  modifiers={{
                    disabled: (date) =>
                      !isToday(date) && isBefore(date, new Date()),
                  }}
                />
              </PopoverContent>
            </Popover>

            <div className="flex flex-col gap-2 pb-4">
              <Label className="text-lg">Horários</Label>

              <TimeSlots
                label="Selecione o horário da consulta"
                date={date ? format(date, 'yyyy-MM-dd') : ''}
                times={times}
                onSelect={setHour}
              />
            </div>

            <Button
              size="lg"
              title="Realizar agendamento"
              className="w-full gap-2"
              onClick={handleCreateNewSchedule}
            >
              <Check />
              Agendar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
