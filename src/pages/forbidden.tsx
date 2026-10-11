import { Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

const Forbidden = () => {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Lock aria-hidden="true" className="size-6" />
      </div>
      <div className="max-w-md space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{t('pages.forbidden.title')}</h1>
        <p className="text-muted-foreground">{t('pages.forbidden.description')}</p>
      </div>
      <Button asChild size="lg" variant="outline">
        <Link to="/login">{t('pages.forbidden.backToLogin')}</Link>
      </Button>
    </div>
  )
}

export default Forbidden
