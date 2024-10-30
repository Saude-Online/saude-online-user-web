import { api } from '@/lib/axios'

interface UpdateProfileBody {
  id: string
  name: string
  oldPassword?: string
  newPassword?: string
}

export async function updateProfile({
  id,
  name,
  oldPassword,
  newPassword,
}: UpdateProfileBody) {
  const data: Record<string, string | undefined> = { name }

  if (oldPassword) {
    data.oldPassword = oldPassword
  }

  if (newPassword) {
    data.newPassword = newPassword
  }

  await api.put(`/users/${id}`, data)
}
