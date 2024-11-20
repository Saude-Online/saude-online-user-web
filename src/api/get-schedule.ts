import { api } from '@/lib/axios'

export interface GetScheduleResponse {
  schedules: {
    id: string
    dateHour: string
    value: string
    patient: {
      id: string
      name: string
    }
  }[]
}

export async function getSchedule() {
  const response = await api.get<GetScheduleResponse>('/schedules')

  return response.data.schedules
}
