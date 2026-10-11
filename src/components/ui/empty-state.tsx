import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

/** Единое пустое состояние для списков (нет центров, нет классов и т.д.) */
const EmptyState = ({ icon: Icon, title, description, action, className }: EmptyStateProps) => (
  <div className={cn('flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center', className)}>
    <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <Icon className="size-5" aria-hidden="true" />
    </div>
    <div className="space-y-1">
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
    {action}
  </div>
)

export { EmptyState }
