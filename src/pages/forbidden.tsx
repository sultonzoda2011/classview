import { Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const Forbidden = () => {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800">
      <Lock className="w-16 h-16 text-amber-500 mb-4 dark:text-amber-400" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2 dark:text-gray-200">
        {t('pages.forbidden.title')}
      </h1>
      <p className="text-gray-600 mb-6 text-center max-w-md dark:text-gray-400">
        {t('pages.forbidden.description')}
      </p>
      <Link
        to="/login"
        className="px-6 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-900 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        {t('pages.forbidden.backToLogin')}
      </Link>
    </div>
  )
}

export default Forbidden
