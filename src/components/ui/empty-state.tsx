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
  <div className={cn('flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 py-16 text-center', className)}>
    <Icon className="h-10 w-10 text-gray-300 dark:text-gray-600" />
    <div>
      <p className="font-medium text-gray-700 dark:text-gray-300">{title}</p>
      {description && <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{description}</p>}
    </div>
    {action}
  </div>
)

export { EmptyState }
