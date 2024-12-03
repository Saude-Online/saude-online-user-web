import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { signIn } from '@/api/sign-in'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { useToast } from '@/components/ui/use-toast'
import { queryClient } from '@/lib/react-query'
import { axiosErrorHandler } from '@/utils/axiosErrorHandler'

const signInForm = z.object({
  username: z.string().min(1, { message: 'Informe o nome de usuário.' }),
  password: z.string().min(1, { message: 'Informe a senha.' }),
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  const navigate = useNavigate()

  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  async function handleSignIn(user: SignInForm) {
    try {
      const authenticatedUser = await authenticate({
        username: user.username,
        password: user.password,
      })

      if (authenticatedUser.role === 'ADMIN') {
        toast({
          variant: 'destructive',
          title: 'Acesso restrito',
          description:
            'Seu usuário é um administrador e não pode acessar o painel do usuário.',
        })
        return
      }

      queryClient.invalidateQueries({ queryKey: ['user'] })

      navigate('/', { replace: true })
    } catch (error) {
      const errorMessage = axiosErrorHandler(error)

      console.error(error)

      toast({
        variant: 'destructive',
        title: 'Acessar',
        description: errorMessage,
      })
    }
  }

  return (
    <>
      <Helmet title="Login" />

      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="flex w-[300px] flex-col justify-center gap-6 md:w-[500px]">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Acessar</h1>
            <p className="text-sm text-muted-foreground">
              Olá, seja bem-vindo(a)!
            </p>
          </div>

          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Seu usuário</Label>
              <Input id="username" type="text" {...register('username')} />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2 pb-8">
              <Label htmlFor="password">Sua senha</Label>
              <PasswordInput id="password" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              Entrar
            </Button>
            <div className="flex flex-row items-center justify-center pb-12">
              <p className="text-sm">Ainda não possui uma conta?</p>
              <Button asChild variant="link">
                <Link to="/sign-up">Nova conta</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
