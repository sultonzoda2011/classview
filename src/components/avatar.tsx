import { cn } from '../lib/utils'

/** Единый круглый аватар-инициал — используется в хедере и на странице профиля. */
export const Avatar = ({ name, size = 'md' }: { name?: string; size?: 'md' | 'lg' }) => (
  <div
    className={cn(
      'flex items-center justify-center rounded-full bg-gray-800 dark:bg-gray-600 font-bold text-white select-none shadow-sm',
      size === 'md' ? 'h-10 w-10 sm:h-11 sm:w-11 text-base' : 'h-20 w-20 text-2xl',
    )}
  >
    {name?.charAt(0).toUpperCase() ?? '?'}
  </div>
)
