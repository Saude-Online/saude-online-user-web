import { api } from '@/lib/axios'

export interface GetAnamneseResponse {
  anamnesis: {
    id: string
    patientId: string
    age: number
    weight: string
    height: string
    symptoms: string
    medicalHistory: string
    allergies: string
    createdAt: string
    updatedAt: string
  }[]
}

export async function getAnamnese() {
  const response = await api.get<GetAnamneseResponse>('/exam-schedules')

  return response.data.anamnesis
}
