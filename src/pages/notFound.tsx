import { SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

const NotFound = () => {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX aria-hidden="true" className="size-6" />
      </div>
      <div className="max-w-md space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{t('pages.notFound.title')}</h1>
        <p className="text-muted-foreground">{t('pages.notFound.description')}</p>
      </div>
      <Button asChild size="lg">
        <Link to="/streams">{t('pages.notFound.backToStreams')}</Link>
      </Button>
    </div>
  )
}

export default NotFound
