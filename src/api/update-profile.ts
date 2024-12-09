import { api } from '@/lib/axios'

interface UpdateProfileBody {
  id: string
  avatar?: string | null
  name: string
  age?: number | null
  weight?: string
  height?: string
  oldPassword?: string
  newPassword?: string
}

export async function updateProfile({
  id,
  avatar,
  name,
  age,
  weight,
  height,
  oldPassword,
  newPassword,
}: UpdateProfileBody) {
  const data: { [key: string]: string | number | null } = {}

  if (name) data.name = name

  if (avatar !== undefined) data.avatar = avatar
  if (age !== undefined) data.age = age
  if (weight) data.weight = weight
  if (height) data.height = height
  if (oldPassword) data.oldPassword = oldPassword
  if (newPassword) data.newPassword = newPassword

  await api.put(`/users/${id}`, data)
}
