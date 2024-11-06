import { api } from '@/lib/axios'

export interface RegisterScheduleBody {
  specialistId: string
  patientId: string
  dateHour: string
}

export async function registerSchedule({
  specialistId,
  patientId,
  dateHour,
}: RegisterScheduleBody) {
  await api.post('/schedules', { specialistId, patientId, dateHour })
}
