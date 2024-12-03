import { api } from '@/lib/axios'

export interface SignInBody {
  username: string
  password: string
}

interface SignInResponse {
  token: string
  role: 'USER' | 'ADMIN'
}

export async function signIn({
  username,
  password,
}: SignInBody): Promise<SignInResponse> {
  const response = await api.post('/sessions', { username, password })

  return {
    token: response.data.token,
    role: response.data.role,
  }
}
