import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { addHours, format } from 'date-fns'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getSchedule } from '@/api/get-schedule'

import { TimeSlots } from './times-slots'

// Mock do módulo getSchedule
vi.mock('@/api/get-schedule', () => ({
  getSchedule: vi.fn(),
}))

// Mock de resposta do getSchedule
const mockSchedule = [
  {
    id: '1',
    dateHour: '2024-12-04T14:00:00', // Horário já agendado
    value: 'someValue',
    patient: { id: '1', name: 'John Doe' },
  },
]

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

// Props de teste do componente TimeSlots
const mockProps = {
  label: 'Horários disponíveis',
  date: '2024-12-04',
  times: [
    { time: '09:00' },
    { time: '10:00' },
    { time: '14:00' }, // Horário já agendado
    { time: '15:00' },
  ],
  onSelect: vi.fn(), // Função mockada para verificar se é chamada ao selecionar um horário
}

// Função para renderizar o componente TimeSlots com as props fornecidas
function renderTimeSlots(props = mockProps) {
  return render(
    <QueryClientProvider client={queryClient}>
      <TimeSlots {...props} />
    </QueryClientProvider>,
  )
}

describe('TimeSlots', () => {
  beforeEach(() => {
    vi.clearAllMocks() // Limpa os mocks antes de cada teste
    // Mock da implementação do getSchedule para retornar mockSchedule
    vi.mocked(getSchedule).mockResolvedValue(mockSchedule)
  })

  // Testa se o label é renderizado corretamente
  it('should render the label correctly', () => {
    renderTimeSlots()
    expect(screen.getByText(mockProps.label)).toBeInTheDocument()
  })

  // Testa se todos os horários são renderizados corretamente
  it('should render all time slots', () => {
    renderTimeSlots()
    for (const time of mockProps.times) {
      expect(screen.getByText(time.time)).toBeInTheDocument()
    }
  })

  // Testa se a função onSelect é chamada ao clicar em um horário disponível
  it('should call onSelect when a time slot is clicked', async () => {
    renderTimeSlots()
    const timeSlot = screen.getByText('09:00') // Horário disponível

    fireEvent.click(timeSlot) // Simula o clique

    // Teste para verificar se a função onSelect foi chamada com o horário correto
    expect(mockProps.onSelect).toHaveBeenCalledWith('09:00')
  })

  // Testa se os horários já agendados estão desabilitados
  it('should disable booked time slots', async () => {
    renderTimeSlots()
    const bookedTimeSlot = screen.getByText('14:00') // Horário já agendado

    // Teste para verificar se o horário está desabilitado
    expect(bookedTimeSlot).toBeDisabled()
  })

  // Testa se os horários passados (antes do momento atual) estão desabilitados
  it('should disable past time slots', () => {
    const pastDate = format(addHours(new Date(), -2), 'yyyy-MM-dd') // Data de 2 horas atrás
    const pastTime = format(addHours(new Date(), -2), 'HH:mm') // Hora de 2 horas atrás

    renderTimeSlots({
      ...mockProps,
      date: pastDate, // Passando a data do passado
      times: [{ time: pastTime }], // Passando o horário do passado
    })

    const pastTimeSlot = screen.getByText(pastTime) // Verifica o horário passado
    expect(pastTimeSlot).toBeDisabled() // Verifica se o horário está desabilitado
  })

  // Testa se todos os horários são desabilitados quando nenhuma data é selecionada
  it('should disable all time slots when no date is selected', () => {
    renderTimeSlots({
      ...mockProps,
      date: '', // Sem data selecionada
    })

    // Teste para verificar se todos os horários estão desabilitados
    for (const time of mockProps.times) {
      const timeSlot = screen.getByText(time.time)
      expect(timeSlot).toBeDisabled()
    }
  })
})
