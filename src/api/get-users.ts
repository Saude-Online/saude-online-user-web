import { api } from '@/lib/axios'

import type { PatientProps } from './get-user'

export interface GetUsersResponse {
  users: {
    id: string
    name: string
    username: string
    crm: string
    role: string
    patient: PatientProps
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
