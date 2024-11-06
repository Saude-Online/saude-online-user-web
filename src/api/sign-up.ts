import { api } from '@/lib/axios'

import { registerPatient } from './register-patient'

export interface SignUpBody {
  name: string
  username: string
  password: string
  document: string
  phone: string | null
}

export async function signUp({
  name,
  username,
  password,
  document,
  phone,
}: SignUpBody) {
  const { data } = await api.post('/users', { name, username, password }) // Criar usuário

  await registerPatient({
    // Criar paciente com base no registro do usuário
    name,
    age: null,
    document,
    phone,
    userId: data.userId,
  })
}
