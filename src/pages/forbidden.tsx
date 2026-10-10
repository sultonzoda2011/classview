import { Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

const Forbidden = () => {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4">
      <Lock className="w-16 h-16 text-amber-500 mb-4 dark:text-amber-400" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2 dark:text-gray-200 text-center">{t('pages.forbidden.title')}</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md dark:text-gray-400">{t('pages.forbidden.description')}</p>
      <Button asChild size="lg" variant="secondary">
        <Link to="/login">{t('pages.forbidden.backToLogin')}</Link>
      </Button>
    </div>
  )
}

export default Forbidden
