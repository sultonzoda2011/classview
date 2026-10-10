import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

const NotFound = () => {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-100 to-slate-300 dark:from-gray-900 dark:to-gray-800 p-4">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4 dark:text-red-400" />
      <h1 className="text-4xl font-bold text-slate-800 mb-2 dark:text-slate-200 text-center">{t('pages.notFound.title')}</h1>
      <p className="text-slate-600 mb-6 text-center max-w-md dark:text-slate-400">{t('pages.notFound.description')}</p>
      <Button asChild size="lg">
        <Link to="/streams">{t('pages.notFound.backToStreams')}</Link>
      </Button>
    </div>
  )
}

export default NotFound
