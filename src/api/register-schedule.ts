import { api } from '@/lib/axios'

export interface RegisterScheduleBody {
  specialistId: string
  specialtyId: string
  patientId: string
  dateHour: string
}

export async function registerSchedule({
  specialistId,
  specialtyId,
  patientId,
  dateHour,
}: RegisterScheduleBody) {
  await api.post('/schedules', {
    specialistId,
    specialtyId,
    patientId,
    dateHour,
  })
}
