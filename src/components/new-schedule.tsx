import { useMutation, useQuery } from '@tanstack/react-query'
import {
  type CalendarEvent,
  google,
  office365,
  outlook,
  yahoo,
} from 'calendar-link'
import { format, isBefore, isToday, set } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar as CalendarIcon,
  Check,
  ClipboardPlus,
  Clock,
  Heart,
  Hospital,
  Stethoscope,
} from 'lucide-react'
import { useState } from 'react'
import { PIX } from 'react-qrcode-pix'

import { getExams } from '@/api/get-exams'
import { getSpecialties } from '@/api/get-specialties'
import { getUser, type PatientProps } from '@/api/get-user'
import { getUsers } from '@/api/get-users'
import { registerExamSchedule } from '@/api/register-exam-schedule'
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

interface RegisterScheduleBody {
  specialistId: string
  specialtyId: string
  patientId: string
  dateHour: string
  formattedValue: string
}

interface RegisterExamScheduleBody {
  examId: string
  patientId: string
  dateHour: string
  formattedValue: string
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

  const {
    data: specialties = [] as {
      id: string
      name: string
      formattedValue: string
    }[],
  } = useQuery({
    queryKey: ['specialties'],
    queryFn: getSpecialties,
    staleTime: Infinity,
  })

  const {
    data: exams = [] as { id: string; name: string; formattedValue: string }[],
  } = useQuery({
    queryKey: ['exams'],
    queryFn: getExams,
    staleTime: Infinity,
  })

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

  const { mutateAsync: registerExamScheduleFn } = useMutation({
    mutationFn: registerExamSchedule,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['exams-schedules'] })

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
    formattedValue: string
  } | null>(null)
  const [exam, setExam] = useState<{
    id: string
    name: string
    formattedValue: string
  } | null>(null)
  const [specialist, setSpecialist] = useState<DoctorProps | null>(
    user?.crm ? user : null,
  )
  const [date, setDate] = useState<Date>()
  const [hour, setHour] = useState<string | null>(null)
  const [schedule, setSchedule] = useState<
    RegisterScheduleBody | RegisterExamScheduleBody | undefined
  >(undefined)
  const [isOpenAlertDialog, setIsOpenAlertDialog] = useState<boolean>(false)

  const [pix, setPix] = useState<string>('')
  const [schedulePaid, setSchedulePaid] = useState<boolean | undefined>(
    undefined,
  )
  const [examPaid, setExamPaid] = useState<boolean | undefined>(undefined)

  const handleCopyPix = () => {
    navigator.clipboard
      .writeText(pix)
      .then(() => {
        return toast({
          variant: 'default',
          title: 'PIX',
          description: 'Código copiado para a área de transferência.',
        })
      })
      .catch((err) => {
        console.error('Erro ao copiar para a área de transferência:', err)
      })
  }

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

  function handleCreateSchedule(type: 'consulta' | 'exame') {
    return async () => {
      try {
        let scheduleData: RegisterScheduleBody | RegisterExamScheduleBody

        if (type === 'consulta') {
          if (!specialist || !date || !hour) {
            return toast({
              variant: 'destructive',
              title: 'Agendamento',
              description: 'Preencha todos os campos para agendar a consulta.',
            })
          }

          scheduleData = {
            specialistId: specialist.id,
            specialtyId: specialty?.id ?? '',
            patientId: user?.patient.id ?? '',
            formattedValue: specialty?.formattedValue ?? '',
            dateHour,
          }

          setSchedule(scheduleData)
          setSchedulePaid(false)

          await registerScheduleFn(scheduleData as RegisterScheduleBody)
        } else {
          if (!exam || !date || !hour) {
            return toast({
              variant: 'destructive',
              title: 'Agendamento',
              description: 'Preencha todos os campos para agendar o exame.',
            })
          }

          scheduleData = {
            examId: exam.id,
            patientId: user?.patient.id ?? '',
            formattedValue: exam?.formattedValue ?? '',
            dateHour,
          }

          setSchedule(scheduleData)
          setExamPaid(false)

          await registerExamScheduleFn(scheduleData as RegisterExamScheduleBody)
        }
      } catch (error) {
        const errorMessage = axiosErrorHandler(error)
        toast({
          variant: 'destructive',
          title: 'Agendamento',
          description: errorMessage,
        })
      } finally {
        setDate(undefined)
        setHour(null)
        if (type === 'consulta') {
          setSpecialty(null)
          setSpecialist(user?.crm ? user : null)
        } else {
          setExam(null)
        }
      }
    }
  }

  const event: CalendarEvent = {
    title: 'Consulta médica',
    description: 'Agendamento - Saúde Online',
    start: `${schedule?.dateHour.replace('T', ' ')} +0300`,
    duration: [30, 'minutes'],
  }

  const googleUrl = google(event)
  const outlookUrl = outlook(event)
  const office365Url = office365(event)
  const yahooUrl = yahoo(event)

  const handleOpenCalendar = (url: string) => {
    window.open(url, '_blank')
    setIsOpenAlertDialog(false)
  }

  function parseCurrencyToNumber(value: string): number {
    return Number.parseFloat(
      value
        .replace('R$', '') // Remove o símbolo da moeda
        .replace('.', '') // Remove os separadores de milhar
        .replace(',', '.') // Substitui vírgula por ponto para o separador decimal
        .trim(), // Remove espaços extras
    )
  }

  function renderPix(value: string, type: 'consulta' | 'exame') {
    const amount = parseCurrencyToNumber(value)

    return (
      <Card>
        <div className="my-4 flex flex-col items-center space-y-8">
          <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-4">
            <h1 className="my-4 text-xl font-medium">Pague com PIX</h1>
            <small className="text-center leading-tight text-muted-foreground">
              {user?.name}, para você pagar, basta escanear o QR Code abaixo ou
              copiar o código abaixo e pagar pelo aplicativo do banco.
            </small>

            <h1 className="text-xl font-semibold">
              {schedule?.formattedValue}
            </h1>
          </div>
          <PIX
            pixkey="lorenzo.werle@gmail.com"
            amount={amount}
            merchant="Saúde Online"
            city="Guarapuava"
            onLoad={(pix) => setPix(pix)}
            variant="standard"
            color="#0f0f0f"
          />

          <div className="flex flex-col items-center gap-2">
            <code className="mx-auto h-10 max-w-sm overflow-auto whitespace-nowrap">
              {pix}
            </code>

            <Button onClick={handleCopyPix} variant="secondary">
              Copiar código PIX
            </Button>

            <Button
              onClick={
                type === 'consulta'
                  ? () => setSchedulePaid(true)
                  : () => setExamPaid(true)
              }
              size="sm"
              variant="ghost"
            >
              Marcar como pago
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="consulta" className="max-w-[800px]">
      <TabsList>
        <TabsTrigger disabled={examPaid === false} value="consulta">
          Consulta
        </TabsTrigger>
        <TabsTrigger disabled={schedulePaid === false} value="exame">
          Exame
        </TabsTrigger>
      </TabsList>
      <TabsContent value="consulta">
        {schedulePaid === false ? (
          renderPix(schedule?.formattedValue, 'consulta')
        ) : (
          <div className="flex-1">
            <AlertDialog open={isOpenAlertDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Adicionar ao calendário pessoal
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Escolha o calendário que deseja adicionar o agendamento
                  </AlertDialogDescription>
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                      size="sm"
                      onClick={() => handleOpenCalendar(googleUrl)}
                    >
                      Google Calendar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleOpenCalendar(outlookUrl)}
                    >
                      Outlook
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleOpenCalendar(office365Url)}
                    >
                      Office 365
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleOpenCalendar(yahooUrl)}
                    >
                      Yahoo Calendar
                    </Button>
                  </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-row gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  Agendamento de consulta
                </CardTitle>
                <CardDescription>
                  Selecione um médico, data e horário para agendar uma consulta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex-col justify-between rounded-lg md:flex">
                  <div className="space-y-4">
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
                                      className="flex-row items-center justify-between gap-10"
                                      onSelect={() => setSpecialty(spec)}
                                    >
                                      <p>{spec.name}</p>

                                      <p className="font-semibold">
                                        {spec.formattedValue}
                                      </p>
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
                              <CommandEmpty>
                                Nenhum médico encontrado
                              </CommandEmpty>
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
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  disabled={!specialty?.id || !specialist?.id || !dateHour}
                  size="lg"
                  title="Realizar agendamento"
                  className="w-full gap-2"
                  onClick={handleCreateSchedule('consulta')}
                >
                  <Check />
                  Agendar consulta{' '}
                  {specialty && ` - ${specialty?.formattedValue}`}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </TabsContent>
      <TabsContent value="exame">
        {examPaid === false ? (
          renderPix(schedule?.formattedValue, 'exame')
        ) : (
          <div className="flex-1">
            <AlertDialog open={isOpenAlertDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Adicionar ao calendário pessoal
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Escolha o calendário que deseja adicionar o agendamento
                  </AlertDialogDescription>
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                      size="sm"
                      onClick={() => handleOpenCalendar(googleUrl)}
                    >
                      Google Calendar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleOpenCalendar(outlookUrl)}
                    >
                      Outlook
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleOpenCalendar(office365Url)}
                    >
                      Office 365
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleOpenCalendar(yahooUrl)}
                    >
                      Yahoo Calendar
                    </Button>
                  </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-row gap-3">
                  <ClipboardPlus className="h-6 w-6 text-primary" />
                  Agendamento de exame
                </CardTitle>
                <CardDescription>
                  Selecione o exame, data e horário para agendar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex-col justify-between rounded-lg md:flex">
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-col gap-2">
                        <Label>Paciente</Label>
                        <Input disabled value={user?.name} />
                      </div>

                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="flex flex-col gap-2">
                            <Label>Exame</Label>
                            <Button
                              size="lg"
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <Hospital className="mr-4 h-4 w-4 text-primary" />
                              {exam ? (
                                exam.name
                              ) : (
                                <span className="text-muted-foreground">
                                  Selecione o exame
                                </span>
                              )}
                            </Button>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <Command>
                            <CommandInput placeholder="Pesquise exames..." />
                            <CommandList>
                              <CommandEmpty>
                                Nenhum exame encontrado
                              </CommandEmpty>
                              <CommandGroup>
                                {Array.isArray(exams) &&
                                  exams.map((exam) => (
                                    <CommandItem
                                      key={exam.id}
                                      className="flex-row items-center justify-between gap-10"
                                      onSelect={() => setExam(exam)}
                                    >
                                      <p>{exam.name}</p>

                                      <p className="font-semibold">
                                        {exam.formattedValue}
                                      </p>
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
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  disabled={!exam?.id || !dateHour}
                  size="lg"
                  title="Realizar agendamento"
                  className="w-full gap-2"
                  onClick={handleCreateSchedule('exame')}
                >
                  <Check />
                  Agendar {exam?.name}
                  {exam && ` - ${exam?.formattedValue}`}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
