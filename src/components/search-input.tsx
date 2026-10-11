import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '../lib/utils'
import { Input } from './ui/input'

/** Единое поле поиска — используется на страницах центров, классов, пользователей, стримов. */
const SearchInput = ({ value, onChange, className }: { value: string; onChange: (v: string) => void; className?: string }) => {
  const { t } = useTranslation()
  return (
    <div className={cn('relative w-full sm:w-72', className)}>
      <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={t('common.searchPlaceholder')} aria-label={t('common.search')} className="pl-9" />
    </div>
  )
}

export default SearchInput
