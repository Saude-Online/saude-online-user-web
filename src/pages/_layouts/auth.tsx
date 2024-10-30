import { HeartPulse } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col antialiased">
      <div className="flex justify-center border-b bg-primary">
        <div className="flex h-24 items-center gap-6 px-6">
          <div className="flex items-center gap-3 text-lg">
            <HeartPulse className="size-10 text-red-500" />
            <span className="flex flex-row text-2xl font-medium tracking-wider text-secondary">
              SaúdeOnline
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
        <Outlet />
      </div>
    </div>
  )
}
