import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

type PageHeaderProps = {
  title: string
  actions?: ReactNode
  className?: string
}

/** Заголовок страницы: название слева, действия справа. Заменяет breadcrumbs из шапки. */
const PageHeader = ({ title, actions, className }: PageHeaderProps) => (
  <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className)}>
    <h1 className="min-w-0 truncate text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
)

export default PageHeader
