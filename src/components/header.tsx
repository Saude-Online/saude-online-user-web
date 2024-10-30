import { HeartPulse } from 'lucide-react'
import { Link } from 'react-router-dom'

import { AccountMenu } from '@/components/account-menu'

export function Header() {
  return (
    <div className="bg-primary px-8">
      <div className="flex h-20 items-center justify-between px-6 font-medium text-white">
        <Link to="/">
          <div className="flex items-center gap-3 text-lg">
            <HeartPulse className="size-8 text-red-500" />
            <span className="text-xl tracking-wider">SaúdeOnline</span>
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <AccountMenu />
        </div>
      </div>
    </div>
  )
}
