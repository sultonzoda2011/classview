import { cn } from '../lib/utils'

const SIZES = {
  sm: 'size-8 text-sm',
  md: 'size-9 text-sm',
  lg: 'size-20 text-3xl',
} as const

/** Единый круглый аватар-инициал — используется в хедере, таблицах и на странице профиля. */
export const Avatar = ({ name, size = 'md', className }: { name?: string; size?: keyof typeof SIZES; className?: string }) => (
  <div aria-hidden="true" className={cn('flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground select-none', SIZES[size], className)}>
    {name?.trim().charAt(0).toUpperCase() || '?'}
  </div>
)
