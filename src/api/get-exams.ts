import { api } from '@/lib/axios'

export interface GetExamsResponse {
  exams: {
    id: string
    name: string
    value: string
  }
}

export async function getExams() {
  const response = await api.get<GetExamsResponse>('/exams')

  return response.data.exams
}
