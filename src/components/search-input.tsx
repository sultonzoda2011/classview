import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from './ui/input'

/** Единое поле поиска — используется на страницах центров, классов, пользователей, стримов. */
const SearchInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const { t } = useTranslation()
  return (
    <div className="relative w-full sm:w-1/2 mb-6">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={t('common.searchPlaceholder')} className="pl-10" />
    </div>
  )
}

export default SearchInput
