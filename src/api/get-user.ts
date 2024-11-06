import { api } from '@/lib/axios'

export type PatientProps = {
  id: string
  name: string
  age: number
  document: string
  phone: string
  createdAt: Date
  updatedAt: Date
}

export interface GetUserResponse {
  user: {
    id: string
    name: string
    username: string
    crm: string
    role: string
    patient: PatientProps
    createdAt: Date
    updatedAt: Date
  }
}

export async function getUser() {
  const response = await api.get<GetUserResponse>('/me')

  return response.data.user
}
