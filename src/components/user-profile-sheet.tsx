import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getUser } from '@/api/get-user'
import { updateProfile } from '@/api/update-profile'
import SelectAvatar from '@/components/select-avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { axiosErrorHandler } from '@/utils/axiosErrorHandler'

const userProfileSchema = z
  .object({
    name: z.string().min(3, { message: 'Digite o nome completo.' }),
    username: z.string(),
    age: z.preprocess(
      (val) => (val === '' ? null : val),
      z.coerce.number().int().positive().nullable(),
    ),
    weight: z.string().optional(),
    height: z.string().optional(),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Se a senha antiga for fornecida, a nova senha deve ser fornecida
      if (data.oldPassword) {
        return (
          !!data.newPassword &&
          data.newPassword.length >= 6 &&
          /[A-Z]/.test(data.newPassword) &&
          /[0-9]/.test(data.newPassword)
        )
      }

      return true
    },
    {
      message:
        'Nova senha é obrigatória e deve seguir as regras se a senha antiga for fornecida.',
      path: ['newPassword'],
    },
  )

type UserProfileSchema = z.infer<typeof userProfileSchema>

export function UserProfileSheet() {
  const { toast } = useToast()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: Infinity,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileSchema>({
    resolver: zodResolver(userProfileSchema),
    values: {
      name: user?.name ?? '',
      username: user?.username ?? '',
      age: user?.patient.age ?? null,
      weight: user?.patient.weight ?? '',
      height: user?.patient.height ?? '',
    },
  })

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
  })
  console.log(selectedFile)
  async function handleUpdateProfile(data: UserProfileSchema) {
    try {
      await updateProfileFn({
        id: user?.id?.toString() ?? '',
        // avatar: selectedFile,
        name: data.name,
        age: data.age,
        weight: data.weight,
        height: data.height,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      })
      toast({
        variant: 'default',
        title: 'Perfil',
        description: 'Perfil atualizado com sucesso!',
      })
    } catch (error) {
      const errorMessage = axiosErrorHandler(error)

      toast({
        variant: 'destructive',
        title: 'Perfil',
        description: errorMessage,
      })
    }
  }

  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Editar perfil</SheetTitle>
        <SheetDescription>
          Faça alterações em seu perfil aqui. Clique em salvar quando terminar.
        </SheetDescription>
      </SheetHeader>

      <div className="items-center py-4">
        <SelectAvatar onImageSelect={setSelectedFile} />
      </div>
      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="items-center space-y-2">
          <div>
            <Label htmlFor="name">Nome completo</Label>
            <Input className="mt-1" id="name" {...register('name')} />
          </div>
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              className="mt-1"
              disabled={true}
              id="username"
              {...register('username')}
            />
          </div>
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}

          <div>
            <Label htmlFor="age">Idade</Label>
            <Input
              className="mt-1"
              id="age"
              placeholder="Sua idade"
              type="number"
              {...register('age')}
            />
          </div>
          {errors.age && (
            <p className="text-sm text-red-500">{errors.age.message}</p>
          )}

          <div>
            <Label htmlFor="weight">Peso</Label>
            <Input
              className="mt-1"
              id="weight"
              placeholder="Ex: 70,2"
              {...register('weight')}
            />
          </div>
          {errors.weight && (
            <p className="text-sm text-red-500">{errors.weight.message}</p>
          )}

          <div>
            <Label htmlFor="height">Altura</Label>
            <Input
              className="mt-1"
              id="height"
              placeholder="Ex: 1,70"
              {...register('height')}
            />
          </div>
          {errors.height && (
            <p className="text-sm text-red-500">{errors.height.message}</p>
          )}

          <div>
            <Label htmlFor="oldPassword">Senha antiga</Label>
            <PasswordInput
              className="mt-1"
              id="oldPassword"
              placeholder="Digite a senha antiga"
              {...register('oldPassword')}
            />
          </div>
          {errors.oldPassword && (
            <p className="text-sm text-red-500">{errors.oldPassword.message}</p>
          )}

          <div>
            <Label htmlFor="newPassword">Nova senha</Label>
            <PasswordInput
              className="mt-1"
              id="newPassword"
              placeholder="Digite a nova senha"
              {...register('newPassword')}
            />
          </div>
          {errors.newPassword && (
            <p className="text-sm text-red-500">{errors.newPassword.message}</p>
          )}
        </div>

        <SheetFooter className="pt-8">
          <SheetClose asChild>
            <Button variant="ghost" type="button" onClick={() => reset()}>
              Cancelar
            </Button>
          </SheetClose>
          <Button type="submit" disabled={isSubmitting}>
            Salvar
          </Button>
        </SheetFooter>
      </form>
    </SheetContent>
  )
}
