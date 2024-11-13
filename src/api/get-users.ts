import type { GetSpecialtiesResponse } from '@/api/get-specialties'
import type { PatientProps } from '@/api/get-user'
import { api } from '@/lib/axios'

export interface GetUsersResponse {
  users: {
    id: string
    name: string
    username: string
    crm: string
    role: string
    patient: PatientProps
    specialties: GetSpecialtiesResponse
    createdAt: Date
    updatedAt: Date
  }[]
}

interface GetUsersParams {
  isDoctor?: boolean
  query?: string
  page?: number
}

export async function getUsers(params: GetUsersParams = {}) {
  const response = await api.get<GetUsersResponse>('/users', { params })

  return response.data.users
}
