import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getUser } from '@/api/get-user'
import { updateProfile } from '@/api/update-profile'
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
    },
  })

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
  })

  async function handleUpdateProfile(data: UserProfileSchema) {
    try {
      await updateProfileFn({
        id: user?.id?.toString() ?? '',
        name: data.name,
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

      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="items-center space-y-2 pt-8">
          <div>
            <Label htmlFor="name">Nome completo</Label>
            <Input className="mt-1" id="name" {...register('name')} />
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              className="mt-1"
              disabled={true}
              id="username"
              {...register('username')}
            />
          </div>

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
