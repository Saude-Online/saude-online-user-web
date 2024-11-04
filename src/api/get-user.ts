import { api } from '@/lib/axios'

export interface GetPatientsResponse {
  patients: {
    id: string
    name: string
    age: number
    document: string
    phone: string
    createdAt: Date
    updatedAt: Date
  }[]
}

export interface GetSpecialtiesResponse {
  specialties: {
    id: string
    name: string
  }[]
}

export interface GetUserResponse {
  user: {
    id: string
    name: string
    username: string
    password: string
    createdAt: Date
    updatedAt: Date
    patient: GetPatientsResponse
    specialist: GetSpecialtiesResponse
  }
}

export async function getUser() {
  const response = await api.get<GetUserResponse>(`/me`)

  return response.data.user
}
