import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

/** Центрированный спиннер для состояний загрузки страницы/секции */
const Spinner = ({ className, label }: { className?: string; label?: string }) => (
  <div role="status" className={cn('flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground', className)}>
    <Loader2 className="size-6 animate-spin" />
    {label && <span className="text-sm">{label}</span>}
  </div>
)

export { Spinner }
