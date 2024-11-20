import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { getUser } from '@/api/get-user'
import { Header } from '@/components/header'

export function AppLayout() {
  const navigate = useNavigate()

  const {
    data: user,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    retry: false,
  })

  useEffect(() => {
    if (isError) {
      navigate('/sign-in', { replace: true })
    }
  }, [isError, navigate])

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />

      <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
        <Outlet />
      </div>
    </div>
  )
}
