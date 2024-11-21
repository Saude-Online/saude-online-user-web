import type { GetExamScheduleResponse } from '@/api/get-exam-schedule'
import type { GetScheduleResponse } from '@/api/get-schedule'
import { api } from '@/lib/axios'

export type PatientProps = {
  id: string
  name: string
  age: number
  document: string
  phone: string
  schedules?: GetScheduleResponse
  examSchedule?: GetExamScheduleResponse
  createdAt: Date
  updatedAt: Date
}

export type HistoricProps = {
  schedules?: GetScheduleResponse
  examSchedule?: GetExamScheduleResponse
}

export interface GetUserResponse {
  user: {
    id: string
    name: string
    username: string
    crm: string
    role: string
    patient: PatientProps
    schedules: GetScheduleResponse
    examSchedule: GetExamScheduleResponse
    createdAt: Date
    updatedAt: Date
  }
}

export async function getUser() {
  const response = await api.get<GetUserResponse>('/me')

  return response.data.user
}
