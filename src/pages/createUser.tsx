import { useTranslation } from 'react-i18next'
import UserForm from '../components/forms/user-form'

const CreateUser = () => {
  const { t } = useTranslation()
  return (
    <section>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('users.createUser')}</h1>
      <UserForm />
    </section>
  )
}

export default CreateUser
