import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  to: string
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  to,
}: FeatureCardProps) {
  return (
    <Card className="flex justify-center p-4">
      <Link title={title} to={to}>
        <CardHeader className="items-center text-center">
          <Icon className="mb-4 size-12 text-primary" />
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Link>
    </Card>
  )
}
