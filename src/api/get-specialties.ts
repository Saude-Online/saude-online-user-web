import { api } from '@/lib/axios'

export interface GetSpecialtiesResponse {
  specialties: {
    id: string
    name: string
  }
}

export async function getSpecialties() {
  const response = await api.get<GetSpecialtiesResponse>('/specialties')

  return response.data.specialties
}
