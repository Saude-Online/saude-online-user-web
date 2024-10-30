import { api } from '@/lib/axios'

export interface RegisterPatientBody {
  name: string
  age: number | null
  document: string
  phone: string | null
  userId: string
}

export async function registerPatient({
  name,
  age,
  document,
  phone,
  userId,
}: RegisterPatientBody) {
  await api.post('/patients', { name, age, document, phone, userId })
}
