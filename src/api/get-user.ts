import { api } from '@/lib/axios'

import { GetPatientsResponse } from './get-patients'

export interface GetUserResponse {
  user: {
    id: string
    name: string
    username: string
    password: string
    createdAt: Date
    updatedAt: Date
    patient: GetPatientsResponse
  }
}

export async function getUser() {
  const response = await api.get<GetUserResponse>(`/me`)

  return response.data.user
}
