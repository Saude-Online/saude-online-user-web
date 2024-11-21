import { api } from '@/lib/axios'

export interface GetExamScheduleResponse {
  examSchedules: {
    id: string
    dateHour: string
    value: string
    patient: {
      id: string
      name: string
    }
  }[]
}

export async function getExamSchedule() {
  const response = await api.get<GetExamScheduleResponse>('/exam-schedules')

  return response.data.examSchedules
}
