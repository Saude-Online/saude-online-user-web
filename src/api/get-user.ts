import type { GetAnamneseResponse } from '@/api/get-anamnese'
import type { GetExamScheduleResponse } from '@/api/get-exam-schedule'
import type { GetScheduleResponse } from '@/api/get-schedule'
import { api } from '@/lib/axios'

export type PatientProps = {
  id: string
  name: string
  avatar: string
  age: number
  weight: string
  height: string
  document: string
  phone: string
  schedules?: GetScheduleResponse
  examSchedule?: GetExamScheduleResponse
  anamneses?: GetAnamneseResponse
  createdAt: Date
  updatedAt: Date
}

export type HistoricProps = {
  schedules?: GetScheduleResponse
  examSchedule?: GetExamScheduleResponse
  anamneses?: GetAnamneseResponse
}

export interface GetUserResponse {
  user: {
    id: string
    name: string
    avatar: string
    username: string
    crm: string
    role: string
    patient: PatientProps
    schedules: GetScheduleResponse
    examSchedule: GetExamScheduleResponse
    anamneses: GetAnamneseResponse
    createdAt: Date
    updatedAt: Date
  }
}

export async function getUser() {
  const response = await api.get<GetUserResponse>('/me')

  return response.data.user
}
