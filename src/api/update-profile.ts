import { api } from '@/lib/axios'

interface UpdateProfileBody {
  id: string
  name: string
  age?: number | null
  weight?: string
  height?: string
  oldPassword?: string
  newPassword?: string
}

export async function updateProfile({
  id,
  name,
  age,
  weight,
  height,
  oldPassword,
  newPassword,
}: UpdateProfileBody) {
  const data: { [key: string]: string | number | null | undefined } = {
    name,
    age,
    weight,
    height,
  }

  if (oldPassword) {
    data.oldPassword = oldPassword
  }

  if (newPassword) {
    data.newPassword = newPassword
  }

  await api.put(`/users/${id}`, data)
}
