import { api } from '@/lib/axios'

export interface GetScheduleResponse {
  schedules: {
    id: string
    patientId: string
    patient: {
      id: string
      name: string
      age: number
      document: string
      createAt: Date
      updatedAt: Date
    }[]
    date: string
    hour: string
    createdAt: Date
    updatedAt: Date
  }
}

export async function getSchedule() {
  const response = await api.get<GetScheduleResponse>(`/schedules`)

  return response.data.schedules
}
