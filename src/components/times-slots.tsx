import { useQuery } from '@tanstack/react-query'
import { isBefore, isEqual, parseISO } from 'date-fns'
import { useState } from 'react'

import { getSchedule } from '@/api/get-schedule'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

type TimeSlotProps = {
  label: string
  date: string
  times: { time: string }[]
  onSelect: (time: string) => void
}

export function TimeSlots({ label, date, times, onSelect }: TimeSlotProps) {
  const { data: schedule = [] } = useQuery({
    queryKey: ['schedules'],
    queryFn: getSchedule,
    staleTime: Infinity,
  })

  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const handleSelect = (value: string) => {
    setSelectedTime(value)
    onSelect(value)
  }

  const isTimeBooked = (time: string) => {
    // Concatena a data com o horário para formar o DateTime completo
    const selectedDateTime = parseISO(`${date}T${time}:00`)

    const now = new Date()

    // Verifica se o horário é retroativo
    if (isBefore(selectedDateTime, now)) {
      return true // Desabilita se for retroativo
    }

    return schedule.some((booked: { dateHour: string }) => {
      const bookedDateTime = parseISO(booked.dateHour) // Converte o horário do agendamento para um objeto Date

      return isEqual(bookedDateTime, selectedDateTime) // Compara se o horário do agendamento é igual ao horário selecionado
    })
  }

  return (
    <div>
      <Label className="text-sm font-normal text-muted-foreground">
        {label}
      </Label>
      <ToggleGroup
        type="single"
        value={selectedTime ?? ''}
        onValueChange={handleSelect}
        className="flex flex-wrap justify-start gap-3 py-2"
      >
        {times.map((time) => (
          <ToggleGroupItem
            key={time.time}
            variant="outline"
            value={time.time}
            className="w-16 bg-background"
            disabled={!date || isTimeBooked(time.time)}
          >
            {time.time}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
