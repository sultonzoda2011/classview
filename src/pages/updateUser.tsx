import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import UserForm from '../components/forms/user-form'
import { Skeleton } from '../components/ui/skeleton'
import { useGetUserByIdQuery } from '../store/usersApi'

const UpdateUser = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { data: user, isLoading } = useGetUserByIdQuery(id ?? '', { skip: !id })

  return (
    <section>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('users.updateUser')}</h1>
      {isLoading || !user ? <Skeleton className="h-96 max-w-2xl mx-auto rounded-2xl" /> : <UserForm user={user} />}
    </section>
  )
}

export default UpdateUser
