import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../lib/languages'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

/** Единый переключатель языка — используется в логине, хедере и меню пользователя. */
const LanguageSelect = () => {
  const { t, i18n } = useTranslation()
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 px-2">
          <img src={current.flag} alt="" className="w-5 h-5 rounded-full object-cover" />
          <span className="hidden sm:inline">{t(current.labelKey)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem key={lang.code} onClick={() => i18n.changeLanguage(lang.code)} className="gap-2">
            <img src={lang.flag} alt="" className="w-4 h-4 rounded-full object-cover" />
            <span className="flex-1">{t(lang.labelKey)}</span>
            {lang.code === current.code && <Check className="w-4 h-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSelect
