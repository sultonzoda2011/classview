import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

/** Центрированный спиннер для состояний загрузки страницы/секции */
const Spinner = ({ className, label }: { className?: string; label?: string }) => (
  <div className={cn('flex flex-col items-center justify-center gap-2 py-10 text-gray-400 dark:text-gray-500', className)}>
    <Loader2 className="h-6 w-6 animate-spin" />
    {label && <span className="text-sm">{label}</span>}
  </div>
)

export { Spinner }
