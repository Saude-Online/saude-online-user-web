import { api } from '@/lib/axios'

export interface RegisterScheduleBody {
  patient: {
    name: string
    age: number
    document: string
  }
  dateHour: string
}

export async function registerSchedule({
  patient,
  dateHour,
}: RegisterScheduleBody) {
  await api.post('/schedules', { patient, dateHour })
}
